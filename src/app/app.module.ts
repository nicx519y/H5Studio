import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { ProductsModule } from './products/products.module';
import { IdeModule } from './ide/ide.module';


const ROUTES: Routes = [
	{path: '', redirectTo: 'products', pathMatch: 'full'}
];

@NgModule({
	imports: [
		RouterModule.forRoot(ROUTES),
		BrowserModule,
		HttpModule,
		ProductsModule,
		IdeModule,
	],
	declarations: [
		AppComponent,
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	
}
