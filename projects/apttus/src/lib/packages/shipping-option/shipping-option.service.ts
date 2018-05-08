import { SObjectService } from "../../utils/sobject.model";
import { Observable } from "rxjs/Rx";
import { ShippingOption } from "./shipping-option.model";
import { ShippingOptionFactory } from "./shipping-option.factory";
import { Injectable } from "@angular/core";

export class ShippingOptionService extends SObjectService {
  public type = ShippingOptionFactory();

  getShippingOptions(
    totalWeight: number,
    region: string
  ): Observable<Array<ShippingOption>> {
    if (totalWeight && region) {
      return this.where(
        `
          APTSS_Min_Weight__c <= ${totalWeight} AND
          APTSS_Max_Weight__c > ${totalWeight} AND
          APTSS_Region__c = '${region}'
        `,
        `${totalWeight}${region}`
      );
    } else return Observable.of(null);
  }
}
