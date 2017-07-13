import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {VsmAppComponent} from "./app.component";
import {RouterModule, Routes} from "@angular/router";
import {ClinicalConfigurationComponent} from "../clinical-configuration/clinical-configuration.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, Http, BrowserXhr} from "@angular/http";
import {ApiService} from "../../services/api.service";
import {environment} from "../../environments/environment";
import {LoginComponent} from "../login/login.component";
import {AuthenticationService} from "../../services/authentication.service";
import {RouterGuard} from "../../services/router.guard";
import {CorsService} from "../../services/cors.service";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {ToastModule, ToastOptions, ToastsManager} from "ng2-toastr/ng2-toastr";
import {VsmGlobalTostOptions} from "../../common/toast.options";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NotificationService} from "../../services/notification.service";
import {FileUploadModule} from "ng2-file-upload/index";
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import {MmHgCareUnitComponent} from "../care-unit/mmhg.care.unit.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {KpaCareUnitComponent} from "../care-unit/kpa.care.unit.component";



export const appRoutes: Routes = [
    {path: 'clinical-configuration', component: ClinicalConfigurationComponent, canActivate: [RouterGuard]},
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];

export function apiServiceFactory(apiUrl: string, http: Http) {
    return new ApiService(apiUrl, http);
}

export function authenticationServiceFactory(apiService: ApiService) {
    return new AuthenticationService(apiService);
}

export function notificationFactory(toastsManager: ToastsManager) {
    return new NotificationService(toastsManager);
}

@NgModule({
    declarations: [
        VsmAppComponent,
        LoginComponent,
        ClinicalConfigurationComponent,
        MmHgCareUnitComponent,
        KpaCareUnitComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AngularFontAwesomeModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes),
        ToastModule.forRoot(),
        FileUploadModule,
        NgbModule.forRoot()
    ],
    providers: [
        {provide: BrowserXhr, useClass: CorsService},
        {provide: ToastOptions, useClass: VsmGlobalTostOptions},
        {provide: 'apiUrl', useValue: environment.apiUrl},
        {
            provide: ApiService,
            useFactory: apiServiceFactory,
            deps: ['apiUrl', Http]
        },
        {
            provide: AuthenticationService,
            useFactory: authenticationServiceFactory,
            deps: [ApiService]
        },
        {
            provide: NotificationService,
            useFactory: notificationFactory,
            deps: [ToastsManager]
        },
        {provide: RouterGuard, useClass: RouterGuard},
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [VsmAppComponent]
})
export class AppModule {
}
