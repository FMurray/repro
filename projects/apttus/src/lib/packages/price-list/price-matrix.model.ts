import {SObject, ChildRecord} from '../../utils/sobject.model';
import {PriceDimension, PriceDimensionFactory} from './price-dimension.model';
import {PriceListItem, PriceListItemFactory} from './price-list-item.model';
import {PriceMatrixEntryFactory} from './price-matrix-entry.model';

export interface PriceMatrix extends SObject{
  Apttus_Config2__Description__c: string;
  Apttus_Config2__Dimension1Id__r: PriceDimension;
  Apttus_Config2__Dimension1ValueType__c:  string;
  Apttus_Config2__Dimension2Id__r: PriceDimension;
  Apttus_Config2__Dimension2ValueType__c:  string;
  Apttus_Config2__Dimension3Id__r: PriceDimension;
  Apttus_Config2__Dimension3ValueType__c:  string;
  Apttus_Config2__Dimension4Id__r: PriceDimension;
  Apttus_Config2__Dimension4ValueType__c:  string;
  Apttus_Config2__Dimension5Id__r: PriceDimension;
  Apttus_Config2__Dimension5ValueType__c:  string;
  Apttus_Config2__Dimension6Id__r: PriceDimension;
  Apttus_Config2__Dimension6ValueType__c:  string;
  Apttus_Config2__EnableDateRange__c:  boolean;
  Apttus_Config2__InitialRows__c:  number;
  Apttus_Config2__IsCumulativeRange__c:  boolean;
  Apttus_Config2__MatrixType__c: string;
  Apttus_Config2__NumberOfEntries__c:  number;
  Apttus_Config2__PriceListItemId__c: string;
  Apttus_Config2__Sequence__c: number;
  Apttus_Config2__MatrixEntries__r: ChildRecord;
}

export function PriceMatrixFactory(priceListId: string): PriceMatrix{
  let o = PriceMatrixChildFactory(priceListId);
  return Object.assign(o, {
     Apttus_Config2__MatrixEntries__r: {
        records : [PriceMatrixEntryFactory()]
      } as ChildRecord
    });
}


export function PriceMatrixChildFactory(priceListId: string): PriceMatrix{
  return {
      _type: 'Apttus_Config2__PriceMatrix__c',
      _constraint : `Apttus_Config2__PriceListItemId__r.Apttus_Config2__PriceListId__c = '` + priceListId + `'`,
      Apttus_Config2__Description__c: null,
      Apttus_Config2__Dimension1Id__r: PriceDimensionFactory(),
      Apttus_Config2__Dimension1ValueType__c:  null,
      Apttus_Config2__Dimension2Id__r: PriceDimensionFactory(),
      Apttus_Config2__Dimension2ValueType__c:  null,
      Apttus_Config2__Dimension3Id__r: PriceDimensionFactory(),
      Apttus_Config2__Dimension3ValueType__c:  null,
      Apttus_Config2__Dimension4Id__r: PriceDimensionFactory(),
      Apttus_Config2__Dimension4ValueType__c:  null,
      Apttus_Config2__Dimension5Id__r: PriceDimensionFactory(),
      Apttus_Config2__Dimension5ValueType__c:  null,
      Apttus_Config2__Dimension6Id__r: PriceDimensionFactory(),
      Apttus_Config2__Dimension6ValueType__c:  null,
      Apttus_Config2__EnableDateRange__c:  null,
      Apttus_Config2__InitialRows__c:  null,
      Apttus_Config2__IsCumulativeRange__c:  null,
      Apttus_Config2__MatrixType__c: null,
      Apttus_Config2__NumberOfEntries__c:  null,
      Apttus_Config2__PriceListItemId__c: null,
      Apttus_Config2__Sequence__c: null
  } as PriceMatrix;
}