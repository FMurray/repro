import {PriceListService} from '../price-list/price-list.service';
import {PriceList} from '../price-list/price-list.model';
import {PriceTier} from '../price-list/price-list-item.model';
import {ProductFactory} from '../product/product.model';
import {ProductService} from '../product/product.service';
import {SObjectService} from '../../utils/sobject.model';
import {CategoryFactory, Category} from '../category/category.model';
import {CategoryService} from '../category/category.service';
import {SearchResults} from './search.model';
import {Observable} from 'rxjs/Rx';

export class SearchService extends PriceListService{
  name = 'search';
   
  searchProductsByCategory(categoryId: string, limit: number, offset: number, orderBy: string, orderDirection: string, categoryFilter : Array<Category>, priceTier: PriceTier, adtlFilters: Array<string>): Observable<SearchResults>{
    return this.getPriceListId()
      .filter(plid => (plid != null && plid != undefined))
      .flatMap((priceListId: string) => {
        let productService = new ProductService(this.forceService, this.http, this.configService, this.cacheService);
        let categoryService = new CategoryService(this.forceService, this.http, this.configService, this.cacheService);

        return Observable.combineLatest(productService.getProductsByCategory(categoryId, limit, offset, orderBy, orderDirection, categoryFilter, priceTier, adtlFilters),
                            categoryService.getCategoryBranch(categoryId),
                            categoryService.getSubcategories(categoryId),
                            categoryService.getRelatedCategories(categoryId),
                            productService.aggregate(ProductService.where(priceListId, categoryId, categoryFilter, null, priceTier, adtlFilters)),
                            productService.getAggregatesForCategory(categoryId, null, null, null)).map(res => {
          return {
            productList : res[0],
            breadcrumb : res[1],
            subcategories : res[2],
            relatedCategories : res[3],
            totalRecords : res[4],
            aggregateTotal : res[5]
          } as SearchResults
        });
      })
  }

  getSearchResults(query: string, limit: number, offset: number, orderBy: string, orderDirection: string, categoryFilter: Array<Category>, priceTier: PriceTier, adtlFilters: Array<string>): Observable<SearchResults>{
    query = query.replace(/([<>*()?-])/g, "\\$1");
    if(query.trim().length < 2){
      return Observable.of({productList : null, aggregateTotal : null, totalRecords : null} as SearchResults);
    }else{
      return this.getPriceListId()
      .filter(plid => (plid != null && plid != undefined))
      .flatMap((priceListId : string) => {
        let productService = new ProductService(this.forceService, this.http, this.configService, this.cacheService);
        productService.type = ProductFactory(priceListId);
        let categoryService = new SObjectService(this.forceService, this.http, this.configService, this.cacheService);
        categoryService.type = CategoryFactory(priceListId);

        return productService._search(this.findQuery(query, priceListId))
        .map(res => SObjectService.toIdArray(res[0]))
        .flatMap(idArray => {
            let csv = SObjectService.arrayToCsv(idArray);
            let product$ = productService.queryBuilder(this.selectQuery(csv, priceListId, categoryFilter, priceTier, adtlFilters), limit, offset, orderBy, orderDirection, true)
                                          .flatMap(res => productService.translateWrapper(res));
            let category$ = categoryService.where(`ID IN (SELECT Apttus_Config2__ClassificationId__c FROM Apttus_Config2__ProductClassification__c WHERE Apttus_Config2__ProductId__c IN (` + csv + `)) ORDER BY Name ASC LIMIT 10`, 'category_' + query);
            let aggregateTotal$ = productService.getAggregatesForProductList(idArray, null, null, null);
            let count$ = productService.aggregate(this.selectQuery(csv, priceListId, categoryFilter, priceTier, adtlFilters));
            return Observable.combineLatest(product$, category$, count$, aggregateTotal$).map(res => {
              return {
                productList : res[0],
                subcategories: res[1],
                totalRecords : res[2],
                aggregateTotal : res[3]
              } as SearchResults;
            });
          });
        });
    }
  }

  private findQuery(query: string, priceListId: string): string{
    return `FIND {*` + query + `*} IN ALL FIELDS
              RETURNING Product2(Id WHERE IsActive = true AND ID IN
                                  (SELECT Apttus_Config2__ProductId__c
                                    FROM Apttus_Config2__PriceListItem__c
                                    WHERE Apttus_Config2__PriceListId__c = '` + priceListId + `' AND Apttus_Config2__ListPrice__c <> NULL AND Apttus_Config2__Active__c = TRUE))`;
  }

  private selectQuery(csv: string, priceListId: string, categoryList: Array<Category>, priceTier: PriceTier, adtlFilters: Array<string>): string{
    return `
    Id IN (SELECT Apttus_Config2__ProductId__c
            FROM Apttus_Config2__PriceListItem__c
            WHERE Apttus_Config2__PriceListId__c = '` + priceListId + `'`
            + ` AND Apttus_Config2__ListPrice__c <> NULL AND Apttus_Config2__Active__c = TRUE`
            + ((priceTier && priceTier.minPrice) ? ` AND Apttus_Config2__ListPrice__c >= ` + priceTier.minPrice : ``)
            + ((priceTier && priceTier.maxPrice) ? ` AND Apttus_Config2__ListPrice__c <= ` + priceTier.maxPrice : ``)
            + ((adtlFilters && adtlFilters.length > 0) ? ' AND ' + adtlFilters.join(' AND ') : '')
        + `)
        AND ID IN (` + csv + `)`
    + ((categoryList && categoryList.length > 0) ? ` AND ID IN
                                (SELECT Apttus_Config2__ProductId__c
                                  FROM Apttus_Config2__ProductClassification__c
                                  WHERE Apttus_Config2__ClassificationId__c IN (` + SObjectService.arrayToCsv(SObjectService.toIdArray(categoryList)) + `))` : ``);
  }

}
