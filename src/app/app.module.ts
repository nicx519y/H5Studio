import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { AppRoutingModule } from './app.routing.module';

@NgModule({
	imports: [
		AppRoutingModule,
		BrowserModule,
	],
	declarations: [
		AppComponent,
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	
}
