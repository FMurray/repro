import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { isNumeric } from "rxjs/util/isNumeric";
import { ForceService } from "./force.service";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "../packages/config/index";
import { CacheService } from "./cache.service";

export class SObjectImpl implements SObject {
  public Id: string = null;
  public CreatedDate: Date = null;
  public CreatedById: string = null;
  public LastModifiedDate: Date = null;
  public LastModifiedById: string = null;
  public records: Array<any> = null;
  public _type: string = null; //TODO: Move to custom decorator
  public _constraint: string = null;
  public _order: string = null;
}

export interface SObject extends SObjectImpl {
  Id: string;
  CreatedDate: Date;
  CreatedById: string;
  LastModifiedDate: Date;
  LastModifiedById: string;
  _type: string;
  _constraint: string;
  _order: string;
}

export interface ChildRecord {
  done: boolean;
  records: Array<any>;
  totalSize: number;
  _constraint: string;
}

@Injectable()
export class SObjectService {
  public type: any;
  public name?: string;
  public read?: Array<string> = [];

  private static defaultFields: Array<string> = [
    "Id",
    "CreatedDate",
    "CreatedById",
    "LastModifiedDate",
    "LastModifiedById"
  ];

  private get sobject(): string {
    return this.type._type;
  }

  constructor(
    public forceService: ForceService,
    public http: HttpClient,
    public configService: ConfigService,
    public cacheService: CacheService
  ) {}
  public onInit() {}

  public set customFields(fields: Array<string>) {
    this.cacheService._set(this.sobject + ":customFields", fields);
  }

  public get customFields() {
    return this.getCustomFieldsForObject(this.sobject);
  }

  public describe(field?: string, picklist: boolean = false): Observable<any> {
    let obj = { object: this.sobject, field: field, picklist: picklist };
    return this.cacheService.get("describe:" + JSON.stringify(obj), () =>
      this.forceService.post("/guest/describe", obj)
    );
  }

  public aggregate(clause: string): Observable<Array<any>> {
    return this.forceService.query(
      `SELECT ` +
        SObjectService.getAggregateFields(this.type, null).join(", ") +
        " FROM " +
        this.sobject +
        " WHERE " +
        clause
    );
  }

  public _where(clause: string): Observable<Array<any>> {
    return this.queryBuilder(clause, null, null, null, null, false);
  }

  public where(clause: string, cacheKey: string): Observable<Array<any>> {
    if (cacheKey) {
      return this.cacheService
        .get(cacheKey, () => this._where(clause))
        .filter(res => res != null);
    } else return this._where(clause);
  }

  public _search(query: string): Observable<any> {
    return this.cacheService
      .get(query, () => this.forceService.search(query))
      .filter(res => res != null);
  }

  public search(queryString: string): Observable<Array<string>> {
    return this.cacheService.get(queryString, () =>
      this.forceService
        .search(
          `FIND {*` + queryString + `*} IN ALL FIELDS RETURNING ` + this.sobject
        )
        .map(res => SObjectService.toIdArray(res[0]))
        .flatMap(_idArray => this.get(_idArray, null))
    );
  }

  public get(ids: Array<string>, cacheKey: string): Observable<Array<any>> {
    if (!ids || ids.length == 0 || !ids[0]) ids[0] = "";
    return this.where(
      "ID IN (" + SObjectService.arrayToCsv(ids) + ")",
      cacheKey
    );
  }

  public create(
    recordList: Array<SObject>,
    cacheKey
  ): Observable<Array<string>> {
    if (cacheKey) {
      return this.cacheService.get(cacheKey, () =>
        this.forceService
          .create(this.sobject, SObjectService.toJSON(recordList))
          .map((res: Array<any>) => SObjectService.toIdArray(res))
      );
    } else
      return this.forceService
        .create(this.sobject, SObjectService.toJSON(recordList))
        .map((res: Array<any>) => SObjectService.toIdArray(res));
  }

  public update(_recordList: Array<SObject>): Observable<Array<string>> {
    let recordList = _recordList.map(x => Object.assign({}, x));
    for (let field of SObjectService.defaultFields.concat(this.read)) {
      for (let record of recordList) {
        if (field.toLowerCase() != "id") delete record[field];
      }
    }
    return this.forceService
      .update(this.sobject, SObjectService.toJSON(recordList))
      .map((res: Array<any>) => SObjectService.toIdArray(res));
  }

  public upsert(recordList: Array<SObject>): Observable<Array<string>> {
    return this.forceService
      .upsert(this.sobject, SObjectService.toJSON(recordList))
      .map((res: Array<any>) => SObjectService.toIdArray(res));
  }

  public delete(recordList: Array<SObject>): Observable<Array<boolean>> {
    return this.forceService
      .remove(this.sobject, SObjectService.toJSON(recordList))
      .map((res: Array<any>) => {
        let _boolArray = new Array<boolean>();
        for (let response of res) {
          _boolArray.push(response.success);
        }
        return _boolArray;
      });
  }

  public static toIdArray(records: Array<any>): Array<string> {
    if (!records || records.length == 0) return null;
    else {
      let _idArray = new Array<string>();
      for (let record of records) {
        if (record.id) _idArray.push(record.id);
        else if (record.Id) _idArray.push(record.Id);
      }
      return _idArray;
    }
  }

  public static toPropertyArray(
    records: Array<any>,
    property: string
  ): Array<string> {
    let _resolve = function(path, obj) {
      return path.split(".").reduce(function(prev, curr) {
        return prev ? prev[curr] : undefined;
      }, obj || self);
    };

    let _idArray = new Array<string>();
    for (let record of records) {
      if (_resolve(property, record)) _idArray.push(_resolve(property, record));
    }
    return _idArray;
  }

  public static arrayToCsv(idArray: Array<string>): string {
    if (!idArray || idArray.length == 0) return null;
    else {
      let result = ``;
      for (let key of idArray) {
        result += `'` + key + `', `;
      }
      if (result.indexOf(", ") > -1)
        result = result.substring(0, result.lastIndexOf(", "));

      return result;
    }
  }

  public _queryBuilder(
    clause: string,
    limit: number,
    offset: number,
    orderBy: string,
    orderDirection: string,
    images: boolean,
    cacheKey: string
  ): Observable<any> {
    if (cacheKey)
      return this.cacheService.get(cacheKey, () =>
        this.queryBuilder(
          clause,
          limit,
          offset,
          orderBy,
          orderDirection,
          images
        )
      );
    else
      return this.queryBuilder(
        clause,
        limit,
        offset,
        orderBy,
        orderDirection,
        images
      );
  }

  public queryBuilder(
    clause: string,
    limit: number,
    offset: number,
    orderBy: string,
    orderDirection: string,
    images: boolean
  ): Observable<any> {
    if (orderBy && !orderDirection) orderDirection = "ASC";

    if (this.type._constraint)
      clause = clause
        ? clause + " AND " + this.type._constraint
        : this.type._constraint;

    let query: string =
      this.selectAllQuery() +
      (clause ? ` WHERE ` + clause : "") +
      (orderBy ? ` ORDER BY ` + orderBy : "") +
      (orderDirection ? ` ` + orderDirection : "") +
      (limit ? ` LIMIT ` + limit : "") +
      (offset ? " OFFSET " + offset : "");
    if (!images) return this.forceService.query(query);
    else return this.forceService.post("/guest/imageQuery", { q: query });
  }

  public selectAllQuery(): string {
    let queryFields: Array<string> = this.getFields(this.type, null);
    queryFields = queryFields.concat(SObjectService.defaultFields);
    let str = `SELECT `;
    str += queryFields.join(", ");
    str += ` FROM ` + this.sobject;

    return str;
  }

  private static getAggregateFields(type: any, prefix: string): Array<string> {
    let keys = Reflect.ownKeys(type);
    let fieldArray: Array<string> = !prefix ? ["COUNT(Id) total_records"] : [];

    for (let key of keys) {
      let propertyName = prefix ? prefix + "." + <string>key : <string>key;
      let alias = prefix ? prefix + "_" + <string>key : <string>key;
      if (isNumeric(type[key])) {
        fieldArray.push("MAX(" + propertyName + ") max_" + alias);
        fieldArray.push("MIN(" + propertyName + ") min_" + alias);
      } else if (
        type[key] &&
        typeof type[key] === "object" &&
        !type[key].records
      ) {
        fieldArray = fieldArray.concat(
          SObjectService.getAggregateFields(type[key], <string>key)
        );
      }
    }
    return fieldArray;
  }

  public static toJSON(recordList: Array<SObject>): any {
    let _dataArray: Array<any> = new Array<any>();
    for (let record of recordList) {
      let _obj = {};
      for (let field of SObjectService.defaultFields) {
        _obj[field] = record[field];
      }
      for (let field of <Array<string>>Reflect.ownKeys(record)) {
        if (
          (<string>field).charAt(0) == "_" ||
          typeof record[field] === "object"
        )
          continue;
        _obj[field] = record[field];
      }
      _dataArray.push(Object.assign({}, _obj));
    }
    return _dataArray;
  }

  private getFields(
    instance: any,
    prefix: string,
    depth: number = 0
  ): Array<string> {
    let keys = Reflect.ownKeys(instance);
    let fieldArray: Array<string> = new Array<string>();

    for (let key of keys) {
      if ((<string>key).charAt(0) == "_") continue;

      if (instance[key] && typeof instance[key] === "object") {
        if (instance[key].records && !prefix) {
          fieldArray.push(
            this.getChildFields(
              instance[key].records[0],
              <string>key,
              instance[key]["_constraint"]
            )
          );
        } else if (!instance[key].records) {
          let newPrefix = prefix ? prefix + "." + <string>key : <string>key;
          if (depth < 5) {
            fieldArray = fieldArray.concat(
              this.getFields(instance[key], newPrefix, depth + 1)
            );
          } else {
            console.debug("ignored " + newPrefix + "." + <string>key);
            continue;
          }
        }
      } else if (prefix) fieldArray.push(prefix + "." + <string>key);
      else fieldArray.push(<string>key);
    }
    if (this.getCustomFieldsForObject(instance._type)) {
      this.getCustomFieldsForObject(instance._type).forEach(
        field =>
          prefix
            ? fieldArray.push(prefix + "." + field)
            : fieldArray.push(field)
      );
    }

    return Array.from(new Set(fieldArray));
  }

  private getChildFields(
    type: any,
    name: string,
    constraint: string,
    customFields?: Array<string>
  ): string {
    let str = `(SELECT `;
    let fieldArray = this.getFields(type, null);
    if (type._defaults != false)
      fieldArray = fieldArray.concat(SObjectService.defaultFields);
    fieldArray = fieldArray.filter(e => e.charAt(0) != "_");

    str += fieldArray.join(", ");
    str += ` FROM ` + name;
    if (constraint) str += " " + constraint;
    if (type["_order"]) str += " " + type["_order"];

    str += `)`;
    return str;
  }

  private getCustomFieldsForObject(obj: string) {
    return this.cacheService._get(obj + ":customFields");
  }
}
