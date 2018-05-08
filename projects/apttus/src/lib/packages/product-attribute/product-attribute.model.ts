import { SObject } from "../../utils/sobject.model";
import {
  ProductAttributeGroup,
  ProductAttributeGroupFactory
} from "./product-attribute-group.model";
import {
  ProductAttributeValue,
  ProductAttributeValueFactory
} from "./product-attribute-value.model";

export interface ProductAttribute extends SObject {
  Apttus_Config2__AttributeGroupId__r: ProductAttributeGroup;
  Apttus_Config2__DisplayType__c: string;
  Apttus_Config2__Field__c: string;
  Apttus_Config2__FieldUpdateId__c: string;
  Apttus_Config2__IsHidden__c: boolean;
  Apttus_Config2__IsPrimary__c: boolean;
  Apttus_Config2__IsReadOnly__c: boolean;
  Apttus_Config2__ProductAttributeValueField__c: string;
  Apttus_Config2__Sequence__c: number;
}

export function ProductAttributeFactory(): ProductAttribute {
  return {
    _type: "Apttus_Config2__ProductAttribute__c",
    Apttus_Config2__AttributeGroupId__r: ProductAttributeGroupFactory(),
    Apttus_Config2__DisplayType__c: null,
    Apttus_Config2__Field__c: null,
    Apttus_Config2__FieldUpdateId__c: null,
    Apttus_Config2__IsHidden__c: null,
    Apttus_Config2__IsPrimary__c: null,
    Apttus_Config2__IsReadOnly__c: null,
    Apttus_Config2__ProductAttributeValueField__c: null,
    Apttus_Config2__Sequence__c: null
  } as ProductAttribute;
}

export interface KukaProductAttributeValue extends ProductAttributeValue {
  Xpert_Type__c: string;
  APTSDMP_Xpert_Quantity__c: number;
  APTSDMP_Xpert_Programmer__c: boolean;
  APTSDMP_Xpert_Planner__c: boolean;
  APTSDMP_Xpert_Service__c: boolean;
  APTSDMP_Xpert_Term__c: string;
}

export function KukaProductAttributeValueFactory(): KukaProductAttributeValue {
  let o = ProductAttributeValueFactory();
  return Object.assign(o, {
    Xpert_Type__c: null,
    APTSDMP_Xpert_Quantity__c: null,
    APTSDMP_Xpert_Programmer__c: null,
    APTSDMP_Xpert_Planner__c: null,
    APTSDMP_Xpert_Service__c: null,
    APTSDMP_Xpert_Term__c: null
  });
}
