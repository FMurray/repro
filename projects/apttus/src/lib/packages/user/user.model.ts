import { SObject, ChildRecord } from "../../utils/sobject.model";
import { Contact, ContactFactory } from "../contact/index";
import { UserRegistrationFactory } from "./user-registration.model";
import { PermissionSetAssignmentFactory } from "./permission-set.model";

export interface User extends SObject {
  Salutation__c: string;
  FirstName: string;
  LastName: string;
  Email: string;
  LocaleSidKey: string;
  EmailEncodingKey: string;
  LanguageLocaleKey: string;
  CommunityNickname: string;
  CountryCode: string;
  CurrencyIsoCode: string;
  DefaultCurrencyIsoCode: string;
  Username: string;
  Alias: string;
  TimeZoneSidKey: string;
  LastLoginDate: Date;
  Contact: Contact;
  Referrer__c: string;
  ContactId: string;
  Welcome_Message__c: string;
  UserRegistrations__r: ChildRecord;
  PermissionSetAssignments: ChildRecord;
}

export function UserFactory(): User {
  return {
    Salutation__c: null,
    FirstName: null,
    LastName: null,
    Email: null,
    LocaleSidKey: null,
    EmailEncodingKey: null,
    LanguageLocaleKey: null,
    CommunityNickname: null,
    CountryCode: null,
    CurrencyIsoCode: null,
    DefaultCurrencyIsoCode: null,
    Username: null,
    Alias: null,
    TimeZoneSidKey: null,
    LastLoginDate: null,
    Welcome_Message__c: null,
    Referrer__c: null,
    ContactId: null,
    Contact: ContactFactory(),
    PermissionSetAssignments: {
      records: [PermissionSetAssignmentFactory()]
    } as ChildRecord,
    UserRegistrations__r: {
      records: [UserRegistrationFactory()]
    } as ChildRecord,
    _type: "User"
  } as User;
}

export function UserFactorySmall(): User {
  return {
    FirstName: null,
    LastName: null,
    Email: null,
    Username: null,
    Alias: null,
    _type: "User"
  } as User;
}
