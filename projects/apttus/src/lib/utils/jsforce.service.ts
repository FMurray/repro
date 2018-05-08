export class JSForceService{

  public static fixIdentity(jsforce: any, SF_ENDPOINT: string){
    jsforce.Connection.prototype.identity = function(options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options = options || {};
      var self = this;
      var idUrl = this.userInfo && this.userInfo.url;
      return Promise.resolve(
        idUrl ?
        { identity: idUrl } :
        this.request({ method: 'GET', url: this._baseUrl(), headers: options.headers })
      ).then(function(res) {

        var url = res.identity;
        url = url.substring(url.indexOf('.com') + 4);

        url = SF_ENDPOINT+ url + '?format=json&oauth_token=' + encodeURIComponent(self.accessToken);
        var transport = undefined;
        return self.request({ method: 'GET', url: url }, { transport: transport });
      }).then(function(res) {
        if(res){
          self.userInfo = {
            id: res.user_id,
            organizationId: res.organization_id,
            url: res.id
          };
        }
        return res;
      }).then(callback);
    };
  }

  public static fixSoapLogin(jsforce: any, organizationId, baseUrl: string){
    function esc(str) {
      return str && String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                               .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    jsforce.Connection.prototype.loginBySoap = function(username, password, callback) {
      var self = this;
      var logger = this._logger;
      var body = [
        '<se:Envelope xmlns:se="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:partner.soap.sforce.com">',
          '<se:Header>',
          '<ns1:LoginScopeHeader><ns1:organizationId>' + organizationId + '</ns1:organizationId></ns1:LoginScopeHeader>',
          '</se:Header>',
          '<se:Body>',
            '<ns1:login xmlns="urn:partner.soap.sforce.com">',
              '<ns1:username>' + esc(username) + '</ns1:username>',
              '<ns1:password>' + esc(password) + '</ns1:password>',
            '</ns1:login>',
          '</se:Body>',
        '</se:Envelope>'
      ].join('');

      var soapLoginEndpoint = [ this.loginUrl, "services/Soap/u", this.version ].join('/');

      return this._transport.httpRequest({
        method : 'POST',
        url : soapLoginEndpoint,
        body : body,
        headers : {
          "Content-Type" : "text/xml",
          "SOAPAction" : '""'
        }
      }).then(function(response) {
        var m;
        if (response.statusCode >= 400) {
          m = response.body.match(/<faultstring>([^<]+)<\/faultstring>/);
          var faultstring = m && m[1];
          throw new Error(faultstring || response.body);
        }
        logger.debug("SOAP response = " + response.body);
        m = response.body.match(/<serverUrl>([^<]+)<\/serverUrl>/);
        var serverUrl = m && m[1];
        m = response.body.match(/<sessionId>([^<]+)<\/sessionId>/);
        var sessionId = m && m[1];
        m = response.body.match(/<userId>([^<]+)<\/userId>/);
        var userId = m && m[1];
        m = response.body.match(/<organizationId>([^<]+)<\/organizationId>/);
        var orgId = m && m[1];
        var idUrl = soapLoginEndpoint.split('/').slice(0, 3).join('/');
        idUrl += "/id/" + orgId + "/" + userId;
        var userInfo = {
          id: userId,
          organizationId: orgId,
          url: idUrl
        };
        self.initialize({
          serverUrl: serverUrl.split('/').slice(0, 3).join('/'),
          sessionId: sessionId,
          userInfo: userInfo
        });
        logger.debug("<login> completed. user id = " + userId + ", org id = " + orgId);
        return userInfo;

      }).thenCall(callback);

    };
  }

  public static fixProxy(transport: any, baseUrl: string){
    transport.httpRequest = function(params, callback) {
      var url = params.url;
      if (url.indexOf("/") === 0) {
        url = baseUrl + url;
      }
      var data;
      if(url.indexOf('?') >= 0){
        params.method = 'POST';
        data = url.substring(url.indexOf('?'));
        url = url.substring(0, url.indexOf('?'));
      }

      var proxyParams = {
        method: params.method,
        url: this._proxyUrl + '?' + Date.now() + "." + ("" + Math.random()).substring(2),
        body : {},
        headers : {
          'salesforceproxy-endpoint' : url
        }
      };

      if (params.body || params.body === "") {
        proxyParams.body = params.body;
      }else if(data){
        proxyParams.headers['content-type'] = 'application/json';
        proxyParams.body = JSON.stringify({data : data});
      }


      if (params.headers) {
        for (var name in params.headers) {
          proxyParams.headers[name] = params.headers[name];
        }
      }
      return transport.__proto__.__proto__.httpRequest.call(this, proxyParams, callback);
    };
  }

  public static addSoapCallout(jsforce: any){
    jsforce.Connection.prototype.requestSoap = function(url, body, method, options, callback){
      var request = {
        method: "POST",
        url: url,
        body: body,
        headers: { "content-type": "text/xml", "SOAPAction" : "urn:"  + method, "Accept" : "text/xml" }
      };
      return this.request(request, options, callback);
    }
  }

}
