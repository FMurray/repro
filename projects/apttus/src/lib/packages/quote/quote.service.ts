import { SObjectService } from "../../utils/sobject.model";
import { QuoteFactory, Quote } from "./quote.model";

export class QuoteService extends SObjectService {
  name = "quote";
  type: Quote = QuoteFactory();
}
