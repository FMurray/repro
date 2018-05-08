import {SObjectService} from '../../utils/sobject.model';
import {PriceList, PriceListFactory} from './price-list.model';
import {PriceListItem, PriceListItemFactory} from './price-list-item.model';
import {StorefrontService} from '../storefront/storefront.service';
import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {User, UserService, UserFactory} from '../user';
import {AccountService} from '../account/account.service';
import {PriceMatrixFactory, PriceMatrix} from './price-matrix.model';


export class PriceListService extends SObjectService{
  type = PriceListFactory();
  name = 'price-list';
  
  private _loadPriceListId(effective: boolean): Observable<string>{
    let storeFrontService = new StorefrontService(this.forceService, this.http, this.configService, this.cacheService);
    let accountService = new AccountService(this.forceService, this.http, this.configService, this.cacheService);
      return accountService.getCurrentAccount()
      .flatMap(currentAccount => {
        if(currentAccount && currentAccount.Price_List__r && currentAccount.Price_List__r.Apttus_Config2__BasedOnPriceListId__c && effective == false)
          return Observable.of(currentAccount.Price_List__r.Apttus_Config2__BasedOnPriceListId__c);
        else if(currentAccount.Price_List__c)
          return Observable.of(currentAccount.Price_List__c)
        else
          return storeFrontService.getStorefront().map(res => res.APTSMD_Price_List__c);
      })
      .filter(priceListId => (priceListId != null && priceListId != undefined));
  }

  public getPriceListItemByCode(productCode: string): Observable<PriceListItem>{
    return this.getPriceListId().flatMap(priceListId => {
      let pliService = new SObjectService(this.forceService, this.http, this.configService, this.cacheService);
      pliService.type = PriceListItemFactory(priceListId);
      return pliService.where(`Apttus_Config2__ProductId__r.ProductCode = '` + productCode + `'`, 'pli:' + productCode).map(res => res[0]);
    });
  }

  public getPriceMatrixDataByCode(productCode: string): Observable<Array<PriceMatrix>>{
   return this.getPriceListId().flatMap(priceListId => {
      let priceMatrixService = new SObjectService(this.forceService, this.http, this.configService, this.cacheService);
      priceMatrixService.type = PriceMatrixFactory(priceListId);
      return priceMatrixService.where(`Apttus_Config2__PriceListItemId__r.Apttus_Config2__ProductId__r.ProductCode = '` + productCode + `'`, 'pmd:' + productCode + ':' + priceListId);
    }); 
  }

  public getPriceMatrix(priceListItem: PriceListItem): Observable<Array<PriceMatrix>>{
    let pmService = new SObjectService(this.forceService, this.http, this.configService, this.cacheService);
    pmService.type = PriceMatrixFactory(null);

    return pmService.where(`Apttus_Config2__PriceListItemId__c = '` + priceListItem.Id + `'`, 'pm:' + priceListItem.Id);
  }

  public getPriceListId(): Observable<string>{
    return this.cacheService.get('inherited', () => this._loadPriceListId(false)).filter(pli => pli != null);
  }

  public getEffectivePriceListId(): Observable<string>{
    return this.cacheService.get('effective', () => this._loadPriceListId(true)).filter(pli => pli != null);
  }
}
