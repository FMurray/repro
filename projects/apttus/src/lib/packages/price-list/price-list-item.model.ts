import { SObject, ChildRecord } from "../../utils/sobject.model";
import { Product, ProductFactory } from "../product/product.model";
import { PriceList, PriceListFactory } from "./price-list.model";
import {
  PriceMatrixFactory,
  PriceMatrixChildFactory
} from "./price-matrix.model";

export interface PriceListItem extends SObject {
  Apttus_Config2__ContractPrice__c: number;
  Apttus_Config2__ListPrice__c: number;
  Apttus_Config2__ProductId__c: string;
  Apttus_Config2__ProductId__r: Product;
  Apttus_Config2__PriceListId__r: PriceList;
  CurrencyIsoCode: string;
  Apttus_Config2__PriceUom__c: string;
  Apttus_Config2__PriceMethod__c: string;
  Apttus_Config2__PriceMatrices__r: ChildRecord;
  Apttus_Config2__ExpirationDate__c: Date;
  Apttus_Config2__Active__c: boolean;
}

export interface PriceTier {
  minPrice: number;
  maxPrice: number;
}

export function PriceListItemFactory(
  priceListId: string = null
): PriceListItem {
  return {
    _type: "Apttus_Config2__PriceListItem__c",
    _constraint:
      `Apttus_Config2__PriceListId__c = '` +
      priceListId +
      `' 
                    AND (Apttus_Config2__EffectiveDate__c = NULL OR Apttus_Config2__EffectiveDate__c <= TODAY)
                    AND (Apttus_Config2__ExpirationDate__c = NULL OR Apttus_Config2__ExpirationDate__c >= TODAY)
                    `,
    Apttus_Config2__ContractPrice__c: 0,
    Apttus_Config2__ListPrice__c: 0,
    Apttus_Config2__ProductId__c: null,
    Apttus_Config2__ExpirationDate__c: null,
    CurrencyIsoCode: null,
    Apttus_Config2__ProductId__r: ProductFactory(priceListId),
    Apttus_Config2__PriceUom__c: null,
    Apttus_Config2__PriceMethod__c: null,
    Apttus_Config2__Active__c: null,
    Apttus_Config2__PriceMatrices__r: {
      records: [PriceMatrixChildFactory(priceListId)]
    }
  } as PriceListItem;
}

export function PriceListItemChildFactory(
  priceListId: string = null
): PriceListItem {
  return {
    _type: "Apttus_Config2__PriceListItem__c",
    _constraint:
      `Apttus_Config2__PriceListId__c = '` +
      priceListId +
      `' 
                    AND (Apttus_Config2__EffectiveDate__c = NULL OR Apttus_Config2__EffectiveDate__c <= TODAY)
                    AND (Apttus_Config2__ExpirationDate__c = NULL OR Apttus_Config2__ExpirationDate__c >= TODAY)
                    `,
    Apttus_Config2__ContractPrice__c: 0,
    Apttus_Config2__ListPrice__c: 0,
    Apttus_Config2__ProductId__c: null,
    Apttus_Config2__ExpirationDate__c: null,
    CurrencyIsoCode: null,
    Apttus_Config2__PriceUom__c: null,
    Apttus_Config2__PriceMethod__c: null,
    Apttus_Config2__Active__c: null,
    Apttus_Config2__PriceListId__r: PriceListFactory()
  } as PriceListItem;
}
