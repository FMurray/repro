import { Injectable } from "@angular/core";
import { ForceService } from "../../utils/force.service";
import { SObjectService } from "../../utils/sobject.model";
import { Observable } from "rxjs/Rx";
import { AccountContactRole } from "../account/index";
import { User, UserService } from "../user/index";

@Injectable()
export class AdminService {
  constructor(private forceService: ForceService) {}

  getAccountContactRoles(): Observable<Array<AccountUser>> {
    return this.forceService.post("/admin/accountContactRoles", null);
  }

  inviteUser(user: User, role: String): Observable<User> {
    UserService.setAlias(user);
    UserService.setTimezone(user);
    return this.forceService.post("/admin/inviteUser", {
      u: JSON.stringify(SObjectService.toJSON([user])[0]),
      role: role
    });
  }

  setActive(user: User, isActive: boolean): Observable<User> {
    return this.forceService.post("/admin/setActive", {
      userId: user.Id,
      isActive: isActive
    });
  }

  getAccountRoles(): Observable<Array<Picklist>> {
    return this.forceService
      .post("/admin/accountRoles", null)
      .map(res => res.filter(val => val.active));
  }
}

export interface Picklist {
  active: boolean;
  defaultValue: boolean;
  label: string;
  validFor: string;
  value: string;
}

export interface AccountUser {
  user: User;
  accountRole: AccountContactRole;
}
