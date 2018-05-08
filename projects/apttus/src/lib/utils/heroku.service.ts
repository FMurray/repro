import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ForceService } from "./force.service";
import { ConfigService } from "../packages/config/index";
import "rxjs/add/operator/share";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";

//const endpoint: string = 'http://www.hexxie.com:5000';

@Injectable()
export class HerokuService {
  public loading: boolean = false;
  //public endpoint: string = 'http://www.hexxie.com:5000'
  private static TAG: string = "heroku_tag";
  private _cache: any;

  constructor(
    private http: HttpClient,
    private forceService: ForceService,
    private config: ConfigService
  ) {}

  createAuthorizationHeader() {
    let headers = new HttpHeaders();
    headers.set("x-access-token", this.forceService.connection.accessToken);
    headers.set("x-instance-url", this.forceService.connection.instanceUrl);
    return headers;
  }

  getEndpoint() {
    return this.config.HEROKU_BASE;
  }

  cacheData(location: string, obsv: Observable<any>): Observable<any> {
    let data = this._cache.get(location);
    if (data) return Observable.of(data);
    else return obsv;
  }

  clearCache() {
    this._cache.removeTag(HerokuService.TAG);
  }

  get(url) {
    return this.cacheData(
      "GET_" + url,
      this.http.get(this.config.HEROKU_BASE + url)
    );
  }

  post(url, data) {
    return this.cacheData(
      JSON.stringify(data),
      this.http.post(this.config.HEROKU_BASE + url, data)
    );
  }

  getAuthorized(url: string) {
    return this.cacheData(
      "GET_A_" + url,
      this.http.get(this.config.HEROKU_BASE + url, {
        headers: this.createAuthorizationHeader()
      })
    );
  }

  postAuthorized(url: string, data: any) {
    return this.cacheData(
      JSON.stringify(data),
      this.http.post(this.config.HEROKU_BASE + url, data, {
        headers: this.createAuthorizationHeader()
      })
    );
  }

  deleteAuthorized(url: string) {
    return this.http.delete(this.config.HEROKU_BASE + url, {
      headers: this.createAuthorizationHeader()
    });
  }

  putAuthorized(url: string, data: any) {
    return this.http.put(this.config.HEROKU_BASE + url, data, {
      headers: this.createAuthorizationHeader()
    });
  }

  downloadFile(attachmentId) {
    return this.getAuthorized("/products/attachment/" + attachmentId)
      .catch(e => {
        return this.forceService
          .login(null, null)
          .flatMap(u =>
            this.getAuthorized("/products/attachment/" + attachmentId)
          );
      })
      .map((data: any) => {
        return this.getEndpoint() + data.uri;
      });
  }
}
