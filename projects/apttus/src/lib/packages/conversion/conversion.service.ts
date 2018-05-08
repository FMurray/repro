import {UserService} from '../user/user.service';
import {User} from '../user/user.model';
import {CacheService} from '../../utils/cache.service';
import {Observable, BehaviorSubject} from 'rxjs/Rx';
export class ConversionService extends UserService{

  private _get: BehaviorSubject<any>;

  // getConversionRate(isoCode: string): Observable<any>{
  //   if(this._get && this._get != null){
  //       return this._get.map(res => res.filter((record) => record.IsoCode == isoCode)).map(records => (records && records.length > 0) ? records[0] : {ConversionRate : 1});
  //   }else{
  //     this._get = this.cacheService.get('conversionRates', () => this.forceService.post('/guest/conversionRates', null));
  //     return this._get.map(res => res.filter((record) => record.IsoCode == isoCode)).map(records => (records && records.length > 0) ? records[0] : {ConversionRate : 1});
  //   }
  // }




  getConversionRate(): Observable<any>{
  	if(!this._get){
  		this._get = new BehaviorSubject<any>(null);
  		let userService = new UserService(this.forceService, this.http, this.configService, this.cacheService);

  		userService.me().subscribe(user => {
  			this.forceService.post('/guest/conversionRates', 'conversionRates').subscribe(rateList => {
  				let rate = rateList.filter(rate => rate.IsoCode == user.DefaultCurrencyIsoCode)[0];
  				this._get.next(rate);
  			})
  		});
  	}
  	return this._get.filter(res => (res != null));
  }

}
