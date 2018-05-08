import {SObject, ChildRecord} from '../../utils/sobject.model';
import {PriceRuleEntryFactory} from './price-rule-entry.model';

export interface PriceRule extends SObject{
    Apttus_Config2__BeneficiaryId__c: string;
    Apttus_Config2__BeneficiaryType__c : string;
    Apttus_Config2__BenefitType__c: string;
    Apttus_Config2__AdjustmentAppliesTo__c: string;
    Apttus_Config2__RuleEntries__r: ChildRecord;
}

export function PriceRuleFactory(): PriceRule{
    return {
        Apttus_Config2__BeneficiaryId__c: null,
        Apttus_Config2__BeneficiaryType__c : null,
        Apttus_Config2__BenefitType__c: null,
        Apttus_Config2__AdjustmentAppliesTo__c: null,
        Apttus_Config2__RuleEntries__r: {
            records : [PriceRuleEntryFactory()],
            _constraint : 'ORDER BY Apttus_Config2__Sequence__c ASC'
        } as ChildRecord
    } as PriceRule
}