import { PriceListService } from "../price-list/price-list.service";
import { PriceList } from "../price-list/price-list.model";
import { PriceListItem } from "../price-list/price-list-item.model";
import { Product, ProductFactory } from "../product/product.model";
import { Cart, CartFactory, CartProductForm } from "./cart.model";
import {
  CartItem,
  CartItemFactory,
  CartItemChildFactory
} from "./cart-item.model";
import { CartItemService } from "./cart-item.service";
import { Observable, BehaviorSubject } from "rxjs/Rx";
import { UserService } from "../user/user.service";
import { UserFactorySmall } from "../user/user.model";
import { SObjectService, ChildRecord } from "../../utils/sobject.model";
import { SoapService } from "../../utils/soap.service";
import { AccountService } from "../account/account.service";
import {
  ProductAttributeValue,
  ProductAttributeValueFactory
} from "../product-attribute/product-attribute-value.model";
import { ProductService } from "../product/product.service";

import * as _ from "lodash";

export class CartService extends SObjectService {
  name = "cart";
  read = ["Total_Number_of_Items__c", "Apttus_Config2__NumberOfItems__c"];
  type = CartFactory();
  public user;

  getMyCart(): Observable<Cart> {
    return this.cacheService
      .get("cart", () => this.loadCart())
      .filter(res => res !== null && res !== undefined);
  }

  private loadCart(): Observable<Cart> {
    let userService = new UserService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );
    let plService = new PriceListService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );
    let accountService = new AccountService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );
    let cartService = new AccountService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );

    let cartData = null;

    return Observable.combineLatest(
      userService.me(),
      accountService.getCurrentAccount(),
      plService.getEffectivePriceListId(),
      plService.getPriceListId()
    )
      .distinctUntilChanged()
      .debounceTime(500)
      .filter(
        res =>
          res != null &&
          res.length == 4 &&
          res[0] != null &&
          res[1] != null &&
          res[2] != null &&
          res[3] != null &&
          (res[1].Price_List__c == null || res[1].Price_List__c == res[2]) &&
          (res[0].Contact
            ? res[0].Contact.AccountId == res[1].Id ||
              res[0].Contact.AccountId == res[1].ParentId
            : true)
      )
      .flatMap(([user, account, epli, pli]) => {
        let smallUser = UserFactorySmall();
        smallUser.Alias = user.Alias;
        cartData = Object.assign(
          this.type,
          CartFactory(pli, epli, account.Id, smallUser)
        );
        let key = user.Id + ":" + account.Id + ":" + pli + ":" + epli;
        if (user.Id && account.Id && pli && epli) {
          return this.syncLocalCartWithUser().flatMap(() =>
            this._queryBuilder(
              `OwnerId = '` +
                user.Id +
                `' AND Apttus_Config2__AccountId__c = '` +
                account.Id +
                `' AND Apttus_Config2__PriceListId__c = '` +
                pli +
                `' AND Apttus_Config2__EffectivePriceListId__c = '` +
                epli +
                `' AND Apttus_Config2__Status__c = 'New'`,
              1,
              0,
              "CreatedDate",
              "DESC",
              false,
              null
            )
          );
        } else if (pli && epli && this.cacheService._get("local-cart")) {
          return this._queryBuilder(
            `Id = '` +
              this.cacheService._get("local-cart") +
              `' AND Apttus_Config2__PriceListId__c = '` +
              pli +
              `' AND Apttus_Config2__EffectivePriceListId__c = '` +
              epli +
              `' AND Apttus_Config2__Status__c = 'New'`,
            1,
            0,
            "CreatedDate",
            "DESC",
            false,
            null
          );
        }

        //Return null if neither
        else return Observable.of(null);
      })
      .flatMap((cartList: Array<Cart>) => {
        if ((cartList == null || cartList.length == 0) && cartData) {
          let key =
            "cart:create" +
            cartData.Apttus_Config2__AccountId__c +
            ":" +
            cartData.Apttus_Config2__PriceListId__c +
            ":" +
            cartData.Apttus_Config2__EffectivePriceListId__c +
            ":" +
            cartData.OwnerId;
          return this.create([cartData], null)
            .flatMap(res => {
              if (cartData.Owner.Alias === "guest")
                this.cacheService._set("local-cart", res[0], true);

              return this.get([res[0]], res[0]);
            })
            .map(res => res[0]);
        } else if (cartList) return Observable.of(cartList[0]);
        else return Observable.of(cartData);
      });
  }

  public syncLocalCartWithUser(): Observable<void> {
    if (this.cacheService._get("local-cart")) {
      let userService = new UserService(
        this.forceService,
        this.http,
        this.configService,
        this.cacheService
      );
      let plService = new PriceListService(
        this.forceService,
        this.http,
        this.configService,
        this.cacheService
      );
      let accountService = new AccountService(
        this.forceService,
        this.http,
        this.configService,
        this.cacheService
      );
      return Observable.combineLatest(
        userService.me().take(1),
        plService.getPriceListId().take(1),
        plService.getEffectivePriceListId().take(1),
        accountService.getCurrentAccount().take(1)
      ).flatMap(([user, plId, eplId, account]) => {
        if (user.Id && plId && eplId && account.Id)
          return this.forceService
            .post("/guest/setCartOwner", {
              cartId: this.cacheService._get("local-cart"),
              userId: user.Id,
              priceListId: plId,
              accountId: account.Id,
              effectivePriceListId: eplId
            })
            .catch(e => {
              return Observable.of(null);
            })
            .map(res => {
              if (res) this.cacheService.clearKey("local-cart");
            });
        else return Observable.of(null);
      });
    } else {
      return Observable.of(null);
    }
  }

  public bulkAddProductToCart(
    productFormList: Array<CartProductForm>,
    quick: boolean = false,
    timeout: number = 60000
  ) {
    // Get list of products
    const productService = new ProductService(
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
    const productCodes = ProductService.arrayToCsv(
      productFormList.map(p => p.productCode)
    );
    const itemService = new CartItemService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );

    return Observable.combineLatest(
      this.getMyCart().take(1),
      productService.getProductByCode(productFormList.map(p => p.productCode))
    )
      .filter(
        ([cart, productList]) =>
          cart._state !== "calculating" && productList != null && cart != null
      )
      .flatMap(([cart, productList]) =>
        plService.getPriceListId().flatMap(priceListId => {
          const availableProducts =
            productList != null && productList.length > 0
              ? productList.map(p => p.entity.ProductCode)
              : [];
          const unavailableProducts = [];
          productList.forEach(product => {
            if (!this.canOrder(product.entity)) {
              unavailableProducts.push(product.entity.ProductCode);
            }
          });
          productFormList.forEach(productForm => {
            if (
              productForm.productCode.match(/xpert/gi) ||
              !_.includes(availableProducts, productForm.productCode) ||
              !productForm.quantity ||
              productForm.quantity <= 0
            )
              unavailableProducts.push(productForm.productCode);
          });
          if (unavailableProducts.length > 0)
            return Observable.throw(
              new Error(JSON.stringify(unavailableProducts))
            );
          else {
            productService.type = ProductFactory(priceListId);
            const insertList = [];
            const updateList = [];
            productList.forEach(product => {
              const form: CartProductForm = productFormList.filter(
                p => p.productCode === product.entity.ProductCode
              )[0];
              const cartItem = this.getCartItem(
                product.entity,
                form.quantity,
                cart,
                true,
                priceListId
              );
              if (cartItem.Id) updateList.push(cartItem);
              else insertList.push(cartItem);
            });
            return Observable.combineLatest(
              itemService.update(updateList),
              itemService.create(insertList, null)
            )
              .map(([a, b]) => _.union(a, b))
              .flatMap(cartItemIdList => {
                if (quick) {
                  this.priceCart(cartItemIdList, timeout).subscribe(() => {});
                  return Observable.of(availableProducts);
                } else
                  return this.priceCart(cartItemIdList, timeout).flatMap(res =>
                    Observable.of(availableProducts)
                  );
              });
          }
        })
      );
  }

  /**
   * addProductToCart:   Method takes a product and a quantity and updates the cart
   * @param product      Product object for method
   * @param quantity     number value for quantity
   * @return Observable  Returns an empty observable when complete
   */
  public addProductToCart(
    product: Product,
    quantity: number,
    merge: boolean = true,
    attributeValues?: Array<ProductAttributeValue>,
    quick: boolean = false,
    timeout: number = 60000
  ): Observable<void> {
    if (quantity <= 0)
      return Observable.throw("Cannot add a quantity less than 1");
    else if (
      _.get(
        product,
        "Apttus_Config2__PriceLists__r.records[0].Apttus_Config2__ExpirationDate__c"
      ) != null &&
      _.get(
        product,
        "Apttus_Config2__PriceLists__r.records[0].Apttus_Config2__ExpirationDate__c"
      ) <= new Date()
    )
      return Observable.throw("Invalid Price List");

    let plService = new PriceListService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );
    let itemService = new CartItemService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );
    let attrValueService = new SObjectService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );
    attrValueService.type = ProductAttributeValueFactory();
    return this.getMyCart()
      .filter(cart => cart._state !== "calculating")
      .take(1)
      .flatMap(cart =>
        plService
          .getPriceListId()
          .flatMap(priceListId => {
            const cartItem = this.getCartItem(
              product,
              quantity,
              cart,
              merge,
              priceListId
            );
            if (cartItem.Id) return itemService.update([cartItem]);
            else return itemService.create([cartItem], null);
          })
          .flatMap((res: Array<string>) => {
            if (attributeValues && attributeValues.length > 0) {
              attributeValues.forEach(
                attr => (attr.Apttus_Config2__LineItemId__c = res[0])
              );
              return attrValueService
                .create(attributeValues, null)
                .map(attrs => res[0]);
            } else return Observable.of(res[0]);
          })
          .flatMap(cartItemId => {
            if (quick) {
              this.priceCart([cartItemId], timeout).subscribe(() => {});
              return Observable.of(null);
            } else return this.priceCart([cartItemId], timeout);
          })
      );
  }

  public apttusAddProductToCart(
    product: Product,
    quantity: number,
    merge: boolean = true,
    attributeValues?: Array<ProductAttributeValue>
  ): Observable<void> {
    let soap = new SoapService(this.http, this.forceService);
    return this.getMyCart()
      .take(1)
      .flatMap(cart =>
        soap.doRequest("Apttus_CPQApi/CPQWebService", "addMultiProducts", {
          request: {
            CartId: cart.Id,
            SelectedProducts: [
              {
                ProductID: product.Id,
                Quantity: quantity,
                SellingTerm: 12,
                StartDate: new Date().toISOString(),
                EndDate: new Date().toISOString(),
                Comments: "Added by SV API"
              }
            ]
          }
        })
      )
      .flatMap(res => this.cacheService.update("cart"));
  }

  public updateQuantity(cartItemList: Array<CartItem>): Observable<void> {
    let itemService = new CartItemService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );
    itemService.type = CartItemChildFactory(null);

    let _temp = new Array<CartItem>();
    cartItemList.forEach(item => {
      let newItem = CartItemChildFactory(null);
      newItem.Apttus_Config2__Quantity__c = item.Apttus_Config2__Quantity__c;
      newItem.Apttus_Config2__PricingStatus__c = "Pending";
      newItem.Id = item.Id;
      _temp.push(newItem);
    });

    return itemService.update(_temp).flatMap(() => this.priceCart());
  }

  public removeCartItem(
    _cartItem: CartItem,
    quick: boolean = false
  ): Observable<void> {
    let soap = new SoapService(this.http, this.forceService);
    let plService = new PriceListService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );
    let itemService = new CartItemService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );
    return this.getMyCart()
      .take(1)
      .flatMap(cart =>
        plService.getPriceListId().flatMap(priceListId => {
          itemService.type = CartItemFactory(priceListId);

          return itemService.delete([_cartItem]).flatMap(() => {
            if (quick) {
              let idx = _.findIndex(
                cart.Apttus_Config2__LineItems__r.records,
                r => r.Id == _cartItem.Id
              );
              cart.Apttus_Config2__LineItems__r.records.splice(idx, 1);
              this.priceCart().subscribe(() => {});
              return Observable.of(null);
            } else return this.priceCart();
          });
        })
      );
  }

  public priceCart(
    cartItemIdList: Array<string> = null,
    timeout: number = 10000
  ): Observable<void> {
    let soap = new SoapService(this.http, this.forceService);
    let itemService = new CartItemService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );
    return this.getMyCart()
      .take(1)
      .flatMap(cart => {
        cart._state = "calculating";
        this.cacheService.republish("cart", Object.assign({}, cart));
        return soap
          .doRequest("Apttus_CPQApi/CPQWebService", "updatePriceForCart", {
            request: { CartId: cart.Id }
          })
          .timeout(timeout)
          .catch(e => {
            if (cartItemIdList) {
              const objArray = [];
              cartItemIdList.forEach(id => {
                const c = CartItemChildFactory(null);
                c.Id = id;
                objArray.push(c);
              });
              return itemService.delete(objArray);
            } else return Observable.of(null);
          })
          .flatMap(res => this.cacheService.update("cart"));
      });
  }

  private getCartItem(
    product: Product,
    quantity: number,
    cart: Cart,
    merge: boolean,
    priceListId: string
  ) {
    let cartItem: CartItem = CartItemFactory(priceListId);

    let idx;
    let temp;
    if (_.get(cart, "Apttus_Config2__LineItems__r.records")) {
      idx = _.findIndex(
        cart.Apttus_Config2__LineItems__r.records,
        r => r.Apttus_Config2__ProductId__c == product.Id
      );
      temp = cart.Apttus_Config2__LineItems__r.records[idx];
    }

    cartItem.Apttus_Config2__ProductId__r = product;
    cartItem.Apttus_Config2__ProductId__c = product.Id;
    cartItem.Apttus_Config2__PriceListId__c = priceListId;
    cartItem.Apttus_Config2__ListPrice__c = -1;

    if (temp && merge) {
      cartItem.Id = temp.Id;
      cartItem.Apttus_Config2__Quantity__c =
        temp.Apttus_Config2__Quantity__c + quantity;
      if (_.get(cart, "Apttus_Config2__LineItems__r.records"))
        cart.Apttus_Config2__LineItems__r.records.splice(idx, 1, cartItem);
      else
        cart.Apttus_Config2__LineItems__r = {
          records: [cartItem]
        } as ChildRecord;
      return cartItem;
    } else {
      cartItem.Apttus_Config2__ItemSequence__c =
        cart.Apttus_Config2__NumberOfItems__c + 1;
      cartItem.Apttus_Config2__LineNumber__c =
        cart.Apttus_Config2__NumberOfItems__c + 1;
      cartItem.Apttus_Config2__PrimaryLineNumber__c =
        cart.Apttus_Config2__NumberOfItems__c + 1;
      cartItem.Apttus_Config2__ConfigurationId__c = cart.Id;
      cartItem.Apttus_Config2__Quantity__c = quantity;
      if (_.get(cart, "Apttus_Config2__LineItems__r.records"))
        cart.Apttus_Config2__LineItems__r.records.push(cartItem);
      else
        cart.Apttus_Config2__LineItems__r = {
          records: [cartItem]
        } as ChildRecord;
      return cartItem;
    }
  }
  canOrder(product: Product) {
    let userService = new UserService(
      this.forceService,
      this.http,
      this.configService,
      this.cacheService
    );
    const hasPli = _.get(product, "Apttus_Config2__PriceLists__r", false);
    let ss,
      permissionSets = true;
    userService.me().subscribe(user => (this.user = user));
    if (this.user) {
      ss = this.user.PermissionSetAssignments.records.filter(
        r => r.PermissionSet.Name === "KUKA_Marketplace_Superuser"
      );
      permissionSets = (ss && ss.length > 0) || this.user.Alias === "guest";
    }

    const oU = _.get(product, "APTSSP_Available_to_order_until__c");
    const orderUntil = oU == null || new Date(oU.toString()) >= new Date();

    const isSoftware: boolean =
      _.get(product, "Product_Category__c") === "Software";

    const w = <number>_.get(product, "APTSS_Product_Weight__c");
    const weight = (w !== 0 && !isNaN(w)) || isSoftware === true;

    const isOrderable = _.get(product, "APTSSP_Is_orderable__c") !== "No";

    // if there are constraints this should return true
    const noConstraints: boolean = !_.get(
      product,
      "Apttus_Config2__ConstraintRuleConditions__r.records",
      false
    );

    const isActive = <boolean>_.get(
      product,
      "Apttus_Config2__PriceLists__r.records[0].Apttus_Config2__Active__c",
      false
    );
    console.debug(
      "hasPli, weight, noConstraints, permissionSets, isOrderable, orderUntil, isActive: ",
      hasPli,
      weight,
      noConstraints,
      permissionSets,
      isOrderable,
      orderUntil,
      isActive
    );

    return (
      hasPli &&
      (weight || isSoftware) &&
      noConstraints &&
      permissionSets &&
      isOrderable &&
      orderUntil &&
      isActive
    );
  }
}
