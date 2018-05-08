import { CommonModule } from "@angular/common";

import {
  NgModule,
  ErrorHandler,
  ModuleWithProviders,
  Optional,
  SkipSelf
} from "@angular/core";

import { HttpClientModule } from "@angular/common/http";
import { ServiceModule } from "./packages/service.module";
import { PipeModule } from "./pipes/pipe.module";
import { ConfigService, ApiConfig } from "./packages/config/config.service";

@NgModule({
  imports: [],
  declarations: [
    //   ImagePipe
  ],
  //   imports: [ImagePipe],
  //   bootstrap: [],
  //   entryComponents: [],
  exports: [
    //   ImagePipe
  ],
  providers: [
    // ServiceModule,
    // PipeModule
    // ,{ provide: ErrorHandler, useClass: RavenErrorHandler }
  ]
})
export class ApttusModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: ApttusModule
  ) {
    if (parentModule) {
      throw new Error(
        "ApiModule is already loaded. Import it in the AppModule only"
      );
    }
  }
  static forRoot(config: any): ModuleWithProviders {
    return {
      ngModule: ApttusModule,
      providers: [
        ConfigService,
        { provide: "config", useValue: config as ApiConfig }
      ]
    };
  }
}
