import {SObject, ChildRecord} from '../../utils/sobject.model';
import {Contact} from '../contact/contact.model';
import {PriceList, PriceListFactory} from '../price-list/price-list.model';

export interface Account extends SObject{
  Name: string;
  BillingStreet: string;
  BillingState: string;
  BillingCity: string;
  BillingPostalCode: string;
  BillingCountry: string;
  ShippingStreet : string;
  ShippingState : string;
  ShippingCity : string;
  ShippingPostalCode : string;
  ShippingCountry: string;
  Price_List__c: string;
  Price_List__r: PriceList;
  ParentId: string;
  Apttus_Config2__AccountLocations__r: ChildRecord;
  ChildAccounts : ChildRecord;
}

export interface AccountContactRole extends SObject{
  Name: string;
  AccountId: string;
  Contact: Contact;
  IsPrimary: boolean;
  Role: string;
}

export interface AccountLocation extends SObject{
  Name: string;
  Apttus_Config2__City__c: string;
  Apttus_Config2__Country__c: string;
  Apttus_Config2__County__c: string;
  Apttus_Config2__IsDefault__c: boolean;
  Apttus_Config2__PostalCode__c: number;
  Apttus_Config2__State__c: string;
  Apttus_Config2__Street__c: string;
  Apttus_Config2__Type__c: string;
  Apttus_Config2__AccountId__c: string;
}

export function AccountLocationFactory(): AccountLocation{
  return {
    Name: null,
    Apttus_Config2__City__c: null,
    Apttus_Config2__Country__c: null,
    Apttus_Config2__County__c: null,
    Apttus_Config2__IsDefault__c: false,
    Apttus_Config2__PostalCode__c: null,
    Apttus_Config2__State__c: null,
    Apttus_Config2__Street__c: null,
    Apttus_Config2__Type__c: null,
    Apttus_Config2__AccountId__c: null,
    _type : 'Apttus_Config2__AccountLocation__c'
  } as AccountLocation
}

export function AccountFactory(includeChildren: boolean = true, includeLookups: boolean = true): Account{
  let a = {
    _type : 'Account',
    Name : 'Customer Community Account',
    BillingStreet : null,
    BillingState : null,
    BillingCity : null,
    BillingPostalCode : null,
    BillingCountry: null,
    ShippingStreet : null,
    ShippingState : null,
    ShippingCity : null,
    ShippingPostalCode : null,
    ShippingCountry : null,
    Price_List__c : null,
    ParentId : null
  } as Account;

  if(includeChildren)
    a = Object.assign(a, {
      Apttus_Config2__AccountLocations__r: {
        records :  [AccountLocationFactory()]
      } as ChildRecord,
      ChildAccounts : {
        records : [AccountFactory(false)]
      } as ChildRecord
    });

  if(includeLookups)
    a = Object.assign(a, {
      Price_List__r : PriceListFactory()
    });

  return a;
}
