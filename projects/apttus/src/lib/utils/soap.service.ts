import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {ForceService} from './force.service';

declare var X2JS: any;

@Injectable()
export class SoapService {

  //Apttus_CPQApi/CPQWebService
  //00D41000002GYtI!ARAAQGUoK2H2YTj8ULjV5kfnjzf1gP1UDmdzv.3ReVJcWbN3jjPQ2rvXYH.kJsoJRSovEoN6qaDvCx5JNeLrv_5FdBE059AZ


  private envelope: String = `<?xml version="1.0" encoding="utf-8"?>
    <env:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="http://soap.sforce.com/schemas/class/{{class}}">
      <env:Header>
        <urn:SessionHeader>
          <urn:sessionId>{{sessionId}}</urn:sessionId>
        </urn:SessionHeader>
      </env:Header>
      <env:Body>
        <urn:{{method}}>
        	{{body}}
        </urn:{{method}}>
      </env:Body>
    </env:Envelope>
  `;

  constructor(private http: HttpClient, private force: ForceService) { }

  // private createAuthorizationHeader(method: string) {
  //   let headers: Headers = new Headers();
  //   headers.append('Content-Type', 'text/xml');
  //   headers.append('SOAPAction', 'urn:' + method);
  //   headers.append('Accept', 'text/xml');
  //   return headers;
  // }

  public doRequest(_class: string, method: string, body: any): Observable<any>{
    let base = this.envelope;
    base = base.replace(new RegExp("{{class}}", 'g'), _class);
    base = base.replace(new RegExp("{{method}}", 'g'), method);
    base = base.replace(new RegExp("{{sessionId}}", 'g'), this.force.connection.accessToken);
    let bodyStr = '';
    bodyStr += SoapService.getBody(body, null);
    base = base.replace('{{body}}', bodyStr);

    return Observable.fromPromise(this.force.connection.requestSoap('/services/Soap/class/' + _class, base, method)).map((res:any) => {
      SoapService.iterate(res);
      let jsonResponse = res;
      if(jsonResponse.Envelope && jsonResponse.Envelope.Body && jsonResponse.Envelope.Body[method + 'Response'] && jsonResponse.Envelope.Body[method + 'Response'].result)
        return jsonResponse.Envelope.Body[method + 'Response'].result;
      else
        return jsonResponse;
    });
  }

  private static getBody(body, response){

    if(!response)
      response = '';

    if(Array.isArray(body) || typeof body === 'object'){
      for(var key in body){
        if(Array.isArray(body[key])){
          for(var x in body[key]){
            if(!SoapService.isFunction(body[key][x])){
              response += '<urn:' + key + '>';
              response += SoapService.getBody(body[key][x], null);
              response += '</urn:' + key + '>';
            }
          }
        }else if(typeof body[key] === 'object' && !SoapService.isFunction(body[key])){
          response += '<urn:' + key + '>' + SoapService.getBody(body[key], null) + '</urn:' + key + '>';
        }else{

          response += '<urn:' + key + '>' + body[key] + '</urn:' + key + '>';
        }
      }
    }else{
      return body;
    }
    return response;
  }

  private static iterate(obj) {
      for (var property in obj) {
        var toDel = false;
        if(property.indexOf(':') > -1){
          var newProp = property.substring(property.lastIndexOf(':') + 1);
          obj[newProp] = obj[property];
          toDel = true;
        }

        if (obj.hasOwnProperty(property)) {
          if (typeof obj[property] == "object")
              SoapService.iterate(obj[property]);
        }

        if(toDel)
          delete obj[property];
      }
  }

  private static isFunction(functionToCheck){
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

}
