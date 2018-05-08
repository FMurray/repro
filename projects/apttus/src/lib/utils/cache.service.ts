import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs/Rx';

@Injectable()
export class CacheService{
  private _cache: any;
  private _subjectMap: any;
  private _observableMap: any;
  private _status: any;

  constructor(){
    this._cache = {};
    this._subjectMap = {};
    this._observableMap = {};
    this._status = {};
  }

  _set(key: string, data: any, local: boolean = false){
    if(Array.isArray(data))
      this._cache[key] = JSON.parse(JSON.stringify(data));
    else if(typeof data === "object"){
      this._cache[key] = Object.assign({}, data);
    }else
      this._cache[key] = data;

    if(local)
      localStorage.setItem(key, JSON.stringify(this._cache[key]));
  }

  _get(key: string){
    if(Array.isArray(this._cache[key]))
      return JSON.parse(JSON.stringify(this._cache[key]));
    else if(typeof this._cache[key] === "object")
      return Object.assign({}, this._cache[key]);
    else if(this._cache[key])
      return this._cache[key];
    else if(localStorage.getItem(key))
      return JSON.parse(localStorage.getItem(key));
    else
      return null;
  }

  get(key: string, fn: () => Observable<any>): Observable<any>{
    if(!key){
      let subject = new BehaviorSubject<any>(null);
      fn().subscribe(res => subject.next(res), err => subject.error(err));
      return subject.filter(res => (res !== undefined));
    }else{
      if(this._subjectMap[key]){
        return this._subjectMap[key];
      }else{
        let subject = new BehaviorSubject<any>(null);
        this._subjectMap[key] = subject;
        this._observableMap[key] = fn;
        fn().subscribe(res => {
          subject.next(res)
        },
        err => subject.error(err));
        return subject.filter(res => (res !== undefined));
      }  
    }
  }

  update(key: string): Observable<any>{
    try{
      return this._observableMap[key]().map(res => {
        this._subjectMap[key].next(res);
        return res;
      });
    }catch(e){
      console.log(key, e.message);
      return Observable.of(null);
    }
  }

  republish(key: string, data: any){
    this._subjectMap[key].next(data);
  }

  clear(storage: boolean = true, whitelist: Array<string> = []){

    Object.keys(this._subjectMap).forEach(key => {
      if(whitelist.indexOf(key) < 0)
        delete this._subjectMap[key];
    });
    Object.keys(this._observableMap).forEach(key => {
      if(whitelist.indexOf(key) < 0)
        delete this._observableMap[key];
    });
    Object.keys(this._cache).forEach(key => {
      if(whitelist.indexOf(key) < 0)
        delete this._cache[key];
    });

    if(storage)
      localStorage.clear();
  }

  clearKey(key: string){
    localStorage.removeItem(key);
    delete this._cache[key];
    delete this._observableMap[key];
    delete this._subjectMap[key];
  }
}
