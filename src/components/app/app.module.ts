import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {VsmAppComponent} from "./app.component";
import {RouterModule, Routes} from "@angular/router";
import {FacilityComponent} from "../facility/facility.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, Http}    from '@angular/http';
import {ApiService} from "../../services/api.service";
import {environment} from "../../environments/environment";

export const appRoutes: Routes = [
    {path: 'clinical-configuration', component: FacilityComponent},
    {path: '', redirectTo: 'clinical-configuration', pathMatch: 'full'}
];

export function apiServiceFactory(apiUrl: string, http: Http) {
    return new ApiService(apiUrl, http);
}

@NgModule({
    declarations: [
        VsmAppComponent,
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
            deps: ['apiUrl', Http]}
    ],
    bootstrap: [VsmAppComponent]
})
export class AppModule {
}
