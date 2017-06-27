import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {VsmAppComponent} from "./app.component";
import {RouterModule, Routes} from "@angular/router";
import {FacilityComponent} from "../facility/facility.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, Http} from "@angular/http";
import {ApiService} from "../../services/api.service";
import {environment} from "../../environments/environment";
import {LoginComponent} from "../login/login.component";
import {AuthenticationService} from "../../services/authentication.service";
import {RouterGuard} from "../../services/router.guard";

export const appRoutes: Routes = [
    {path: 'clinical-configuration', component: FacilityComponent, canActivate: [RouterGuard]},
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];

export function apiServiceFactory(apiUrl: string, http: Http) {
    return new ApiService(apiUrl, http);
}

export function authenticationServiceFactory(apiService: ApiService) {
    return new AuthenticationService(apiService);
}

@NgModule({
    declarations: [
        VsmAppComponent,
        LoginComponent,
        FacilityComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [
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
        {provide: RouterGuard, useClass: RouterGuard}
    ],
    bootstrap: [VsmAppComponent]
})
export class AppModule {
}
