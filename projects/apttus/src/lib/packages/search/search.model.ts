import {ContentDistributionWrapper} from '../product/product-wrapper.model';
import {Category} from '../category/category.model';

export interface SearchResults{
      productList: Array<ContentDistributionWrapper>;
      relatedCategories: Array<Category>;
      breadcrumb : Array<Category>;
      subcategories : Array<Category>;
      totalRecords : any;
      aggregateTotal: any;
}
