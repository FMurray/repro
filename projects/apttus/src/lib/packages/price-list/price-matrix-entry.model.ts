import {SObject} from '../../utils/sobject.model';

export interface PriceMatrixEntry extends SObject{
	Apttus_Config2__AdjustmentAmount__c:	number;
	Apttus_Config2__AdjustmentType__c:	string;
	Apttus_Config2__BandSize__c:	number;
	Apttus_Config2__condition__c:	string;
	Apttus_Config2__Dimension1Value__c:	string;
	Apttus_Config2__Dimension2Value__c:	string;
	Apttus_Config2__Dimension3Value__c:	string;
	Apttus_Config2__Dimension4Value__c:	string;
	Apttus_Config2__Dimension5Value__c:	string;
	Apttus_Config2__Dimension6Value__c:	string;
	Apttus_Config2__PeriodEndDate__c:	Date
	Apttus_Config2__EndFactor__c:	number;
	Apttus_Config2__EntryKey__c:	string;
	Apttus_Config2__FlatPrice__c:	number;
	Apttus_Config2__TierStartValue__c:	number;
	Apttus_Config2__IsIncluded__c:	boolean;
	Apttus_Config2__PriceMatrixId__c:	string;
	Apttus_Config2__PriceOverride__c:	number;
	Apttus_Config2__Sequence__c:	number;
	Apttus_Config2__PeriodStartDate__c:	Date
	Apttus_Config2__StartFactor__c:	number;
	Apttus_Config2__TierEndValue__c:	number;
	Apttus_Config2__UsageRate__c:	number;
}

export function PriceMatrixEntryFactory(): PriceMatrixEntry{
	return {
		_type: 'Apttus_Config2__PriceMatrixEntry__c',
		Apttus_Config2__AdjustmentAmount__c:	null,
		Apttus_Config2__AdjustmentType__c:	null,
		Apttus_Config2__BandSize__c:	null,
		Apttus_Config2__condition__c:	null,
		Apttus_Config2__Dimension1Value__c:	null,
		Apttus_Config2__Dimension2Value__c:	null,
		Apttus_Config2__Dimension3Value__c:	null,
		Apttus_Config2__Dimension4Value__c:	null,
		Apttus_Config2__Dimension5Value__c:	null,
		Apttus_Config2__Dimension6Value__c:	null,
		Apttus_Config2__PeriodEndDate__c:	null,
		Apttus_Config2__EndFactor__c:	null,
		Apttus_Config2__EntryKey__c:	null,
		Apttus_Config2__FlatPrice__c:	null,
		Apttus_Config2__TierStartValue__c:	null,
		Apttus_Config2__IsIncluded__c:	null,
		Apttus_Config2__PriceMatrixId__c:	null,
		Apttus_Config2__PriceOverride__c:	null,
		Apttus_Config2__Sequence__c:	null,
		Apttus_Config2__PeriodStartDate__c:	null,
		Apttus_Config2__StartFactor__c:	null,
		Apttus_Config2__TierEndValue__c:	null,
		Apttus_Config2__UsageRate__c:	null
	} as PriceMatrixEntry;
}