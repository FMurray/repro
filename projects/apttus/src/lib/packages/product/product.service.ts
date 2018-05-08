import { SObjectService } from '../../utils/sobject.model';
import { Observable } from 'rxjs/Rx';
import { ProductFactory, Product } from './product.model';
import { ProductWrapper, ContentDistributionWrapper } from './product-wrapper.model';
import { CategoryService } from '../category/category.service';
import { PriceListService } from '../price-list/price-list.service';
import { PriceListItem, PriceListItemFactory, PriceTier } from '../price-list/price-list-item.model';
import { PriceList } from '../price-list/price-list.model';
import { SearchResults } from '../search/search.model';
import { Category } from '../category/category.model';
import { ProductOptionGroup, ProductOptionGroupFactory } from './product-option-group.model';
import { ConstraintRuleCondition } from '../constraint-rule/constraint-condition.model';
import { ProductTranslation } from './product-translation.model';
import { LOCALE, getLocale } from '../conversion/conversion.model';
import { UserService } from '../user/user.service';

export class ProductService extends SObjectService {

  public type = ProductFactory();
  name = 'product';

  getProductByCode(productCodeList: Array<string>): Observable<Array<ContentDistributionWrapper>> {
    const plService = new PriceListService(this.forceService, this.http, this.configService, this.cacheService);
    const list = SObjectService.arrayToCsv(productCodeList);
    return this.cacheService.get(list, () =>
      plService.getPriceListId()
        .filter(res => (res != null))
        .flatMap((priceListId: string) => {
          this.type = Object.assign(this.type, ProductFactory(priceListId));
          return this._queryBuilder(`Id IN (SELECT Apttus_Config2__ProductId__c
                                                    FROM Apttus_Config2__PriceListItem__c
                                                    WHERE Apttus_Config2__PriceListId__c = '` + priceListId + `')
                                            AND ProductCode IN (` + list + `)`, null, null, null, null, true, list + ':' + priceListId).filter(res => res != null)
        })
        .flatMap(productList => this.translateWrapper(productList))
    );
  }

  getProductsForBundle(product: Product): Observable<Array<ProductOptionGroup>> {
    const plService = new PriceListService(this.forceService, this.http, this.configService, this.cacheService);

    return plService.getPriceListId()
      .flatMap((priceListId: string) => {
        this.type = Object.assign(this.type, ProductFactory(priceListId));
        const optionService = new SObjectService(this.forceService, this.http, this.configService, this.cacheService);
        optionService.type = ProductOptionGroupFactory(priceListId);

        return optionService.where(`Apttus_Config2__ProductId__c = '` + product.Id + `'`, product.Id + '_options');
      })
  }

  getProductsByCategory(categoryId: string, limit: number, offset: number, orderBy: string, orderDirection: string, categoryFilter: Array<Category>, priceTier: PriceTier, adtlFilters: Array<string>): Observable<Array<ContentDistributionWrapper>> {
    if (!categoryId)
      return Observable.of([]);
    else {
      let plService = new PriceListService(this.forceService, this.http, this.configService, this.cacheService);

      return plService.getPriceListId()
        .flatMap((priceListId: string) => {
          this.type = Object.assign(this.type, ProductFactory(priceListId));
          return this.queryBuilder(ProductService.where(priceListId, categoryId, categoryFilter, null, priceTier, adtlFilters), limit, offset, orderBy, orderDirection, true)
        })
        .flatMap((contentList: Array<ContentDistributionWrapper>) => this.translateWrapper(contentList));
    }
  }

  getAggregatesForCategory(categoryId: string, categoryFilter: Array<Category>, priceTier: PriceTier, adtlFilters: Array<string>): Observable<any> {
    let plService = new PriceListService(this.forceService, this.http, this.configService, this.cacheService);
    let pliService = new SObjectService(this.forceService, this.http, this.configService, this.cacheService);
    return plService.getPriceListId()
      .flatMap((priceListId: string) => {
        pliService.type = PriceListItemFactory(priceListId);
        return pliService.aggregate(ProductService.whereAggregate(priceListId, categoryId, categoryFilter, priceTier, adtlFilters)).map(res => {
          return res[0]
        });
      });
  }

  getAggregatesForProductList(productIdList: Array<string>, categoryFilter: Array<Category>, priceTier: PriceTier, adtlFilters: Array<string>): Observable<any> {
    let pliService = new SObjectService(this.forceService, this.http, this.configService, this.cacheService);
    if (!productIdList || productIdList.length == 0)
      return Observable.of({ total_records: 0 });
    else {
      let plService = new PriceListService(this.forceService, this.http, this.configService, this.cacheService);
      return plService.getPriceListId()
        .flatMap((priceListId: string) => {
          pliService.type = PriceListItemFactory(priceListId);

          return pliService.aggregate(ProductService.whereAggregate(priceListId, null, categoryFilter, priceTier, adtlFilters, productIdList)).map(res => res[0]);
        });
    }
  }


  getProductsForContstraintRuleCondition(constraintRuleConditions: Array<ConstraintRuleCondition>, type: string): Observable<Array<ContentDistributionWrapper>> {
    let plService = new PriceListService(this.forceService, this.http, this.configService, this.cacheService);
    return plService.getPriceListId()
      .flatMap((priceListId: string) => {
        this.type = ProductFactory(priceListId);
        let idArray = SObjectService.arrayToCsv(SObjectService.toPropertyArray(constraintRuleConditions, 'Apttus_Config2__ConstraintRuleId__c'));
        return this._queryBuilder(`Id IN (SELECT Apttus_Config2__ProductId__c FROM Apttus_Config2__ConstraintRuleAction__c WHERE Apttus_Config2__ConstraintRuleId__c IN (` + idArray + `) AND Apttus_Config2__ActionType__c = '` + type + `')`, null, null, null, null, true, constraintRuleConditions[0].Apttus_Config2__ProductId__c + ':actionProducts');
      }).flatMap((contentList: Array<ContentDistributionWrapper>) => this.translateWrapper(contentList));
  }


  getRelatedProducts(product: Product, type?: string, rank?: string, limit: number = 10): Observable<Array<ContentDistributionWrapper>> {
    const plService = new PriceListService(this.forceService, this.http, this.configService, this.cacheService);
    return plService.getPriceListId()
      .flatMap((priceListId: string) => {
        let query = `ID IN (SELECT Apttus_Config2__RelatedProductId__c FROM Apttus_Config2__RelatedProduct__c WHERE Apttus_Config2__ProductId__c = '` + product.Id + `'`;
        query += (type) ? ` AND Apttus_Config2__RelationType__c = '` + type + `'` : ``;
        query += (rank) ? ` AND Apttus_Config2__Rank__c = '` + rank + `'` : ``;
        query += ')';
        this.type = ProductFactory(priceListId);
        return this._queryBuilder(
          query,
          limit, null, null, null, true
          , 'related: ' + product.Id
        );
      }).flatMap((contentList: Array<ContentDistributionWrapper>) => this.translateWrapper(contentList));
  }

  public translateWrapper(contentList: Array<ContentDistributionWrapper>): Observable<Array<ContentDistributionWrapper>> {
    if (contentList) {
      const productList: Array<Product> = contentList.filter(c => (c != null)).map(c => c.entity);
      return this.translateProduct(productList).map(pList => {
        pList.forEach(product => {
          contentList.forEach(content => {
            if (content && content.entity && content.entity.Id == product.Id) {
              content.entity = product;
            }
          });
        });
        return contentList;
      });
    } else
      return Observable.of(contentList);

  }

  public translateProduct(_productList: Array<Product>): Observable<Array<Product>> {
    const userService = new UserService(this.forceService, this.http, this.configService, this.cacheService);

    return userService.me().map(user => {
      const productList = _productList.map(x => Object.assign({}, x));
      for (const product of productList) {
        if (product && product.Apttus_Config2__Translation__r && product.Apttus_Config2__Translation__r.records) {
          const translation: ProductTranslation = product.Apttus_Config2__Translation__r.records.filter((record: ProductTranslation) => {
            if (record && record.Apttus_Config2__Language__c)
              return record.Apttus_Config2__Language__c.toLowerCase() === getLocale(user.LanguageLocaleKey).pim.toLowerCase()
            else return false;
          })[0];

          if (translation) {
            product.Description = (translation.Apttus_Config2__Description__c) ? translation.Apttus_Config2__Description__c : product.Description;
            product.Family = (translation.Apttus_Config2__Family__c) ? translation.Apttus_Config2__Family__c : product.Family;
            product.Name = (translation.Apttus_Config2__Name__c) ? translation.Apttus_Config2__Name__c : product.Name;
            product.ProductCode = (translation.Apttus_Config2__ProductCode__c) ? translation.Apttus_Config2__ProductCode__c : product.ProductCode;
            for (const property in translation) {
              if (product.hasOwnProperty(property) && property.toLowerCase() !== 'id') {
                product[property] = translation[property];
              }
            }
          }
        }
      }
      return productList;
    })
  }

  private static whereAggregate(priceListId: string, categoryId: string, categoryFilter: Array<Category>, priceTier: PriceTier, adtlFilters: Array<string>, productIdList?: Array<string>): string {
    return `Apttus_Config2__ProductId__r.isActive = true AND Apttus_Config2__PriceListId__c = '` + priceListId + `' AND Apttus_Config2__ListPrice__c <> NULL AND Apttus_Config2__Active__c = TRUE`
      + ` AND(Apttus_Config2__EffectiveDate__c = NULL OR Apttus_Config2__EffectiveDate__c <= TODAY)`
      + ` AND(Apttus_Config2__ExpirationDate__c = NULL OR Apttus_Config2__ExpirationDate__c >= TODAY)`
      + ((priceTier && priceTier.minPrice) ? ` AND Apttus_Config2__ListPrice__c >= ` + priceTier.minPrice : ``)
      + ((priceTier && priceTier.maxPrice) ? ` AND Apttus_Config2__ListPrice__c <= ` + priceTier.maxPrice : ``)
      + ((adtlFilters && adtlFilters.length > 0) ? ' AND ' + adtlFilters.join(' AND ') : '')
      + ((productIdList && productIdList.length > 0) ? ` AND Apttus_Config2__ProductId__c IN (` + SObjectService.arrayToCsv(productIdList) + `)` : ``)
      + ((categoryId || (categoryFilter && categoryFilter.length > 0)) ? ` AND Apttus_Config2__ProductId__c IN (` + ProductService.categoryFilter(categoryId, categoryFilter) + `)` : ``);
  }

  public static where(priceListId: string, categoryId: string, categoryFilter: Array<Category>, productFilter: Array<any>, priceTier: PriceTier, adtlFilters: Array<string>): string {
    return `IsActive = true AND Id IN (SELECT Apttus_Config2__ProductId__c
                                              FROM Apttus_Config2__PriceListItem__c
                                              WHERE Apttus_Config2__PriceListId__c = '` + priceListId + `'`
      + ` AND(Apttus_Config2__EffectiveDate__c = NULL OR Apttus_Config2__EffectiveDate__c <= TODAY)`
      + ` AND(Apttus_Config2__ExpirationDate__c = NULL OR Apttus_Config2__ExpirationDate__c >= TODAY)`
      + ` AND Apttus_Config2__ListPrice__c <> NULL AND Apttus_Config2__Active__c = TRUE`
      + ((priceTier && priceTier.minPrice) ? ` AND Apttus_Config2__ListPrice__c >= ` + priceTier.minPrice : ``)
      + ((priceTier && priceTier.maxPrice) ? ` AND Apttus_Config2__ListPrice__c <= ` + priceTier.maxPrice : ``)
      + ((adtlFilters && adtlFilters.length > 0) ? ' AND ' + adtlFilters.join(' AND ') : '')
      + `) AND Id IN (` + ProductService.categoryFilter(categoryId, categoryFilter) + `)`;
  }

  private static categoryFilter(categoryId: string, categoryList: Array<Category>): string {
    if (categoryId || (categoryList && categoryList.length > 0)) {
      return `SELECT Apttus_Config2__ProductId__c
              FROM Apttus_Config2__ProductClassification__c
              WHERE `
        + ((categoryId) ? ProductService.generateLookups('Apttus_Config2__ClassificationId__c', 'Apttus_Config2__AncestorId__c', 5, [categoryId]) : ``)
        + ((categoryId && categoryList && categoryList.length > 0) ? ` AND ` : ` `)
        + ((categoryList && categoryList.length > 0) ?
          ProductService.generateLookups('Apttus_Config2__ClassificationId__c', 'Apttus_Config2__AncestorId__c', 5, SObjectService.toIdArray(categoryList))
          : ``);
    }
    else return ``;
  }


  private static generateLookups(firstField: string, parentField: string, depth: number, idList: string[]) {
    let query: string = '('
    for (let i = 0; i <= depth; i++) {
      if (i != 0)
        query += ' OR ';
      if (i == 0)
        query += firstField;
      else {
        query += firstField.substring(0, firstField.indexOf('__c')) + '__r.';
        for (let x = 1; x <= i; x++) {
          if (x == i)
            query += parentField;
          else
            query += parentField.substring(0, parentField.indexOf('__c')) + '__r.';
        }
      }
      query += ' IN (' + SObjectService.arrayToCsv(idList) + ')';
    }
    query += ')';
    return query;
  }
}
