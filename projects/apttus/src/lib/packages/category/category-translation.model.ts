import {SObject} from '../../utils/sobject.model';

export interface CategoryTranslation extends SObject{
  Apttus_Config2__CategoryHierarchy__c: string;
  APTSSP_KUKA_Category_ID__c: string;
  Apttus_Config2__Label__c: string;
  Apttus_Config2__Language__c: string;
  Name: string;
}



export function CategoryTranslationFactory(): CategoryTranslation{
  return {
    _type : 'Apttus_Config2__CategoryTranslation__c',
    Name : null,
    Apttus_Config2__CategoryHierarchy__c : null,
    APTSSP_KUKA_Category_ID__c: null,
    Apttus_Config2__Label__c: null,
    Apttus_Config2__Language__c: null
  } as CategoryTranslation;
}
