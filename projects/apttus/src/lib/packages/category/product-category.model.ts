import {SObject, ChildRecord} from '../../utils/sobject.model';
import {Category, CategoryFactory} from './category.model';

export interface ProductCategory extends SObject{
  Apttus_Config2__ClassificationId__r: Category;
  Apttus_Config2__ClassificationId__c: string;
  Apttus_Config2__Default__c: boolean;
  Apttus_Config2__DefaultQuantity__c: number;
  Apttus_Config2__MaxQuantity__c: number;
  Apttus_Config2__MinQuantity__c: number;
  Apttus_Config2__Sequence__c: number;
  Apttus_Config2__ProductId__c: string;
}



export function ProductCategoryFactory(priceListId: string): ProductCategory{
  return {
    _type : 'Apttus_Config2__ProductClassification__c',
    Apttus_Config2__ClassificationId__r: CategoryFactory(priceListId),
    Apttus_Config2__ClassificationId__c : null,
    Apttus_Config2__Default__c: null,
    Apttus_Config2__DefaultQuantity__c: null,
    Apttus_Config2__MaxQuantity__c: null,
    Apttus_Config2__MinQuantity__c: null,
    Apttus_Config2__Sequence__c: null,
    Apttus_Config2__ProductId__c: null
  } as ProductCategory;
}
