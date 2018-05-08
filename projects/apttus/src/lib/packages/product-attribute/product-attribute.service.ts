import { SObjectService } from "../../utils/sobject.model";
import {
  ProductAttributeFactory,
  ProductAttribute,
  KukaProductAttributeValue
} from "./product-attribute.model";
import { Product } from "../product/product.model";
import { Observable } from "rxjs/Observable";
import * as _ from "lodash";
import { ProductAttributeValueFactory, ProductAttributeValue } from ".";
import {
  OrderProductAttributeValueFactory,
  OrderProductAttributeValue
} from "./product-attribute-value.model";
import { Cart, KukaOrder } from "..";

export class ProductAttributeService extends SObjectService {
  type = ProductAttributeFactory();

  getProductAttributes(product: Product): Observable<Array<ProductAttribute>> {
    return this.where(
      `Apttus_Config2__AttributeGroupId__c IN (SELECT Apttus_Config2__AttributeGroupId__c FROM Apttus_Config2__ProductAttributeGroupMember__c WHERE Apttus_Config2__ProductId__c = '` +
        product.Id +
        `')`,
      "pag:" + product.Id
    ).flatMap(attributes => {
      let obsvArray = [];
      attributes.forEach(attribute => {
        let obj = {
          object:
            attribute.Apttus_Config2__AttributeGroupId__r
              .Apttus_Config2__BusinessObject__c,
          field: attribute.Apttus_Config2__Field__c,
          picklist: null
        };
        obsvArray.push(
          this.cacheService
            .get("describe:" + JSON.stringify(obj), () =>
              this.forceService.post("/guest/describe", obj)
            )
            .filter(res => res != null)
        );
      });
      return Observable.combineLatest(obsvArray).map(res => {
        attributes.forEach(attribute => {
          res.forEach(describe => {
            if (describe.name == attribute.Apttus_Config2__Field__c)
              attribute._describe = describe;
          });
        });
        return attributes;
      });
    });
  }
}

export class OrderProductAttributeService extends SObjectService {
  type: OrderProductAttributeValue = OrderProductAttributeValueFactory();

  public getProductAttributeValuesForOrder(
    order: KukaOrder
  ): Observable<Array<KukaProductAttributeValue>> {
    return this.where(
      `Apttus_Config2__LineItemId__r.Apttus_Config2__OrderId__c = '` +
        order.Id +
        `'`,
      `pav:` + order.Id
    );
  }
}
