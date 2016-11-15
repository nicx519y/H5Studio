import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ProductsService } from '../products.service';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule,
	],
	declarations: [
		ProductsComponent,
	],
	providers: [ProductsService],
	exports: [
		ProductsComponent
	]
})
export class ProductsModule {
	
}
