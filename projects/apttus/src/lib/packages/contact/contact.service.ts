// import { Injectable, EventEmitter } from '@angular/core';
// import {ForceService} from '../../utils/force.service';
// import {Observable} from 'rxjs/Rx';
// import {UserService} from '../user/user.service';
// import {Contact} from './contact.model';
//
// @Injectable()
// export class ContactService{
//
//   constructor(private userService: UserService, private contact: Contact){}
//
//   get(): Observable<any>{
//     return this.userService.get().flatMap(u => this.contact.get(`Id = '` + u.ContactId + `'`));
//   }
// }

import {SObjectService} from '../../utils/sobject.model';
import {Contact, ContactFactory} from './contact.model';
import {Observable} from 'rxjs/Rx';
import {Account} from '../account';

export class ContactService extends SObjectService{
  public type = ContactFactory();
  name = 'contact';

  public me(): Observable<Contact>{
    return this.forceService.identity().flatMap(u => this.where(`Id IN (SELECT ContactId FROM User WHERE Id = \'` + u.user_id + `\')`, 'me')).map((contacts: Array<Contact>) => contacts[0]);
  }

}
