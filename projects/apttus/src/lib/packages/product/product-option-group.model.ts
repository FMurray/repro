import {SObject, ChildRecord} from '../../utils/sobject.model';
import {Product, ProductFactory} from './product.model';
import {Category, CategoryFactory} from '../category/category.model';

export interface ProductOptionGroup extends SObject{
  Name: string,
  Apttus_Config2__ContentType__c: string,
  Apttus_Config2__Sequence__c: number,
  Apttus_Config2__Options__r : ChildRecord,
  Apttus_Config2__OptionGroupId__r : Category
}

export interface ProductOptionComponent extends SObject{
  Name: string,
  Apttus_Config2__ParentProductId__c: string,
  Apttus_Config2__ParentProductId__r: Product,
  Apttus_Config2__ComponentProductId__r : Product,
  Apttus_Config2__MinQuantity__c : number
}

export function ProductOptionGroupFactory(priceListId: string): ProductOptionGroup{
  return {
      _type : 'Apttus_Config2__ProductOptionGroup__c',
      Name : null,
      Apttus_Config2__ContentType__c : null,
      Apttus_Config2__Sequence__c : 0,
      Apttus_Config2__OptionGroupId__r : CategoryFactory(priceListId),
      Apttus_Config2__Options__r : {
        records : [ProductOptionComponentFactory(priceListId)],
        _constraint : `WHERE Apttus_Config2__ParentProductId__c IN (SELECT Apttus_Config2__ProductId__c FROM Apttus_Config2__PriceListItem__c WHERE Apttus_Config2__PriceListId__c = '` + priceListId + `')`
      } as ChildRecord
  } as ProductOptionGroup
}

export function ProductOptionComponentFactory(priceListId: string): ProductOptionComponent{
  return {
    _type : 'Apttus_Config2__ProductOptionComponent__c',
    Name : null,
    Apttus_Config2__ParentProductId__c: null,
    Apttus_Config2__ParentProductId__r : ProductFactory(priceListId),
    Apttus_Config2__ComponentProductId__r : ProductFactory(priceListId),
    Apttus_Config2__MinQuantity__c : 0
  } as ProductOptionComponent
}
