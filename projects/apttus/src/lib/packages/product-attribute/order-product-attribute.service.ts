import { SObjectService } from "../../utils/sobject.model";
import {
  OrderProductAttributeValueFactory,
  KukaProductAttributeValue
} from "./product-attribute.model";
import { KukaOrder } from "../order/order.model";
import { Observable } from "rxjs/Observable";

export class ProductAttributeValueService extends SObjectService {
  type = OrderProductAttributeValueFactory();

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
