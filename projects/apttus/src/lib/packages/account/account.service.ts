import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {AccountFactory, Account} from './account.model';
import {UserService} from '../user/user.service';
import {SObjectService} from '../../utils/sobject.model';

export class AccountService extends SObjectService{

	type = AccountFactory();
	name = 'Account';
	
	private _account: BehaviorSubject<Account>;
	private _currentAccount: BehaviorSubject<Account>;

	public getMyAccount(): Observable<Account>{
		if(!this._account){
			this._account = new BehaviorSubject<Account>(null);
			let userService = new UserService(this.forceService, this.http, this.configService, this.cacheService);
			userService.me()
				.flatMap(user =>{
					if(user.Contact != null){
						return this.get([user.Contact.AccountId], user.Contact.AccountId);
					}else if(user.UserRegistrations__r != null){
						return this.get([user.UserRegistrations__r.records[0].Account__c], user.UserRegistrations__r.records[0].Account__c);
					}else
						return Observable.of(null);
				})
				.map(res => (res && res.length > 0) ? res[0] : AccountFactory())
				.subscribe(res => {
					this._account.next(res)
				}, err => this._account.error(err));	
		}
		return this._account.filter(res => (res != null));
	}

	public getCurrentAccount(): Observable<Account>{
		if(!this._currentAccount){
			this._currentAccount = new BehaviorSubject<Account>(null);
			this.cacheService.get('current-account', () => Observable.if(() => this.cacheService._get('ca') != null, 
								Observable.of(this.cacheService._get('ca')), 
								this.getMyAccount()))
			.subscribe(account => this._currentAccount.next(account), err => this._currentAccount.error(err));
		}

		return this._currentAccount.filter(res => (res != null));
	}

	public setAccount(account: Account): Observable<Account>{
		this.cacheService._set('ca', account, false);
		return this.cacheService.update('current-account');
	}
}