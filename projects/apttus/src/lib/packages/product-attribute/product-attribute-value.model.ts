import { SObject } from "../../utils/sobject.model";

export interface ProductAttributeValue extends SObject {
  Apttus_Config2__BillingOffsetDays__c: number;
  Apttus_Config2__Color__c: string;
  Apttus_Config2__IsTransient__c: boolean;
  Apttus_Config2__LineItemId__c: string;
  Apttus_Config2__Vendor__c: string;
  APTSDMP_Xpert_Term__c: string;
  APTSDMP_Xpert_Quantity__c: number;
  Xpert_Type__c: string;
}

export function ProductAttributeValueFactory(): ProductAttributeValue {
  return {
    _type: "Apttus_Config2__ProductAttributeValue__c",
    Apttus_Config2__BillingOffsetDays__c: null,
    Apttus_Config2__Color__c: null,
    Apttus_Config2__IsTransient__c: null,
    Apttus_Config2__LineItemId__c: null,
    Apttus_Config2__Vendor__c: null,
    APTSDMP_Xpert_Term__c: null,
    APTSDMP_Xpert_Quantity__c: null,
    Xpert_Type__c: null
  } as ProductAttributeValue;
}

export interface OrderProductAttributeValue extends SObject {
  Apttus_Config2__LineItemId__c: string;
  APTSDMP_Xpert_Term__c: string;
  Xpert_Type__c: string;
  APTSDMP_Xpert_Quantity__c: number;
}

export function OrderProductAttributeValueFactory(): OrderProductAttributeValue {
  return {
    _type: "Apttus_Config2__OrderProductAttributeValue__c",
    Apttus_Config2__LineItemId__c: null,
    APTSDMP_Xpert_Term__c: null,
    Xpert_Type__c: null,
    APTSDMP_Xpert_Quantity__c: null
  } as OrderProductAttributeValue;
}
