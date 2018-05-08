// import {Injectable} from '@angular/core';
// import {Observable} from 'rxjs/Rx';
// import {ForceService} from '../../utils/force.service';
// import {ProductTranslation} from './product-translation.model';
// import {UserService} from '../user/user.service';
//
// @Injectable()
// export class ProductTranslationService{
//
//   private productTranslationCache: any;
//   public fieldMapping: any = {
//     'APTSDMP_Ecomm_Frequency__c' : 'APTSDMP_Ecomm_Frequency__c'
//     ,'APTSDMP_Ecomm_Product_Description_1__c' : 'APTSDMP_Ecomm_Product_Description_1__c'
//     ,'APTSDMP_Ecomm_Product_Description_2__c' : 'APTSDMP_Ecomm_Product_Description_2__c'
//     ,'APTSDMP_Ecomm_Product_Description_3__c' : 'APTSDMP_Ecomm_Product_Description_3__c'
//     ,'APTSDMP_Ecomm_Product_Description_4__c' : 'APTSDMP_Ecomm_Product_Description_4__c'
//     ,'APTSDMP_Ecomm_Product_Description_5__c' : 'APTSDMP_Ecomm_Product_Description_5__c'
//     ,'APTSDMP_Ecomm_UoM__c' : 'Apttus_Config2__Uom__c'
//     ,'APTSMD_Long_Description__c' : 'APTSMD_Long_Description__c'
//     ,'Apttus_Config2__Description__c' : 'Description'
//     ,'Apttus_Config2__Family__c' : 'Family'
//     ,'Apttus_Config2__Name__c' : 'Name'
//     ,'Apttus_Config2__ProductCode__c' : 'ProductCode'
//   };
//
//   constructor(private forceService: ForceService, private userService: UserService, private productTranslation: ProductTranslation){}
//
//   get(priceListItemList: Array<any>){
//
//     return this.userService.get().flatMap(user => {
//       if(user.LanguageLocaleKey == 'en_US')
//         return Observable.of(priceListItemList);
//       else{
//         return this.productTranslation.get(`Apttus_Config2__ProductId__c IN (` + this.getPropertyArray(priceListItemList, 'Apttus_Config2__ProductId__c').join(', ') + `)`
//                                             + ` AND Apttus_Config2__Language__c = '` + user.LanguageLocaleKey + `'`)
//         .map(res => res.records)
//         .map(res => this.mapTranslationsToProducts(res, priceListItemList));
//       }
//     });
//   }
//
//   private mapTranslationsToProducts(productTranslations: Array<any>, priceListItems: Array<any>): Array<any>{
//     for(let translation of productTranslations){
//       for(let priceListItem of priceListItems){
//         if(translation.Apttus_Config2__ProductId__c == priceListItem.Apttus_Config2__ProductId__c){
//           for(let field of Object.keys(this.fieldMapping)){
//             if(translation[field])
//               priceListItem['Apttus_Config2__ProductId__r'][this.fieldMapping[field]] = translation[field];
//           }
//         }
//       }
//     }
//     return priceListItems;
//   }
//
//   private getPropertyArray(arrayList: Array<any>, property: string): Array<any>{
//     var vals=[];
//     for(var i=0;i<arrayList.length;i++){
//        vals.push('\'' + arrayList[i][property] + '\'');
//     }
//     return vals;
//   }
//
// }
