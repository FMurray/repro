import {SObject, ChildRecord} from '../../utils/sobject.model';
import {PriceListFactory, PriceList} from '../price-list/price-list.model';
import {Product, ProductFactory} from '../product/product.model';
import {Storefront, StoreFactory} from '../storefront/storefront.model';

export interface Promotion extends SObject{
  Image_Only__c: boolean;
  Price_List__r: PriceList;
  APTSMD_Promotional_Product__r : Product;
  APTSMD_Promotion_Price__c : number;
  Type__c : string;
  Image_Name__c: string;
  Logo_Name__c: string;
  APTSMD_Store__r : Storefront,
  Subtitle__c : string;
  ContentDocumentLinks : ChildRecord;
}

export function PromotionFactory(priceListId): Promotion{
  return {
    _type : 'APTSMD_Ecommerce_Promotions__c',
    Image_Only__c : false,
    Image_Name__c : null,
    Logo_Name__c : null,
    Price_List__r : PriceListFactory(),
    APTSMD_Promotional_Product__r : ProductFactory(priceListId),
    APTSMD_Promotion_Price__c : 0,
    Type__c : null,
    APTSMD_Store__r : StoreFactory(),
    Subtitle__c : null
  } as Promotion
}
