import {SObject} from '../../utils/sobject.model';


export interface PermissionSetAssignment{
    AssigneeId : string;
    PermissionSet : PermissionSet;
}

export function PermissionSetAssignmentFactory() : PermissionSetAssignment{
    return {
        AssigneeId : null,
        PermissionSet : PermissionSetFactory(),
        _type : 'PermissionSetAssignment',
        _defaults : false
    } as PermissionSetAssignment
}

export interface PermissionSet extends SObject{
    Name : string;
    LicenseId : string;
    Label : string;
    ProfileId : string;
    IsCustom : boolean;
    HasActivationRequired : boolean;
}

export function PermissionSetFactory(): PermissionSet{
    return {
        Name : null,
        LicenseId : null,
        Label : null,
        ProfileId : null,
        IsCustom : null,
        HasActivationRequired : null,
        _type : 'PermissionSet'
    } as PermissionSet
}