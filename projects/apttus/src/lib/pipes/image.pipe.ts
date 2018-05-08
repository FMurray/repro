import { Pipe, PipeTransform, NgZone} from '@angular/core';
import {ConfigService} from '../packages/config/config.service';
import {ContentDistribution} from '../packages';
import * as _ from 'lodash';

let _windowConfig = (<any>window).sv;

@Pipe({
  name : 'image'
})
export class ImagePipe implements PipeTransform{

  constructor(private configService: ConfigService){}

  transform(content: ContentDistribution, args?:any): any{
    let orgId = (_windowConfig) ? _windowConfig.organizationId : this.configService._params.organizationid;

    let endpoint = '';
    if(_.get(_windowConfig, 'baseURL'))
      endpoint = _.get(_windowConfig, 'baseURL');
    else if(_.get(_windowConfig, 'salesforceEndpoint'))
      endpoint = 'https://' + _.get(_windowConfig, 'salesforceEndpoint');
    else
      endpoint = this.configService._params.salesforceEndpoint;

    let defaultImageSrc = (_windowConfig) ? _windowConfig.resource : '.';
    defaultImageSrc += (this.configService._params.defaultImageSrc) ? this.configService._params.defaultImageSrc : '/assets/images/placeholder.png';

    if(content && content.DistributionPublicUrl){
      let distributionPrefix = content.DistributionPublicUrl.substring(0, content.DistributionPublicUrl.indexOf('/sfc/'));
      let distributionSuffix = content.DistributionPublicUrl.substring(content.DistributionPublicUrl.indexOf('/a/'));
      return distributionPrefix + '/sfc/dist/version/download/?oid=' + orgId + '&ids=' + content.ContentVersionId + '&d=' + distributionSuffix + '&operationContext=DELIVERY&dpt=null';
    }else if(content){
      return endpoint + '/servlet/servlet.FileDownload?file=' + content;
    }else{
      return defaultImageSrc;
    }
  }
}
