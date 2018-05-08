import {SObject} from '../../utils/sobject.model';

export interface SummaryGroup extends SObject{
  Name : string;
  Apttus_Config2__GroupType__c : string;
  Apttus_Config2__LineNumber__c : number;
  Apttus_Config2__LineType__c : string;
  Apttus_Config2__BaseExtendedCost__c : number;
  Apttus_Config2__OptionCost__c : number;
  Apttus_Config2__ExtendedCost__c : number;
  Apttus_Config2__ExtendedListPrice__c : number;
  Apttus_Config2__BaseExtendedPrice__c : number;
  Apttus_Config2__OptionPrice__c : number;
  Apttus_Config2__ExtendedRollupPrice__c : number;
  Apttus_Config2__ExtendedPrice__c : number;
  Apttus_Config2__NetPrice__c : number;
}

export function SummaryGroupFactory(): SummaryGroup{
  return {
    Name : null,
    Apttus_Config2__GroupType__c : null,
    Apttus_Config2__LineNumber__c : 0,
    Apttus_Config2__LineType__c : null,
    Apttus_Config2__BaseExtendedCost__c : 0,
    Apttus_Config2__OptionCost__c : 0,
    Apttus_Config2__ExtendedCost__c : 0,
    Apttus_Config2__ExtendedListPrice__c : 0,
    Apttus_Config2__BaseExtendedPrice__c : 0,
    Apttus_Config2__OptionPrice__c : 0,
    Apttus_Config2__ExtendedRollupPrice__c : 0,
    Apttus_Config2__ExtendedPrice__c : 0,
    Apttus_Config2__NetPrice__c : 0,
    _type : 'Apttus_Config2__SummaryGroup__c'
  } as SummaryGroup;
}
