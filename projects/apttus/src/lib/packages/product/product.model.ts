import { SObject, ChildRecord } from "../../utils/sobject.model";
import {
  PriceListItem,
  PriceListItemChildFactory
} from "../price-list/price-list-item.model";
import { ConstraintRuleConditionFactory } from "../constraint-rule/constraint-condition.model";
import { ProductCategoryFactory } from "../category/product-category.model";
import { ProductOptionGroupFactory } from "./product-option-group.model";
import { AttachmentFactory } from "./attachment.model";
import { ProductTranslationFactory } from "./product-translation.model";
import { ProductAttributeGroupMemberFactory } from "../product-attribute/product-attribute-group-member.model";

export interface Product extends SObject {
  Apttus_Config2__IconId__c: string;
  Name: string;
  Apttus_Config2__ConfigurationType__c: string;
  APTSDMP_Ecomm_Frequency__c: string;
  APTSDMP_Ecomm_Product_Description_1__c: string;
  APTSDMP_Ecomm_Product_Description_2__c: string;
  APTSDMP_Ecomm_Product_Description_3__c: string;
  APTSDMP_Ecomm_Product_Description_4__c: string;
  APTSDMP_Ecomm_Product_Description_5__c: string;
  Apttus_Config2__Uom__c: string;
  APTSMD_Long_Description__c: string;
  Description: string;
  Family: string;
  ProductCode: string;
  APTSSP_Product_Height__c: number;
  APTSSP_Product_Width__c: number;
  APTSS_Product_Weight__c: number;
  APTSSP_Product_Length__c: number;
  APTSSP_Measurement_Unit__c: string;
  APTSSP_Weight_Units__c: string;
  Quantity_Avail_Asia_Hub__c: string;
  Quantity_Avail_Germany_Hub__c: string;
  Quantity_Avail_USA_Hub__c: string;
  Apttus_Config2__Categories__r: ChildRecord;
  APTSSP_Available_to_order_until__c: Date;
  APTSSP_Is_orderable__c: string;
  CurrencyIsoCode: string;
  Apttus_Config2__HasAttributes__c: boolean;
  Apttus_Config2__HasDefaults__c: boolean;
  Apttus_Config2__HasOptions__c: boolean;
  Product_Category__c: string;
  ContentDocumentLinks: ChildRecord;
  Attachments: ChildRecord;
  Apttus_Config2__PriceLists__r: ChildRecord;
  Apttus_Config2__ConstraintRuleConditions__r: ChildRecord;
  Apttus_Config2__Translation__r: ChildRecord;
  Apttus_Config2__AttributeGroups__r: ChildRecord;
}

export function ProductFactoryBase(priceListId?: string): Product {
  return {
    Apttus_Config2__IconId__c: null,
    Name: null,
    Apttus_Config2__ConfigurationType__c: null,
    APTSDMP_Ecomm_Frequency__c: null,
    Product_Category__c: null,
    APTSDMP_Ecomm_Product_Description_1__c: null,
    APTSDMP_Ecomm_Product_Description_2__c: null,
    APTSDMP_Ecomm_Product_Description_3__c: null,
    APTSDMP_Ecomm_Product_Description_4__c: null,
    APTSDMP_Ecomm_Product_Description_5__c: null,
    APTSSP_Measurement_Unit__c: null,
    APTSSP_Weight_Units__c: null,
    Apttus_Config2__Uom__c: null,
    APTSMD_Long_Description__c: null,
    Description: null,
    Family: null,
    ProductCode: null,
    APTSSP_Product_Height__c: 0,
    APTSSP_Product_Width__c: 0,
    APTSSP_Product_Length__c: 0,
    APTSS_Product_Weight__c: 0,
    APTSSP_Available_to_order_until__c: null,
    APTSSP_Is_orderable__c: null,
    CurrencyIsoCode: null,
    Apttus_Config2__HasAttributes__c: null,
    Apttus_Config2__HasDefaults__c: null,
    Apttus_Config2__HasOptions__c: null,
    Quantity_Avail_Asia_Hub__c: null,
    Quantity_Avail_Germany_Hub__c: null,
    Quantity_Avail_USA_Hub__c: null,
    _type: "Product2",
    _constraint: "IsActive = TRUE"
  } as Product;
}

export function ProductFactory(priceListId?: string): Product {
  let p = ProductFactoryBase(priceListId);
  return Object.assign(p, {
    Apttus_Config2__PriceLists__r: {
      records: [PriceListItemChildFactory(priceListId)],
      _constraint:
        `WHERE Apttus_Config2__PriceListId__c = '` +
        priceListId +
        `' AND Apttus_Config2__ListPrice__c <> NULL
                    AND (Apttus_Config2__EffectiveDate__c = NULL OR Apttus_Config2__EffectiveDate__c <= TODAY)
                    AND (Apttus_Config2__ExpirationDate__c = NULL OR Apttus_Config2__ExpirationDate__c >= TODAY)
                    ORDER BY CreatedDate DESC LIMIT 1
                    `
    } as ChildRecord,
    Apttus_Config2__Categories__r: {
      records: [ProductCategoryFactory(priceListId)]
    } as ChildRecord,
    Apttus_Config2__ConstraintRuleConditions__r: {
      records: [ConstraintRuleConditionFactory(priceListId)],
      _constraint: `WHERE (Apttus_Config2__ConstraintRuleId__r.Apttus_Config2__EffectiveDate__c = null OR Apttus_Config2__ConstraintRuleId__r.Apttus_Config2__EffectiveDate__c <= TODAY) 
                        AND (Apttus_Config2__ConstraintRuleId__r.Apttus_Config2__ExpirationDate__c = null OR Apttus_Config2__ConstraintRuleId__r.Apttus_Config2__ExpirationDate__c >= TODAY)`
    } as ChildRecord,
    Attachments: {
      records: [AttachmentFactory()]
    } as ChildRecord,
    Apttus_Config2__Translation__r: {
      records: [ProductTranslationFactory()]
    } as ChildRecord,
    Apttus_Config2__AttributeGroups__r: {
      records: [ProductAttributeGroupMemberFactory()]
    }
  }) as Product;
}

export type RelatedType = "Related" | "Similar";
