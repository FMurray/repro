import { NgModule } from "@angular/core";

import {
  ContactService,
  UserService,
  StorefrontService,
  AccountService,
  AdminService,
  ProductService,
  PriceListService,
  CategoryService,
  PromotionService,
  CartService,
  SearchService,
  ConversionService,
  EmailService,
  OrderService,
  QuoteService,
  AccountLocationService,
  ProductAttributeService,
  ShippingOptionService,
  OrderProductAttributeService
} from ".";
import { ForceService } from "../utils/force.service";
import { SoapService } from "../utils/soap.service";
import { HerokuService } from "../utils/heroku.service";
import { CacheService } from "../utils/cache.service";
import { ApiConfig, ConfigService } from "../packages/config/index";

const services = [
  UserService,
  ForceService,
  SoapService,
  HerokuService,
  StorefrontService,
  AccountService,
  ConfigService,
  ContactService,
  AdminService,
  ProductService,
  PriceListService,
  CategoryService,
  CacheService,
  PromotionService,
  CartService,
  SearchService,
  ConversionService,
  EmailService,
  OrderService,
  QuoteService,
  AccountLocationService,
  ProductAttributeService,
  ShippingOptionService,
  OrderProductAttributeService
];

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [services]
})
export class ServiceModule {}
