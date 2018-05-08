import { SObject } from "../../utils/sobject.model";
import { Account, AccountFactory } from "../account/index";

export interface Contact extends SObject {
  FirstName: string;
  LastName: string;
  AccountId: string;
  Account: Account;
  Phone: string;
}

export function ContactFactory(): Contact {
  return {
    FirstName: null,
    LastName: null,
    AccountId: null,
    Account: AccountFactory(),
    Phone: null,
    _type: "Contact"
  } as Contact;
}
