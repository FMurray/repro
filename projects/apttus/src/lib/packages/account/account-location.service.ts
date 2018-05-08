import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {AccountLocationFactory, AccountLocation} from './account.model';
import {UserService} from '../user/user.service';
import {SObjectService} from '../../utils/sobject.model';
import {AccountService} from '../account/account.service';
import * as _ from 'lodash';

export class AccountLocationService extends SObjectService{

    type = AccountLocationFactory();
    name = 'AccountLocation';


    public getMyAccountLocations(): Observable<Array<AccountLocation>>{
        let userService = new UserService(this.forceService, this.http, this.configService, this.cacheService);
        let accountService = new AccountService(this.forceService, this.http, this.configService, this.cacheService);

        return Observable.combineLatest(userService.me(), accountService.getCurrentAccount())
                .flatMap(([user, account]) => {
                    if((_.get(user, 'Id') !== undefined && _.get(account, 'Id') !== undefined))
                        return this.where(`CreatedById = '` + user.Id + `' AND Apttus_Config2__AccountId__c = '` + account.Id + `'`, 'myaccount:' + user.Id + ':' + account.Id)
                    else
                        return Observable.of([]);
                });    
    }

}