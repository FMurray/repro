import {SObject} from '../../utils/sobject.model';
import {ProductAttribute, ProductAttributeFactory} from '../product-attribute/product-attribute.model';

export interface PriceDimension extends SObject{
	Apttus_Config2__AttributeId__r: 	ProductAttribute;
	Apttus_Config2__BusinessObject__c: string;
	Apttus_Config2__childFilterName__c: 	string;
	Apttus_Config2__contextType__c: 	string;
	Apttus_Config2__cumulativeDimensionId__r : PriceDimension;
	Apttus_Config2__Description__c: 	string;
	Apttus_Config2__Datasource__c: 	string;
	Apttus_Config2__IncentiveId__c: 	string;
	Apttus_Config2__RelationType__c: 	string;
	Apttus_Config2__Type__c: 	string;
}

export function PriceDimensionFactory(): PriceDimension{
	let o = PriceDimensionChildFactory();
	return Object.assign(o, {
		Apttus_Config2__cumulativeDimensionId__r : PriceDimensionChildFactory(),
	});
}

export function PriceDimensionChildFactory(): PriceDimension{
	return {
		_type : 'Apttus_Config2__PriceDimension__c',
		Apttus_Config2__AttributeId__r: 	ProductAttributeFactory(),
		Apttus_Config2__BusinessObject__c: null,
		Apttus_Config2__childFilterName__c: 	null,
		Apttus_Config2__contextType__c: 	null,
		Apttus_Config2__Description__c: 	null,
		Apttus_Config2__Datasource__c: 	null,
		Apttus_Config2__IncentiveId__c: 	null,
		Apttus_Config2__RelationType__c: 	null,
		Apttus_Config2__Type__c: 	null
	} as PriceDimension;
}