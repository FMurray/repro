import {SObject} from '../../utils/sobject.model';

export interface ProductAttributeGroup extends SObject{
	Apttus_Config2__AttributeValueMatrixId__c: string;
	Apttus_Config2__BusinessObject__c: string;
	Apttus_Config2__Description__c: string;
	Apttus_Config2__TwoColumnAttributeDisplay__c: string;
}

export function ProductAttributeGroupFactory(): ProductAttributeGroup{
	return {
		_type : 'Apttus_Config2__ProductAttributeGroup__c',
		Apttus_Config2__AttributeValueMatrixId__c: null,
		Apttus_Config2__BusinessObject__c: null,
		Apttus_Config2__Description__c: null,
		Apttus_Config2__TwoColumnAttributeDisplay__c: null
	} as ProductAttributeGroup
}