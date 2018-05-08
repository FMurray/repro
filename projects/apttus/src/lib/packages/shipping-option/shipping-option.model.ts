import { SObject } from "../../utils/sobject.model";

export interface ShippingOption extends SObject {
  APTSS_Article_number_SAP__c: string;
  APTSS_Estimated_Time__c: string;
  APTSS_Material_Bezeichnung_DE__c: string;
  APTSS_Max_Weight__c: number;
  APTSS_Min_Weight__c: number;
  APTSS_Price__c: number;
  APTSS_Region__c: string;
  APTSS_Speed__c: string;
  APTSS_Units__c: string;
}
