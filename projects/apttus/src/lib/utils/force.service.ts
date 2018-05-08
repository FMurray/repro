import {Injectable, EventEmitter, Inject} from '@angular/core';
import {ConfigService, ApiConfig} from '../packages/config/config.service';
import {HttpClient} from '@angular/common/http';
import * as jsforce from 'jsforce';
import {Observable, ReplaySubject, BehaviorSubject} from 'rxjs/Rx';
import {JSForceService} from './jsforce.service';
import {CacheService} from './cache.service';
import * as CryptoJS from 'crypto-js';

declare var ProxyTransport: any;

let _windowConfig = (<any>window).sv;

@Injectable()
export class ForceService{

  private static STOP_EXCEPTIONS = ['INVALID_SESSION_ID', 'Bad_OAuth_Token', 'API_CURRENTLY_DISABLED', 'ERROR_HTTP_403'];
  private static IV: string = '7DECBEB911AA6A3E';

  public loginChange: ReplaySubject<any> = new ReplaySubject<any>();
  public loggingIn: boolean = false;
  public stopOnException: boolean = false;
  public connection: any;
  public _identity: any;

  private organizationId: string;
  private salesforceEndpoint: string;

  public queryList;
  private queryKey;

  constructor(private http: HttpClient, private config: ConfigService, private _cache: CacheService){
    this.organizationId = (_windowConfig) ? _windowConfig.organizationId : config._params.organizationid;
    if(_windowConfig && _windowConfig.baseURL)
      this.salesforceEndpoint = _windowConfig.baseURL;
    else if(_windowConfig && _windowConfig.salesforceEndpoint)
      this.salesforceEndpoint = 'https://' + _windowConfig.salesforceEndpoint;
    else
      this.salesforceEndpoint = config._params.salesforceEndpoint;

    JSForceService.fixSoapLogin(jsforce, this.organizationId, this.salesforceEndpoint);
    JSForceService.fixIdentity(jsforce, this.salesforceEndpoint);
    JSForceService.addSoapCallout(jsforce);
    this.resetConnection();
  }

  setPassword(password: string){
    return this.identity().flatMap(user => {
      return this.connection.soap.setPassword(user.user_id, password)
    });
  }

  getConnection():Observable<any>{
    if(this.connection && this.connection.accessToken)
      return Observable.of(this.connection);
    else
      return this.login(null, null).flatMap(u => Observable.of(this.connection));
  }

  login(username: string, password: string): Observable<any>{
    if(!username || !password){
      let credentialKey = localStorage.getItem(this.config.STORAGE_KEY);
      if(credentialKey){
        let storedCredentials = JSON.parse(atob(credentialKey));
        if(storedCredentials && storedCredentials.username && storedCredentials.password)
          return this.doLogin(storedCredentials.username, storedCredentials.password);
        else
          return Observable.throw(new Error("Invalid Login"));
      }else{
        return Observable.throw(new Error("Invalid Login"));
      }
    }else{
      return this.doLogin(username, password);
    }
  }

  logout(): Observable<any>{
    return Observable.fromPromise(this.connection.logout()).map(res => {
      if(_windowConfig)
        delete _windowConfig.accessToken;
      delete this.connection;

      localStorage.removeItem(this.config.STORAGE_KEY);
      localStorage.removeItem(this.config.STORAGE_ACCESS_TOKEN);
      this._identity = null;
      this.resetConnection();
      return res;
    });
  }

  setAccessToken(accessToken: string){
    this.connection.accessToken = accessToken;
    localStorage.setItem(this.config.STORAGE_ACCESS_TOKEN, accessToken);
  }

  isLoggedIn(){
    return (this.connection && this.connection.accessToken) ? true : false;
  }

  isGuest(): Observable<boolean>{
    return Observable.of(!this.connection.accessToken);
  }

  create(sobject: string, data: Array<any>){
    // if(this.isLoggedIn()){
    //   return Observable.fromPromise(this.connection.sobject(sobject).create(data)).catch(e => {
    //     if(e && ForceService.STOP_EXCEPTIONS.indexOf(e.name) >= 0){
    //       data.forEach(d => d.attributes = {type : sobject});
    //       return this.logout().flatMap(d => this.post("/guest/insert", {q : JSON.stringify(data)}));
    //     }else
    //       return Observable.throw(e);
    //   })
    // }else{
      data.forEach(d => d.attributes = {type : sobject});
      return this.post("/guest/insert", {q : JSON.stringify(data)});
    //}
  }

  remove(sobject: string, data: Array<any>){
    // if(this.isLoggedIn()){
    //   return Observable.fromPromise(this.connection.sobject(sobject).del(data)).catch(e => {
    //     if(ForceService.STOP_EXCEPTIONS.indexOf(e.name) >= 0){
    //       data.forEach(d => d.attributes = {type : sobject});
    //       return this.logout().flatMap(d => this.post("/guest/remove", {q : JSON.stringify(data)}));
    //     }else
    //     return Observable.throw(e);
    //   })
    // }else{
      data.forEach(d => d.attributes = {type : sobject});
      return this.post("/guest/remove", {q : JSON.stringify(data)});
    //}
  }

  update(sobject: string, data: Array<any>){
    // if(this.isLoggedIn()){
    //   return Observable.fromPromise(this.connection.sobject(sobject).update(data)).catch(e => {
    //     if(e && ForceService.STOP_EXCEPTIONS.indexOf(e.name) >= 0){
    //       data.forEach(d => d.attributes = {type : sobject});
    //       return this.logout().flatMap(d => this.post("/guest/update", {q : JSON.stringify(data)}));
    //     }else
    //     return Observable.throw(e);
    //   })
    // }else{
      data.forEach(d => d.attributes = {type : sobject});
      return this.post("/guest/update", {q : JSON.stringify(data)});
    //}
  }

  upsert(sobject: string, data: Array<any>){
    data.forEach(d => d.attributes = { type: sobject });
    return this.post("/guest/upsert", { q: JSON.stringify(data) });
  }

  search(query: string): Observable<Array<any>>{
    if(!this.config._params.production)
      console.debug(query);

    // return this.isGuest().flatMap(isGuest => {
    //   if(isGuest)
    //     return this.post("/guest/search", {q : query});
    //   else{
    //     return Observable.fromPromise(this.connection.search(query)).catch(e => {
    //       if(e && ForceService.STOP_EXCEPTIONS.indexOf(e.name) >= 0){
    //         return this.logout().flatMap(d => this.post("/guest/search", {q : query}));
    //       }else
    //       return Observable.throw(e);
    //     })
    //     .map((res: any) => [res.searchRecords])
    //   }
    // });
    return this.post("/guest/search", {q : query});
  }

  get(endpoint){
    return Observable.fromPromise(this.connection.apex.get(endpoint));
  }

  post(endpoint, data): Observable<any>{

    let encrypted = JSON.stringify({
      endpoint : endpoint,
      data : data
    });


    if(!this.config._params.production && data && data['q'])
      console.debug(data['q']);

    return Observable.fromPromise(this.connection.apex.post('/g/' + new Date().getTime(), {d : this.encryptString(encrypted)}))
    .map((res: any) => {
      if(res && res.success){
        if(res.data)
          return JSON.parse(res.data);
        else
          return res;
      }else{
        if(res && res.data)
          throw(res.data);
        else
          throw(null);
      }
    }).catch(e => {
      if(e && ForceService.STOP_EXCEPTIONS.indexOf(e.name) >= 0)
        return this.logout().flatMap(d => this.post(endpoint, data));
      else
        return Observable.throw(e);
    });
  }

  encryptString(stringToEncrypt) {
    var a = CryptoJS.enc.Base64.parse(this.config.SV);
    var b = CryptoJS.enc.Base64.parse(this.config.IV);
    
    var encrypted = CryptoJS.AES.encrypt(stringToEncrypt, a, {mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: b});
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  query(query: string): Observable<Array<any>>{
    if(!this.queryList)
      this.queryList = {};
    
    if(!this.queryKey)
      this.queryKey = this.guid();

    const guid = this.guid();
    this.queryList[guid] = query;

    return this._cache.get(this.queryKey, () => Observable
                                                .timer(200)
                                                .flatMap(() => {
                                                  let data = Object.assign({}, this.queryList);
                                                  this.queryList = null;
                                                  this.queryKey = null;
                                                  return this.post("/guest/query", {q : data})
                                                })
                          )
    .filter(res => (res != null))
    .map(res => {
      if(!this.config._params.production)
        console.debug(query, res[guid]);
      return res[guid]
    });

  }

  checkChildren(data): Observable<Array<any>>{
    let obsvArray = [];
    for (let record of data.records) {
      for(var property in record){
        if(record.hasOwnProperty(property) && record[property].done == false)
          obsvArray.push(this.queryMore(record[property].nextRecordsUrl, record[property], record, property));
      }
    }
    if(obsvArray && obsvArray.length > 0)
      return Observable.forkJoin(obsvArray);
    else
      return Observable.of(data);
  }

  queryMore(locator: string, data, parent, parentProperty): Observable<Array<any>>{
    return Observable.fromPromise(this.connection.queryMore(locator)).flatMap((res: any) => {
      res.records = res.records.concat(data.records);
      if(parent && parent[parentProperty])
        parent[parentProperty] = res;
      if(res.done == false)
        return this.queryMore(res.nextRecordsUrl, res, parent, parentProperty);
      else
        return Observable.of(res);
    })
  }

  describe(sobject: string): Observable<any>{
    return Observable.fromPromise(this.connection.describe(sobject))
    .catch(e => {
      if(e && ForceService.STOP_EXCEPTIONS.indexOf(e.name) >= 0)
        return this.post('/guest/describe', sobject);
      else
        return Observable.throw(e);
    });
  }

  identity(): Observable<any>{

    return Observable.create(obsv => {
      if(!this.isLoggedIn()){
        obsv.next(null);
        obsv.complete();
      }else{
        this.connection.identity((res, err) => {
          if(!err && res){
            obsv.next(res);
          }else{
            if(err && ForceService.STOP_EXCEPTIONS.indexOf(err.name) >= 0)
              obsv.next(null);
            else
              obsv.error(err);
            obsv.complete();
          }
        }).catch(e => {
          if(e && ForceService.STOP_EXCEPTIONS.indexOf(e.name) >= 0)
            obsv.next(null);
          else
            obsv.error(e);
          obsv.complete();
        });
      }
    });
  }

  guid(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4();
  }

  private resetConnection(){
    if(!this.config._params.production){
      this.connection = new jsforce.Connection({
        loginUrl : this.salesforceEndpoint,
        instanceUrl: this.salesforceEndpoint,
        proxyUrl : this.config.HEROKU_ENDPOINT,
        serverUrl : this.salesforceEndpoint
      });
    }else{
      this.connection = new jsforce.Connection({
        loginUrl : this.salesforceEndpoint,
        instanceUrl: this.salesforceEndpoint
      });
    }
    if(_windowConfig && _windowConfig.accessToken && _windowConfig.accessToken != 'NULL_SESSION_ID'){
      this.connection.accessToken = _windowConfig.accessToken
      localStorage.setItem(this.config.STORAGE_ACCESS_TOKEN, _windowConfig.accessToken);
    }else if(localStorage.getItem(this.config.STORAGE_ACCESS_TOKEN))
    this.connection.accessToken = localStorage.getItem(this.config.STORAGE_ACCESS_TOKEN);

  }

  private doLogin(username: string, password: string): Observable<any>{
    if(this.loggingIn)
      return this.loginChange;
    else{
      this.loggingIn = true;
      return Observable.fromPromise(this.connection.login(username, password)).map(userInfo => {
        localStorage.setItem(this.config.STORAGE_ACCESS_TOKEN, this.connection.accessToken);
        this.connection.instanceUrl = this.salesforceEndpoint;
        this.loginChange.next(userInfo);
        this.loginChange.complete();
        this.loggingIn = false;
        return userInfo;
      }).catch((e: Error) => {
        this.loggingIn = false;
        this.loginChange.error(e);
        this.loginChange.complete();
        return Observable.throw(e);
      });
    }
  }
}
