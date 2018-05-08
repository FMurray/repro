import {Injectable, Inject} from '@angular/core';

export class ApiConfig{
  salesforceEndpoint: string;
  organizationid: string;
  storeName: string;
  production: boolean;
  defaultImageSrc?: string;
  accessToken: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  internalSalesforceEndpoint?: string;
}

@Injectable()
export class ConfigService {

  constructor(@Inject('config') config: ApiConfig){
    this._params = config;
  }
  public _params: any;
  public HEROKU_BASE = 'https://six-vertical-proxy.herokuapp.com';
  public HEROKU_ENDPOINT = this.HEROKU_BASE + '/proxy';
  //public GUEST_INFO_URL = 'https://ipinfo.io';
  public GUEST_INFO_URL = 'https://ip-api.com/json';
  public STORAGE_KEY = 'credentials';
  public STORAGE_ACCESS_TOKEN = 'access_token'
  public SV = 'u/Gu5posvwDsXUnV5Zaq4g==';
  public IV = '5D9r9ZVzEYYgha93/aUK2w==';
}
