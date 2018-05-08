import {Product} from './product.model';
import {ContentDistribution} from './content-distribution.model';
import {SObject} from '../../utils/sobject.model';
import {Storefront} from '../storefront/storefront.model';
import {Promotion} from '../promotion/promotion.model';

export interface ProductWrapper{
  product: Product;
  images : Array<ContentDistribution>
}
export interface ContentDistributionWrapper{
  entity : any,
  imageList : Array<ContentDistribution>
}
