import {SObject, ChildRecord} from '../../utils/sobject.model';

export interface ProductTranslation extends SObject{
    Apttus_Config2__Description__c:    string; 
    Apttus_Config2__Family__c:    string;
    Apttus_Config2__Language__c:    string;
    Apttus_Config2__Name__c:    string;
    Apttus_Config2__ProductId__c:    string; 
    Apttus_Config2__ProductCode__c:    string;
    Short_Description__c: string;
    APTSDMP_Ecomm_Frequency__c: string;
    APTSDMP_Ecomm_Product_Description_1__c: string;
    APTSDMP_Ecomm_Product_Description_2__c: string;
    APTSDMP_Ecomm_Product_Description_3__c: string;
    APTSDMP_Ecomm_Product_Description_4__c: string;
    APTSDMP_Ecomm_Product_Description_5__c: string;
    APTSDMP_Ecomm_UoM__c: string;
    APTSMD_Long_Description__c: string;
    Quotation_Text__c: string;
}

export function ProductTranslationFactory(): ProductTranslation{
    return {
        Apttus_Config2__Description__c:    null, 
        Apttus_Config2__Family__c:    null,
        Apttus_Config2__Language__c:    null,
        Apttus_Config2__Name__c:    null,
        Apttus_Config2__ProductId__c:    null, 
        Apttus_Config2__ProductCode__c:    null,
        Short_Description__c: null,
        APTSDMP_Ecomm_Frequency__c: null,
        APTSDMP_Ecomm_Product_Description_1__c: null,
        APTSDMP_Ecomm_Product_Description_2__c: null,
        APTSDMP_Ecomm_Product_Description_3__c: null,
        APTSDMP_Ecomm_Product_Description_4__c: null,
        APTSDMP_Ecomm_Product_Description_5__c: null,
        APTSDMP_Ecomm_UoM__c: null,
        APTSMD_Long_Description__c: null,
        Quotation_Text__c: null
    } as ProductTranslation;
}