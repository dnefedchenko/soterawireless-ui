import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {VsmAppComponent} from "./app.component";
import {RouterModule, Routes} from "@angular/router";
import {FacilityComponent} from "../facility/facility.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

export const appRoutes: Routes = [
    {path: 'clinical-configuration', component: FacilityComponent},
    {path: '', redirectTo: 'clinical-configuration', pathMatch: 'full'}
];

@NgModule({
    declarations: [
        VsmAppComponent,
        FacilityComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [],
    bootstrap: [VsmAppComponent]
})
export class AppModule {
}
