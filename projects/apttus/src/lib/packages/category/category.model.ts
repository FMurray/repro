import { SObject, ChildRecord } from "../../utils/sobject.model";
import { Product, ProductFactoryBase } from "../product/product.model";
import { CategoryTranslationFactory } from "./category-translation.model";
import { AttachmentFactory } from "../product/attachment.model";

export interface Category extends SObject {
  Apttus_Config2__AncestorId__c: string;
  Apttus_Config2__PrimordialId__c: string;
  Apttus_Config2__Description__c: string;
  Apttus_Config2__HierarchyId__c: string;
  Apttus_Config2__IsLeaf__c: string;
  Apttus_Config2__Label__c: string;
  Apttus_Config2__ProductCount__c: number;
  Apttus_Config2__IsHidden__c: boolean;
  Fade_Out__c: string;
  APTSMD_Primary_Product__r: Product;
  Children: Array<Category>;
  Name: string;
  Apttus_Config2__Translation__r: ChildRecord;
  Attachments: ChildRecord;
  Is_Featured__c: string;
  Feature_Type__c: string;
}

export function CategoryFactory(priceListId: string): Category {
  return {
    _type: "Apttus_Config2__ClassificationHierarchy__c",
    _order: "ORDER BY Apttus_Config2__ProductCount__c DESC",
    Name: null,
    Apttus_Config2__ProductCount__c: 0,
    Apttus_Config2__AncestorId__c: null,
    Apttus_Config2__PrimordialId__c: null,
    Apttus_Config2__Description__c: null,
    Apttus_Config2__HierarchyId__c: null,
    Apttus_Config2__IsLeaf__c: null,
    Apttus_Config2__Label__c: null,
    Fade_Out__c: null,
    Apttus_Config2__IsHidden__c: null,
    APTSMD_Primary_Product__r: ProductFactoryBase(priceListId),
    Apttus_Config2__Translation__r: {
      records: [CategoryTranslationFactory()]
    } as ChildRecord,
    Attachments: {
      records: [AttachmentFactory()]
    } as ChildRecord,
    Is_Featured__c: null,
    Feature_Type__c: null
  } as Category;
}
