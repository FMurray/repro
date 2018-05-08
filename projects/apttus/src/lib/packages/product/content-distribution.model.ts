import {SObject} from '../../utils/sobject.model';

export interface ContentDistribution extends SObject{
  Name: string;
  ContentDocumentId : string;
  DistributionPublicUrl : string;
  ContentVersionId: string;
}
