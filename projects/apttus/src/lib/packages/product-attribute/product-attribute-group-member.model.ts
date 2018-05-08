import {SObject} from '../../utils/sobject.model';
import {ProductAttributeGroupFactory, ProductAttributeGroup} from './product-attribute-group.model';

export interface ProductAttributeGroupMember extends SObject{
	Apttus_Config2__AttributeGroupId__r: ProductAttributeGroup;
	Apttus_Config2__FieldUpdateCriteriaIds__c: string;
	Apttus_Config2__ProductId__c: string;
	Apttus_Config2__Sequence__c: number;
}

export function ProductAttributeGroupMemberFactory(): ProductAttributeGroupMember{
	return {
		_type : 'Apttus_Config2__ProductAttributeGroupMember__c',
		Apttus_Config2__AttributeGroupId__r: ProductAttributeGroupFactory(),
		Apttus_Config2__FieldUpdateCriteriaIds__c: null,
		Apttus_Config2__ProductId__c: null,
		Apttus_Config2__Sequence__c: null
	} as ProductAttributeGroupMember
}