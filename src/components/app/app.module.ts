import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {VsmAppComponent} from './app.component';
import { RouterModule, Routes } from '@angular/router';
import {FacilityComponent} from "../facility/facility.component";

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
        RouterModule.forRoot(appRoutes)
    ],
    providers: [],
    bootstrap: [VsmAppComponent]
})
export class AppModule {
}
