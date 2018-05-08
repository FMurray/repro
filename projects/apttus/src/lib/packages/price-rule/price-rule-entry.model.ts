import {SObject, ChildRecord} from '../../utils/sobject.model';

export interface PriceRuleEntry extends SObject{
    Apttus_Config2__Sequence__c: number;
    Apttus_Config2__AdjustmentType__c: string;
    Apttus_Config2__AdjustmentAmount__c: number;
}

export function PriceRuleEntryFactory(): PriceRuleEntry{
    return {
        Apttus_Config2__Sequence__c: 0,
        Apttus_Config2__AdjustmentType__c : null,
        Apttus_Config2__AdjustmentAmount__c : null
    } as PriceRuleEntry
}