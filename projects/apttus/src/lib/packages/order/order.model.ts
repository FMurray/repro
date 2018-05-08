import { SObject, ChildRecord } from "../../utils/sobject.model";
import {
  Account,
  AccountFactory,
  AccountLocation,
  AccountLocationFactory
} from "../account/account.model";
import { PriceList, PriceListFactory } from "../price-list/price-list.model";
import { Contact, ContactFactory } from "../contact/contact.model";
import { OrderLineItemFactory } from "./order-line-item.model";
import { Quote, QuoteFactory } from "../quote/quote.model";
import { User, UserFactorySmall } from "../user/user.model";

export interface Order extends SObject {
  Name: string;
  Apttus_Config2__Accept__c: string;
  Apttus_Config2__AutoActivateOrder__c: boolean;
  Apttus_Config2__BillingPreferenceId__c: string;
  Apttus_Config2__BillToAccountId__c: string;
  Apttus_Config2__BillToAccountId__r: Account;
  Apttus_Config2__CancelledDate__c: Date;
  Apttus_Config2__CompletedDate__c: Date;
  Apttus_Config2__ConfigurationSyncDate__c: Date;
  Apttus_Config2__Description__c: string;
  Apttus_Config2__IsTaskPending__c: boolean;
  Apttus_Config2__OrderDate__c: Date;
  Apttus_Config2__OrderEndDate__c: Date;
  Apttus_Config2__OrderReferenceNumber__c: string;
  Apttus_Config2__OrderStartDate__c: Date;
  Apttus_Config2__ParentOrderId__c: string;
  Apttus_Config2__PODate__c: Date;
  Apttus_Config2__PONumber__c: string;
  Apttus_Config2__PriceListId__c: string;
  Apttus_Config2__PriceListId__r: PriceList;
  Apttus_Config2__PricingDate__c: Date;
  Apttus_Config2__PrimaryContactId__r: Contact;
  Apttus_Config2__PrimaryContactId__c: string;
  Apttus_Config2__ActivatedDate__c: Date;
  Apttus_Config2__ReadyForBillingDate__c: Date;
  Apttus_Config2__FulfilledDate__c: Date;
  Apttus_Config2__ReadyForRevRecDate__c: Date;
  Apttus_Config2__RelatedOpportunityId__c: string;
  Apttus_Config2__ShipToAccountId__c: string;
  Apttus_Config2__ShipToAccountId__r: Account;
  Apttus_Config2__SoldToAccountId__c: string;
  Apttus_Config2__SoldToAccountId__r: Account;
  Apttus_Config2__Source__c: string;
  Apttus_Config2__Status__c: string;
  Apttus_Config2__Type__c: string;
  Apttus_Config2__OrderLineItems__r: ChildRecord;
  Apttus_QPConfig__ProposalId__r: Quote;
  Apttus_QPConfig__ProposalId__c: string;
  Owner: User;
}

export function OrderFactory(
  priceListId?: string,
  accountId?: string,
  contactId?: string
): Order {
  return {
    _type: "Apttus_Config2__Order__c",
    Name: null,
    Apttus_Config2__Accept__c: null,
    Apttus_Config2__AutoActivateOrder__c: null,
    Apttus_Config2__BillingPreferenceId__c: null,
    Apttus_Config2__BillToAccountId__c: accountId,
    Apttus_Config2__BillToAccountId__r: AccountFactory(),
    Apttus_Config2__CancelledDate__c: null,
    Apttus_Config2__CompletedDate__c: null,
    Apttus_Config2__ConfigurationSyncDate__c: null,
    Apttus_Config2__Description__c: null,
    Apttus_Config2__IsTaskPending__c: null,
    Apttus_Config2__OrderDate__c: null,
    Apttus_Config2__OrderEndDate__c: null,
    Apttus_Config2__OrderReferenceNumber__c: null,
    Apttus_Config2__OrderStartDate__c: null,
    Apttus_Config2__ParentOrderId__c: null,
    Apttus_Config2__PODate__c: null,
    Apttus_Config2__PONumber__c: null,
    Apttus_Config2__PriceListId__c: priceListId,
    Apttus_Config2__PriceListId__r: PriceListFactory(),
    Apttus_Config2__PricingDate__c: null,
    Apttus_Config2__PrimaryContactId__r: ContactFactory(),
    Apttus_Config2__PrimaryContactId__c: contactId,
    Apttus_Config2__ActivatedDate__c: null,
    Apttus_Config2__ReadyForBillingDate__c: null,
    Apttus_Config2__FulfilledDate__c: null,
    Apttus_Config2__ReadyForRevRecDate__c: null,
    Apttus_Config2__RelatedOpportunityId__c: null,
    Apttus_Config2__ShipToAccountId__c: accountId,
    Apttus_Config2__ShipToAccountId__r: AccountFactory(),
    Apttus_Config2__SoldToAccountId__c: accountId,
    Apttus_Config2__SoldToAccountId__r: AccountFactory(),
    Apttus_Config2__Source__c: null,
    Apttus_Config2__Status__c: null,
    Apttus_Config2__Type__c: null,
    Apttus_QPConfig__ProposalId__r: QuoteFactory(),
    Apttus_QPConfig__ProposalId__c: null,
    Owner: UserFactorySmall(),
    Apttus_Config2__OrderLineItems__r: {
      records: [OrderLineItemFactory(priceListId)]
    } as ChildRecord
  } as Order;
}

export interface KukaQuote extends Quote {
  APTSSP_Region__c: string;
  APTSSP_Shipping__c: string;
  APTSSP_Shipping__r: ShippingOption;
  APTSSP_Total_Quote_Amount__c: number;
  APTSSP_Total_Quote_Weight__c: number;
  APTSSP_Line_Item_Amount__c: number;
  APTSSP_Shipping_Cost__c: number;
  APTSSP_Bill_To_Account__c: string;
  APTSSP_Bill_To_Account__r: AccountLocation;
  ATPSSP_Bill_To_Contact__c: string;
  ATPSSP_Bill_To_Contact__r: Contact;
  APTSSP_Purchase_Order_Number__c: string;
  APTSSP_Shipping_Location__c: string;
  APTSSP_Shipping_Location__r: AccountLocation;
  APTSSP_Shipping_Address__c: any;
}

export function KukaQuoteFactory(): KukaQuote {
  let q = QuoteFactory();
  return Object.assign(q, {
    APTSSP_Region__c: null,
    APTSSP_Shipping__c: null,
    APTSSP_Shipping__r: ShippingOptionFactory(),
    APTSSP_Shipping_Address__c: null,
    APTSSP_Total_Quote_Amount__c: null,
    APTSSP_Total_Quote_Weight__c: null,
    APTSSP_Line_Item_Amount__c: null,
    APTSSP_Shipping_Cost__c: null,
    APTSSP_Bill_To_Account__c: null,
    APTSSP_Bill_To_Account__r: AccountLocationFactory(),
    ATPSSP_Bill_To_Contact__c: null,
    ATPSSP_Bill_To_Contact__r: ContactFactory(),
    APTSSP_Purchase_Order_Number__c: null,
    APTSSP_Shipping_Location__c: null,
    APTSSP_Shipping_Location__r: AccountLocationFactory()
  });
}

import { ShippingOption } from "../shipping-option/shipping-option.model";
import { ShippingOptionFactory } from "../shipping-option/shipping-option.factory";

export interface KukaOrder extends Order {
  Total_Number_of_Items__c: number;
  APTSSP_Shipping_Comments__c: string;
  Receiver_Name__c: string;
  Receiver_Phone__c: string;
  Receiver_Email__c: string;
  Complete_Delivery__c: boolean;
  APTSSP_EndCustomer_internal_order_number__c: string;
}

export function KukaOrderFactory(): KukaOrder {
  let o = OrderFactory();
  return Object.assign(o, {
    Total_Number_of_Items__c: null,
    APTSSP_Shipping_Comments__c: null,
    Apttus_QPConfig__ProposalId__r: KukaQuoteFactory(),
    Receiver_Name__c: null,
    Receiver_Phone__c: null,
    Receiver_Email__c: null,
    Complete_Delivery__c: null,
    APTSSP_EndCustomer_internal_order_number__c: null
  });
}
