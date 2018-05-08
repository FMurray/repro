import {SObject, ChildRecord} from '../../utils/sobject.model';
import {CategoryFactory} from './category.model';

export interface Classification extends SObject{
  Apttus_Config2__HierarchyLabel__c: string;
  Apttus_Config2__Type__c: string;
  Apttus_Config2__CategoryHierarchies__r: ChildRecord;
}

export function ClassificationFactory(priceListId: string): Classification{
  return {
    _type : 'Apttus_Config2__ClassificationName__c',
    Apttus_Config2__Type__c : null,
    Apttus_Config2__HierarchyLabel__c : null,
    Apttus_Config2__CategoryHierarchies__r : {
      records : [CategoryFactory(priceListId)],
      _constraint : `WHERE (Apttus_Config2__AncestorId__c <> null OR Apttus_Config2__IsLeaf__c = \'no\')`
    } as ChildRecord
  } as Classification;
}
