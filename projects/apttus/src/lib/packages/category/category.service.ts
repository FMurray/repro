import { Observable, BehaviorSubject } from "rxjs/Rx";
import { SObjectService } from "../../utils/sobject.model";
import { PriceListService } from "../price-list/price-list.service";
import { Category, CategoryFactory } from "./category.model";
import { Classification, ClassificationFactory } from "./classification.model";
import { Product } from "../product/product.model";
import { ProductCategory } from "./product-category.model";
import { LOCALE, getLocale } from "../conversion/conversion.model";
import { CategoryTranslation } from "./category-translation.model";
import { UserService } from "../user/index";

import * as _ from "lodash";

export class CategoryService extends SObjectService {
  private _categories: BehaviorSubject<Array<Category>>;
  private _categoryTree: Array<Category>;
  name = "category";

  public getCategories(featured?: boolean): Observable<Array<Category>> {
    const userService = new UserService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );
    const plService = new PriceListService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );
    if (!featured) {
      return this.cacheService
        .get("categories", () =>
          plService
            .getPriceListId()
            .filter(res => res != null)
            .flatMap(priceListId =>
              userService
                .me()
                .take(1)
                .flatMap(user => {
                  this.type = CategoryFactory(priceListId);
                  return this.where(
                    `Apttus_Config2__HierarchyId__c IN (SELECT Apttus_Config2__HierarchyId__c FROM Apttus_Config2__PriceListCategory__c WHERE Apttus_Config2__PriceListId__c = '` +
                      priceListId +
                      `') 
                  AND (Apttus_Config2__AncestorId__c <> NULL OR Apttus_Config2__PrimordialId__c = NULL)
                  AND Apttus_Config2__IsHidden__c = FALSE`,
                    "categories:" + priceListId
                  ).map(categories =>
                    this.translateCategories(
                      getLocale(user.LanguageLocaleKey),
                      categories
                    )
                  );
                })
            )
        )
        .filter(res => res != null);
    } else {
      return this.cacheService
        .get("featuredCategories", () =>
          plService
            .getPriceListId()
            .filter(res => res != null)
            .flatMap(priceListId =>
              userService
                .me()
                .take(1)
                .flatMap(user => {
                  this.type = CategoryFactory(priceListId);
                  return this.where(
                    `Apttus_Config2__HierarchyId__c IN (SELECT Apttus_Config2__HierarchyId__c FROM Apttus_Config2__PriceListCategory__c WHERE Apttus_Config2__PriceListId__c = '` +
                      priceListId +
                      `')
                  AND (Apttus_Config2__AncestorId__c <> NULL OR Apttus_Config2__PrimordialId__c = NULL)
                  AND Apttus_Config2__IsHidden__c = FALSE
                  AND Is_Featured__c = TRUE`,
                    "featuredCategories:" + priceListId
                  )
                    .flatMap((categories: Array<Category>) => {
                      let batch = [];
                      categories.map(cat => {
                        if (
                          cat.Feature_Type__c &&
                          cat.Feature_Type__c.indexOf("Subcategory") > -1
                        ) {
                          batch.push(
                            this.where(
                              `Apttus_Config2__AncestorId__c = '${cat.Id}'`,
                              "children"
                            ),
                            Observable.of(cat)
                          );
                        } else {
                          batch.push(Observable.of(cat));
                        }
                      });
                      return Observable.combineLatest(batch);
                    })
                    .map(categories => {
                      return this.translateCategories(
                        getLocale(user.LanguageLocaleKey),
                        categories
                      );
                    })
                    .map(categories => {
                      let cats = [],
                        subs = [];
                      cats = categories.filter(c => c.Id);
                      subs = categories.filter(c => !c.Id);
                      subs.forEach(sub => {
                        let parent = cats.find(c => {
                          return c.Id === sub[0].Apttus_Config2__AncestorId__c;
                        });
                        if (parent) {
                          parent.Children = [];
                          for (let key in sub) {
                            if (sub[key]) parent.Children.push(sub[key]);
                          }
                        }
                      });
                      return cats;
                    });
                })
            )
        )
        .filter(res => res != null);
    }
  }

  public getCategoryTree(
    categoryNames?: Array<string>
  ): Observable<Array<Category>> {
    if (this._categoryTree) return Observable.of(this._categoryTree);
    else
      return this.getCategories().map(data => {
        let roots = [];

        const recursive = (a: Category, parent: Category) => {
          a.Children = new Array<any>();
          if (!parent) parent = a;

          for (const category of data) {
            if (_.get(category, "Apttus_Config2__AncestorId__c") === a.Id) {
              if (
                (category.Fade_Out__c ||
                  (category.Apttus_Config2__ProductCount__c === 0 &&
                    category.Apttus_Config2__IsLeaf__c.toLowerCase() ===
                      "yes")) &&
                !category.APTSMD_Primary_Product__r
              )
                recursive(category, parent);
              else if (!category.Children) {
                recursive(category, category);
                parent.Children.push(category);
              } else {
                parent.Children.push(category);
              }
            }
          }
        };
        for (const record of data) {
          recursive(record, null);

          if (
            categoryNames &&
            categoryNames.indexOf(record.Name) >= 0 &&
            record.Children &&
            record.Children.length > 0
          ) {
            roots = roots.concat(record);
          } else if (
            !categoryNames &&
            record.Children &&
            record.Children.length > 0 &&
            !record.Apttus_Config2__AncestorId__c
          )
            roots = roots.concat(record);
        }
        this._categoryTree = roots;
        return roots;
      });
  }

  getCategoryBranch(categoryId: string): Observable<Array<Category>> {
    return this.getCategories().map(data => {
      const categoryArray = new Array<Category>();
      const recursive = _categoryId => {
        for (const category of data) {
          if (category.Id === _categoryId) {
            if (!category.Fade_Out__c) categoryArray.unshift(category);
            if (category.Apttus_Config2__AncestorId__c)
              recursive(category.Apttus_Config2__AncestorId__c);
          }
        }
      };
      recursive(categoryId);
      return categoryArray;
    });
  }

  getCategoryBranchForProduct(product: Product): Observable<Array<Category>> {
    if (_.get(product, "Apttus_Config2__Categories__r.records[0]")) {
      const validCategories = product.Apttus_Config2__Categories__r.records.filter(
        r =>
          r.Apttus_Config2__ClassificationId__r
            .Apttus_Config2__PrimordialId__c != null ||
          r.Apttus_Config2__ClassificationId__r.Apttus_Config2__AncestorId__c !=
            null
      );
      if (validCategories && validCategories.length > 0) {
        const category: ProductCategory = validCategories[0];
        return this.getCategoryBranch(
          category.Apttus_Config2__ClassificationId__c
        );
      } else return Observable.of(null);
    } else return Observable.of(null);
  }

  getSubcategories(categoryId: string): Observable<Array<Category>> {
    return this.getCategories().map(data => {
      const categoryArray = new Array<Category>();
      for (const category of data) {
        if (
          category.Apttus_Config2__AncestorId__c &&
          category.Apttus_Config2__AncestorId__c.substring(0, 15) ===
            categoryId.substring(0, 15) &&
          !category.Fade_Out__c &&
          !(
            category.Apttus_Config2__ProductCount__c === 0 &&
            category.Apttus_Config2__IsLeaf__c.toLowerCase() === "yes"
          )
        )
          categoryArray.push(category);
      }
      return categoryArray;
    });
  }

  getRelatedCategories(categoryId: string): Observable<Array<Category>> {
    return this.getCategories().map(data => {
      let categoryArray = new Array<Category>();

      let ancestorId = null;
      for (const category of data) {
        if (category.Id === categoryId)
          ancestorId = category.Apttus_Config2__AncestorId__c;
      }

      for (const category of data) {
        if (
          category.Apttus_Config2__AncestorId__c &&
          ancestorId &&
          category.Apttus_Config2__AncestorId__c.substring(0, 15) ===
            ancestorId.substring(0, 15) &&
          !category.Fade_Out__c &&
          !(
            category.Apttus_Config2__ProductCount__c === 0 &&
            category.Apttus_Config2__IsLeaf__c.toLowerCase() === "yes"
          )
        )
          categoryArray.push(category);
      }
      categoryArray = categoryArray.sort((a, b) => {
        if (a.Name > b.Name) return 1;
        else if (a.Name < b.Name) return -1;
        else return 0;
      });

      return categoryArray.slice(0, 100);
    });
  }

  private translateCategories(
    locale: any,
    _categoryList: Array<Category>
  ): Array<Category> {
    const categoryList = _categoryList.map(x => Object.assign({}, x));
    for (const category of categoryList) {
      if (
        category &&
        category.Apttus_Config2__Translation__r &&
        category.Apttus_Config2__Translation__r.records
      ) {
        const translation: CategoryTranslation = category.Apttus_Config2__Translation__r.records.filter(
          (record: CategoryTranslation) => {
            if (record && record.Apttus_Config2__Language__c)
              return (
                record.Apttus_Config2__Language__c.toLowerCase() ===
                locale.pim.toLowerCase()
              );
            else return false;
          }
        )[0];

        if (translation)
          category.Apttus_Config2__Label__c =
            translation.Apttus_Config2__Label__c;
      }
    }
    return categoryList;
  }
}
