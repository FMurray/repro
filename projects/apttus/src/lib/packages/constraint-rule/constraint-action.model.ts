import {Product, ProductFactory} from '../product/product.model';
import {SObject} from '../../utils/sobject.model';

export interface ConstraintRuleAction extends SObject{
  Apttus_Config2__ProductId__c : string;
  Apttus_Config2__ProductId__r : Product;
  Apttus_Config2__ConstraintRuleId__c: string;
  Apttus_Config2__Message__c: string;
}

export function ConstraintRuleActionFactory(priceListId: string): ConstraintRuleAction{
  return {
    Apttus_Config2__ProductId__c : null,
    Apttus_Config2__ConstraintRuleId__c : null,
    Apttus_Config2__Message__c : null,
    Apttus_Config2__ProductId__r : ProductFactory(priceListId),
    _type : 'Apttus_Config2__ConstraintRuleAction__c'
  } as ConstraintRuleAction
}
