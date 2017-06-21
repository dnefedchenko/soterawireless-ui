import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { VsmAppComponent } from './app.component';

@NgModule({
  declarations: [
    VsmAppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [VsmAppComponent]
})
export class AppModule { }
