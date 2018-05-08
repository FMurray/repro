import { Faq } from "./faq.model";
import { SObjectImpl } from "../../utils/sobject.model";

export function FaqFactory(): Faq {
  let s = new SObjectImpl();
  return Object.assign({}, s, {
    _type: "Ecommerce_FAQ__c",
    Question__c: null,
    Answer__c: null,
    Topics_Description__c: null,
    Topics__c: null,
    Name: null,
    locale__c: null,
    Question_Description__c: null
  }) as Faq;
}
