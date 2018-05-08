import {SObject} from '../../utils/sobject.model';

export interface Storefront extends SObject{
  Name: string;
  APTSMD_Site_URL__c;
  APTSMD_Store_Logo__c;
  APTSMD_Promotion1__c;
  APTSMD_Promotion2__c;
  APTSMD_Promotion3__c;
  APTSMD_Banner_Image__c;
  APTSMD_Price_List__c;
}

export function StoreFactory(): Storefront{
  return {
    Name : null,
    APTSMD_Site_URL__c: null,
    APTSMD_Store_Logo__c: null,
    APTSMD_Promotion1__c: null,
    APTSMD_Promotion2__c: null,
    APTSMD_Promotion3__c: null,
    APTSMD_Banner_Image__c: null,
    APTSMD_Price_List__c : null,
    _type : 'APTSMD_Store__c'
  } as Storefront;
}
