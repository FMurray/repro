import { Observable, BehaviorSubject } from "rxjs/Rx";
import { SObjectService } from "../../utils/sobject.model";
import { CartItemFactory, CartItem } from "./cart-item.model";

export class CartItemService extends SObjectService {
  type: CartItem = CartItemFactory(null);
}
