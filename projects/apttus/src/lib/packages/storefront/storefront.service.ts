import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Storefront, StoreFactory} from './storefront.model';
import {SObjectService} from '../../utils/sobject.model';
import {ContentDistributionWrapper} from '../product/product-wrapper.model';


@Injectable()
export class StorefrontService extends SObjectService{
  public type = StoreFactory();
  name = 'storefront';
  
  public getStorefront(): Observable<Storefront>{
    return this.where(`Name = '` + this.configService._params.storeName + `'`, 'base_storefront').filter(u => (u != null)).map((res: Array<Storefront>) => res[0]);
  }

  public getStorefrontWithImages(): Observable<ContentDistributionWrapper>{
    return this._queryBuilder(`Name = '` + this.configService._params.storeName + `'`, null, null, null, null, true, 'storefront').filter(u => (u != null)).map(res => res[0]);
  }

}
