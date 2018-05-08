import { Observable, BehaviorSubject } from "rxjs/Rx";
import { SObjectService } from "../../utils/sobject.model";
import { User, UserFactory } from "./user.model";
import { ConfigService } from "../config";
import { LOCALE, getLocale, locale } from "../conversion/conversion.model";
import { countries } from "country-data";
import * as countryData from "country-data";
import { EventEmitter } from "@angular/core";

export class UserService extends SObjectService {
  public type: any = UserFactory();
  public read = ["LastLoginDate", "ContactId"];
  public userUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
  private _user: BehaviorSubject<User>;
  name: "user";

  public getCurrentUser(): Observable<User> {
    return this.forceService
      .identity()
      .flatMap(identity => {
        if (identity && identity.user_id)
          return this.get([identity.user_id], null);
        else return Observable.of([]);
      })
      .flatMap((_users: Array<User>) => {
        if (_users && _users.length > 0) return Observable.of(_users[0]);
        else return this.initializeGuestUser();
      })
      .map(user => {
        let currentLocale = this.cacheService._get("locale");
        if (currentLocale && currentLocale.base) {
          user.DefaultCurrencyIsoCode = currentLocale.currency;
          user.LocaleSidKey = currentLocale.base;
          user.LanguageLocaleKey = currentLocale.base;
        }
        return user;
      })
      .catch(e => {
        if (e.name == "INVALID_SESSION_ID") return this.initializeGuestUser();
        else return Observable.throw(e);
      });
  }

  public me(): Observable<User> {
    return this.cacheService
      .get("user", () => this.getCurrentUser())
      .filter(u => u != null);
  }

  public isGuest(): Observable<boolean> {
    return this.me()
      .take(1)
      .map(u => u.Alias == "guest");
  }

  public initializeGuestUser(): Observable<User> {
    let u: User = UserFactory();
    let userLang = "de";
    if (navigator.language) userLang = navigator.language;

    u.CountryCode = "DE";
    u.DefaultCurrencyIsoCode = getLocale(userLang, "normal").currency;
    u.LanguageLocaleKey = getLocale(userLang, "normal").base;
    u.LocaleSidKey = u.LanguageLocaleKey;
    u.EmailEncodingKey = "UTF-8";
    u.Alias = "guest";
    return Observable.of(u);
  }

  public register(user: User): Observable<User> {
    UserService.setAlias(user);
    UserService.setTimezone(user);
    delete user.Contact;
    return this.forceService.post("/guest/register", {
      u: JSON.stringify(user)
    });
  }

  public setLocale(locale: locale, commit: boolean = false): Observable<User> {
    this.cacheService.clear(false, ["user", "cart", "current-account"]);
    this.cacheService._set("locale", locale, true);
    if (commit === true) {
      return this.me()
        .take(1)
        .map(user => {
          user.DefaultCurrencyIsoCode = locale.currency;
          user.LanguageLocaleKey = locale.base;
          user.LocaleSidKey = locale.base;
          return user;
        })
        .flatMap(user => this.update([user]))
        .flatMap(() => this.cacheService.update("user"));
    } else {
      return this.cacheService.update("user");
    }
  }

  public sendPasswordResetEmail(email: string) {
    return this.forceService.post("/guest/resetPassword", { email: email });
  }

  public login(username: string, password: string): Observable<void> {
    return this.forceService
      .login(username, password)
      .flatMap(res => this.cacheService.update("user"));
  }

  public logout(): Observable<void> {
    return this.forceService.logout().flatMap(res => {
      this.cacheService.clearKey("local-cart");
      return this.cacheService.update("user");
    });
  }

  public setPassword(newPassword: string): Observable<User> {
    this.cacheService.clear();
    return this.forceService
      .post("/guest/changePassword", { password: newPassword })
      .flatMap(res => this.me());
  }

  public isLoggedIn(): Observable<boolean> {
    if (!this.forceService.connection.accessToken) return Observable.of(false);
    else return this.me().map(res => (res.Id ? true : false));
  }

  public isAccountAdmin(): Observable<Boolean> {
    return this.forceService
      .post("/guest/getAccountRole", null)
      .map(res => (res ? res.IsPrimary : false));
  }

  public static setAlias(user: User): void {
    if (
      user.FirstName &&
      user.FirstName.trim().length >= 1 &&
      user.LastName &&
      user.LastName &&
      user.LastName.trim().length >= 1
    )
      user.Alias =
        user.FirstName.substring(0, 1) + user.LastName.substring(0, 7);
    else user.Alias = "";
  }

  public static setTimezone(user: User): void {
    try {
      user.TimeZoneSidKey = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      user.TimeZoneSidKey = "America/New_York";
    }
  }
}
