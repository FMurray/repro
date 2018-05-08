import {SObjectService} from '../../utils/sobject.model';
import {Order, OrderFactory} from './order.model';
import {Observable} from 'rxjs/Rx';
import {UserService} from '../user/user.service';
import {PriceListService} from '../price-list/price-list.service';
import {AccountService} from '../account/account.service';
import {SoapService} from '../../utils/soap.service';
import {CartService} from '../cart/cart.service';
import {CartItem, CartItemFactory} from '../cart/cart-item.model';
import {Quote, QuoteFactory} from '../quote/quote.model';
import {QuoteService} from '../quote/quote.service';
import {OrderLineItem} from './order-line-item.model';

export class OrderService extends SObjectService{
	type = OrderFactory();

	public getMyOrders(accountId: string = null, days: number = 30){
		let userService =  new UserService(this.forceService, this.http, this.configService, this.cacheService);
		return userService.me().flatMap(u => this._queryBuilder(`OwnerId = '` + u.Id + `'`
																+ ((accountId) ? ` AND Apttus_Config2__BillToAccountId__c = '` + accountId + `'` : ``)
																+ ((days) ? ` AND CreatedDate = LAST_N_DAYS:` + days : ``)
																, null
																, null
																, 'CreatedDate'
																, 'DESC'
																, false
																, null));
	}

	public convertCartToOrder(order: Order = OrderFactory(), quote: Quote = QuoteFactory()): Observable<Order>{
	    let cartService = new CartService(this.forceService, this.http, this.configService, this.cacheService);
	    let plService = new PriceListService(this.forceService, this.http, this.configService, this.cacheService);
	    let accountService = new AccountService(this.forceService, this.http, this.configService, this.cacheService);
	    let userService = new UserService(this.forceService, this.http, this.configService, this.cacheService);
	    let quoteService = new QuoteService(this.forceService, this.http, this.configService, this.cacheService);
	    let soap = new SoapService(this.http, this.forceService);


	    return Observable.combineLatest(plService.getEffectivePriceListId(), accountService.getCurrentAccount(), userService.me(), cartService.getMyCart())
	    .take(1)
	    .flatMap(([priceListId, account, user, cart]) => {
	        order.Apttus_Config2__PriceListId__c = priceListId,
	        order.Apttus_Config2__ShipToAccountId__c = account.Id;
	        order.Apttus_Config2__BillToAccountId__c = account.Id;
	        order.Apttus_Config2__PrimaryContactId__c = user.ContactId;
	        order.Apttus_Config2__SoldToAccountId__c = account.Id;
	        this.type = order;

	        quote.Apttus_Proposal__Account__c = account.Id;
	        quote.Apttus_Proposal__Proposal_Name__c = account.Name + ':' + user.LastName;
	        quote.Apttus_QPConfig__AutoActivateOrder__c = true;
	        quote.Apttus_QPConfig__BillToAccountId__c = account.Id;
	        quote.Apttus_QPConfig__ShipToAccountId__c = account.Id;
	        return quoteService.create([quote], null)
	        		.map(res => res[0])
	        	   	.flatMap(quoteId => {
	        	   		order.Apttus_QPConfig__ProposalId__c = quoteId;
	        	   		return this.create([order], null).map(res => res[0])
	        	   			.flatMap(orderId => {
			        	   		cart.Apttus_Config2__OrderId__c = orderId;
				        		cart.Apttus_QPConfig__Proposald__c = quoteId;
				        		cart.Apttus_Config2__Status__c = 'Finalized';
				        		cart.Apttus_Config2__BusinessObjectId__c = quoteId;
				        		cart.Apttus_Config2__BusinessObjectRefId__c = quoteId;
				        		cart.Apttus_Config2__BusinessObjectType__c = 'Proposal';

								return cartService.update([cart])
									.flatMap(() => this.forceService.post("/guest/placeOrder", {cartId : cart.Id, orderId : orderId}))
				        				// .flatMap(() => soap.doRequest('Apttus_Config2/OrderWebService', 'synchronizeCart', {request : {'CartId' : cart.Id}}))
				        				// .flatMap(() => Observable.zip(
				        				// 	soap.doRequest('Apttus_CPQApi/CPQWebService', 'synchronizeCart', {request : {'CartId' : cart.Id}}),
				        				// 	soap.doRequest('Apttus_Config2/OrderWebService', 'acceptOrder', {request : {'OrderId' : orderId}}),
				        				// 	this.cacheService.update('cart')
										// ))
									.flatMap(() => Observable.zip(
										this.cacheService.update('cart'),
										this.get([orderId], orderId)
									)).map(res => res[1][0]);
		        	   		})
	        	   	})
	    })

	    //TODO: Invalidate order history cache
	 }

	 mergeCartItems(orderItemList: Array<OrderLineItem>): Observable<void>{
	    let soap = new SoapService(this.http, this.forceService);
	    let plService = new PriceListService(this.forceService, this.http, this.configService, this.cacheService);
	    let itemService = new SObjectService(this.forceService, this.http, this.configService, this.cacheService);
	    let cartService = new CartService(this.forceService, this.http, this.configService, this.cacheService);

	    return cartService.getMyCart().take(1).flatMap(cart => plService.getPriceListId().flatMap(priceListId => {
	      itemService.type = CartItemFactory(priceListId);

	      let cartItemInsertList: Array<CartItem> = [];
	      let cartItemUpdateList: Array<CartItem> = [];

	      for(let oldCartItem of orderItemList){
	        let cartItem = CartItemFactory(priceListId);
	        if(cart.Apttus_Config2__LineItems__r && cart.Apttus_Config2__LineItems__r.records){
	          let currentCartItem = cart.Apttus_Config2__LineItems__r.records.filter(item => item.Apttus_Config2__ProductId__c == oldCartItem.Apttus_Config2__ProductId__c)[0]; 
	          if(currentCartItem){
	            cartItem.Id = currentCartItem.Id;
	            cartItem.Apttus_Config2__Quantity__c = currentCartItem.Apttus_Config2__Quantity__c;
	            cartItemUpdateList.push(cartItem);
	          }
	      	}

	      	if(!cartItem.Id){
	            cartItem.Apttus_Config2__ProductId__c = oldCartItem.Apttus_Config2__ProductId__c;
	            cartItem.Apttus_Config2__PriceListId__c = priceListId;
	            cartItem.Apttus_Config2__ItemSequence__c = cart.Apttus_Config2__NumberOfItems__c + 1;
	            cartItem.Apttus_Config2__LineNumber__c = cart.Apttus_Config2__NumberOfItems__c + 1;
	            cartItem.Apttus_Config2__PrimaryLineNumber__c = cart.Apttus_Config2__NumberOfItems__c + 1;
	            cartItem.Apttus_Config2__ConfigurationId__c = cart.Id;
	            cartItemInsertList.push(cartItem);
	        }
	        cartItem.Apttus_Config2__Quantity__c += oldCartItem.Apttus_Config2__Quantity__c;
	      }

	      return Observable.if(() => cartItemUpdateList.length > 0, itemService.update(cartItemUpdateList), Observable.of(null))
	                        .flatMap(() => Observable.if(() => cartItemInsertList.length > 0, itemService.create(cartItemInsertList, null), Observable.of(null)))

	    }).flatMap(() => soap.doRequest('Apttus_CPQApi/CPQWebService', 'updatePriceForCart', {request : {'CartId' : cart.Id}})))
	      .flatMap(res => this.cacheService.update('cart'));
	  }

}