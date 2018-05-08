import { ShippingOption } from "./shipping-option.model";

export function ShippingOptionFactory(): ShippingOption {
  return {
    _type: "APTSSP_Shipping_Option__c",
    APTSS_Article_number_SAP__c: null,
    APTSS_Estimated_Time__c: null,
    APTSS_Material_Bezeichnung_DE__c: null,
    APTSS_Max_Weight__c: 0,
    APTSS_Min_Weight__c: 0,
    APTSS_Price__c: 0,
    APTSS_Region__c: null,
    APTSS_Speed__c: null,
    APTSS_Units__c: null
  } as ShippingOption;
}
