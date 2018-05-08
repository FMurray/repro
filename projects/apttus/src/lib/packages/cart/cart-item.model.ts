import {SObject, ChildRecord} from '../../utils/sobject.model';
import {Product, ProductFactory} from '../product/product.model';
import {PriceListItem, PriceListItemFactory} from '../price-list/price-list-item.model';
import {PriceList, PriceListFactory} from '../price-list/price-list.model';
import {ProductAttributeValue, ProductAttributeValueFactory} from '../product-attribute/product-attribute-value.model';
import {SummaryGroup, SummaryGroupFactory} from './summary-group.model';

export interface CartItem extends SObject{
  Apttus_Config2__LineNumber__c: number;
  Apttus_Config2__PrimaryLineNumber__c : number;
  Apttus_Config2__ProductId__r : Product;
  Apttus_Config2__ProductId__c : string;
  Apttus_Config2__Quantity__c : number;
  Apttus_Config2__ListPrice__c : number;
  Apttus_Config2__BasePrice__c : number;
  Apttus_Config2__ExtendedPrice__c : number;
  Apttus_Config2__NetPrice__c : number;
  Apttus_Config2__NetUnitPrice__c : number;
  Apttus_Config2__PriceListItemId__r : PriceListItem;
  Apttus_Config2__PriceListItemId__c : string;
  Apttus_Config2__PriceListId__c : string;
  Apttus_Config2__PriceListId__r : PriceList;
  Apttus_Config2__SummaryGroupId__r : SummaryGroup;
  Apttus_Config2__ConfigurationId__c: string;
  Apttus_Config2__ItemSequence__c : number;
  Apttus_Config2__IsPrimaryLine__c : boolean;
  Apttus_Config2__ConfigStatus__c: string;
  Apttus_Config2__ConstraintCheckStatus__c : string;
  Apttus_Config2__PricingStatus__c : string;
  Apttus_Config2__ProductAttributeValues__r : ChildRecord;
  Apttus_Config2__AttributeValueId__r : ProductAttributeValue
}

export function CartItemFactory(priceListId: string): CartItem{
  return Object.assign(CartItemChildFactory(priceListId), {
    Apttus_Config2__ProductAttributeValues__r : {
        records : [ProductAttributeValueFactory()]
      } as ChildRecord
  });
}

export function CartItemChildFactory(priceListId: string): CartItem{
    return {
      _type : 'Apttus_Config2__LineItem__c',
      Apttus_Config2__LineNumber__c : null,
      Apttus_Config2__PrimaryLineNumber__c : null,
      Apttus_Config2__ProductId__r : ProductFactory(priceListId),
      Apttus_Config2__ProductId__c : null,
      Apttus_Config2__Quantity__c : 0,
      Apttus_Config2__ItemSequence__c : null,
      Apttus_Config2__ConfigurationId__c : null,
      Apttus_Config2__ListPrice__c : null,
      Apttus_Config2__BasePrice__c : null,
      Apttus_Config2__ExtendedPrice__c : null,
      Apttus_Config2__NetPrice__c : null,
      Apttus_Config2__NetUnitPrice__c : null,
      Apttus_Config2__PriceListItemId__c : null,
      Apttus_Config2__PriceListId__c : null,
      Apttus_Config2__IsPrimaryLine__c : true,
      Apttus_Config2__ConfigStatus__c : 'NA',
      Apttus_Config2__ConstraintCheckStatus__c : 'NA',
      Apttus_Config2__PricingStatus__c : 'Pending',
      Apttus_Config2__AttributeValueId__r : ProductAttributeValueFactory(),
      Apttus_Config2__PriceListItemId__r : PriceListItemFactory(priceListId),
      Apttus_Config2__PriceListId__r : PriceListFactory(),
      Apttus_Config2__SummaryGroupId__r : SummaryGroupFactory()
    } as CartItem;
}
