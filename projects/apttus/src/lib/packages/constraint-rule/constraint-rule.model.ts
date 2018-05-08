import {ChildRecord, SObject} from '../../utils/sobject.model';
import {ConstraintRuleConditionFactory} from './constraint-condition.model';
import {ConstraintRuleActionFactory} from './constraint-action.model';


export interface ConstraintRule extends SObject{
	Apttus_Config2__ConstraintRuleConditions__r: ChildRecord,
	Apttus_Config2__ConstraintRuleActions__r : ChildRecord
	Name: string,
	Apttus_Config2__EffectiveDate__c: Date,
	Apttus_Config2__ExpirationDate__c: Date
}

export function ConstraintRuleFactory(priceListId: string){
	return {
		Apttus_Config2__ConstraintRuleConditions__r : {
			records : [ConstraintRuleConditionFactory(priceListId)]
		} as ChildRecord,
		Apttus_Config2__ConstraintRuleActions__r : {
			records : [ConstraintRuleActionFactory(priceListId)]
		} as ChildRecord,
		Name : null,
		Apttus_Config2__EffectiveDate__c : null,
		Apttus_Config2__ExpirationDate__c : null
	} as ConstraintRule
}