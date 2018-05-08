import { SObject } from "../../utils/sobject.model";

export interface Faq extends SObject {
  Answer__c: string;
  Question__c: string;
  Topics__c: string;
  Topics_Description__c: string;
  Name: string;
  locale__c: string;
  Question_Description__c: string;
}
