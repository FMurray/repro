import {SObject, ChildRecord} from '../../utils/sobject.model';
import {AccountLocation, Account, AccountFactory, AccountLocationFactory} from '../account/account.model';
import {User, UserFactory, UserFactorySmall} from '../user/user.model';
import {PriceList, PriceListFactory} from '../price-list/price-list.model';
import {CartItemChildFactory} from './cart-item.model';
import {SummaryGroupFactory} from './summary-group.model';
import {Quote, QuoteFactory} from '../quote/quote.model';

export interface Cart extends SObject{
  Apttus_Config2__AccountId__r? : Account;
  OwnerId? : string;
  Owner: User;
  Apttus_Config2__AccountId__c? : string;
  Apttus_Config2__Status__c?: string;
  Apttus_Config2__OrderId__c?: string;
  Apttus_Config2__NumberOfItems__c?: number;
  Apttus_Config2__LocationId__r?: AccountLocation;
  Apttus_Config2__EffectiveDate__c?: Date;
  Apttus_Config2__BillToAccountId__c?: string;
  Apttus_Config2__BillToAccountId__r?: Account;
  Apttus_Config2__ShipToAccountId__c?: string;
  Apttus_Config2__ShipToAccountId__r?: Account;
  Apttus_Config2__Comments__c?: string;
  Apttus_Config2__EffectivePriceListId__r?: PriceList;
  Apttus_Config2__EffectivePriceListId__c? : string;
  Apttus_Config2__PriceListId__r? : PriceList;
  Apttus_Config2__PriceListId__c? : string;
  Apttus_Config2__LineItems__r? : ChildRecord;
  Apttus_Config2__SummaryGroups__r? : ChildRecord;
  Apttus_QPConfig__Proposald__c? : string;
  Apttus_QPConfig__Proposald__r? : Quote;
  Apttus_Config2__BusinessObjectId__c?: string;
  Apttus_Config2__BusinessObjectRefId__c? : string;
  Apttus_Config2__BusinessObjectType__c?: string;
  _state?: string;
}

export function CartFactory(priceListId: string = null, effectivePriceListId: string = null, accountId: string = null, owner: User = UserFactorySmall()): Cart{
  return {
    _type : 'Apttus_Config2__ProductConfiguration__c',
    _state: 'ready',
    Apttus_Config2__AccountId__r : AccountFactory(),
    Apttus_Config2__AccountId__c : accountId,
    Apttus_Config2__Status__c : null,
    Apttus_Config2__OrderId__c : null,
    Apttus_Config2__NumberOfItems__c : null,
    Apttus_Config2__LocationId__r : AccountLocationFactory(),
    Apttus_Config2__EffectiveDate__c : null,
    Apttus_Config2__BillToAccountId__c : accountId,
    Apttus_Config2__BillToAccountId__r : AccountFactory(),
    Apttus_Config2__Comments__c : null,
    Apttus_Config2__EffectivePriceListId__r : PriceListFactory(),
    Apttus_Config2__EffectivePriceListId__c : effectivePriceListId,
    Apttus_Config2__PriceListId__r : PriceListFactory(),
    Apttus_Config2__PriceListId__c : priceListId,
    Apttus_QPConfig__Proposald__c : null,
    Apttus_QPConfig__Proposald__r : QuoteFactory(),
    Apttus_Config2__BusinessObjectId__c: null,
    Apttus_Config2__BusinessObjectRefId__c: null,
    Apttus_Config2__BusinessObjectType__c: null,
    Apttus_Config2__ShipToAccountId__c: accountId,
    Apttus_Config2__ShipToAccountId__r: AccountFactory(),
    OwnerId : null,
    Owner : owner,
    Apttus_Config2__LineItems__r : {
      records : [CartItemChildFactory(priceListId)]
    },
    Apttus_Config2__SummaryGroups__r : {
      records : [SummaryGroupFactory()]
    }
  } as Cart;

}

export interface CartProductForm{
  productCode: string;
  quantity: number;
}
