import { SObjectService } from "../../utils/sobject.model";
import { PriceRuleFactory, PriceRule } from "./price-rule.model";

export class PriceRuleService extends SObjectService {
  type: PriceRule = PriceRuleFactory();
  name = "price-rule";
}
