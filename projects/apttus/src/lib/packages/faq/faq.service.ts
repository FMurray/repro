import { UserService } from "../user/user.service";
import { ForceService } from "../../utils/force.service";
import {
  SObject,
  SObjectImpl,
  SObjectService
} from "../../utils/sobject.model";
import {} from "../../utils/sobj";
import { Observable } from "rxjs/Rx";
import { Faq } from "./faq.model";
import { FaqFactory } from "./faq.factory";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class FaqService extends SObjectService {
  type: SObject = FaqFactory();

  public getFaq(): Observable<Array<Faq>> {
    const userService = new UserService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );
    return userService.me().flatMap(user => {
      return this.where(`locale__c = '${user.LanguageLocaleKey}'`, null);
    });
  }
}
