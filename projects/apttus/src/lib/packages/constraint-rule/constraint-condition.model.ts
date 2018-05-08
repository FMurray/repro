import {Product, ProductFactory} from '../product/product.model';
import {SObject} from '../../utils/sobject.model';

export interface ConstraintRuleCondition extends SObject{
	Apttus_Config2__ProductId__c: string,
	Apttus_Config2__ConstraintRuleId__c : string
}

export function ConstraintRuleConditionFactory(priceListId: string){
	return {
		Apttus_Config2__ProductId__c : null,
		Apttus_Config2__ConstraintRuleId__c: null
	} as ConstraintRuleCondition
}