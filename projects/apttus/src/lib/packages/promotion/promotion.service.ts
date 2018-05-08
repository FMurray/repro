import {SObjectService} from '../../utils/sobject.model';
import {Observable} from 'rxjs/Rx';
import {PriceListService} from '../price-list/price-list.service';
import {ContentDistributionWrapper} from '../product/product-wrapper.model';
import {PromotionFactory} from './promotion.model';

export class PromotionService extends SObjectService{
    public getMyPromotions(): Observable<Array<ContentDistributionWrapper>>{
    let plService = new PriceListService(this.forceService, this.http, this.configService, this.cacheService);
	  return plService.getPriceListId()
	        .flatMap(priceListId =>  {
	          this.type = PromotionFactory(priceListId);
	          return this._queryBuilder(`Price_List__c = '` + priceListId + `'`, null, null, null, null, true, 'promos')
	        });
    }

}
