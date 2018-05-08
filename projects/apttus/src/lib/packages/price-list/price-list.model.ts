import {SObject} from '../../utils/sobject.model';
import {ProductFactory, Product} from '../product/product.model';

export interface PriceList extends SObject{
  Name: string;
  Apttus_Config2__AccountId__c: string;
  CurrencyIsoCode: string;
  Apttus_Config2__BasedOnPriceListId__r : PriceList;
  Apttus_Config2__BasedOnAdjustmentAmount__c: number;
  Apttus_Config2__BasedOnAdjustmentType__c: string;
  Apttus_Config2__BasedOnPriceListId__c : string;
}

export function PriceListBase(): PriceList{
    return {
        Name : null,
        Apttus_Config2__AccountId__c: null,
        CurrencyIsoCode : null,
        Apttus_Config2__BasedOnAdjustmentAmount__c : 0,
        Apttus_Config2__BasedOnPriceListId__c : null,
        Apttus_Config2__BasedOnAdjustmentType__c : null,
        _type : 'Apttus_Config2__PriceList__c'
    } as PriceList;
}

export function PriceListFactory(): PriceList{
  let p = PriceListBase();
  return Object.assign(p, {
      Apttus_Config2__BasedOnPriceListId__r : PriceListBase()
  })
}
