import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ApttusModule, ApiConfig } from "apttus";

import { AppComponent } from "./app.component";

// import { environment } from "../environments/environment";

const sv = (<any>window).sv || {
  organizationId: "00D250000008cmJ",
  salesforceEndpoint: "https://qkdev2-kukaprod.cs80.force.com",
  translations: "/assets/i18n",
  baseURL: "",
  resource: "."
};

export function _config() {
  return {
    organizationid: sv.organizationId,
    accessToken: sv.accessToken,
    production: false,
    salesforceEndpoint: sv.baseURL ? sv.baseURL : sv.salesforceEndpoint,
    storeName: "KUKA Main",
    defaultImageSrc: "/assets/images/placeholder.png"
  } as ApiConfig;
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ApttusModule.forRoot(_config())],
  providers: [ApttusModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
