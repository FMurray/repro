import {SObject} from '../../utils/sobject.model';

export interface UserRegistration extends SObject{
    Account__c: boolean,
    Active__c: boolean,
    Email__c: string,
    FirstName__c: string,
    LastName__c: string,
    Role__c: string,
    Status__c: string,
    User__c: string,
    UserAdmin__c: string,
    UserName__c: string,
    Name: string
}

export function UserRegistrationFactory(): UserRegistration{
    return {
        Account__c : null,
        Active__c: null,
        Email__c: null,
        FirstName__c: null,
        LastName__c: null,
        Role__c: null,
        Status__c: null,
        User__c: null,
        UserAdmin__c: null,
        UserName__c: null,
        Name: null,
        _type : 'UserRegistration__c'
    } as UserRegistration;
}