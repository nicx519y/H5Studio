import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { AppCommonModule } from '../app-common/app-common.module';
import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ProductsService } from '../products.service';
import { ProductsRoutingModule } from './products.routing.module';

@NgModule({
	imports: [
		ProductsRoutingModule,
		CommonModule,
		FormsModule,
		HttpModule,
		RouterModule,
		AppCommonModule,
		Ng2BootstrapModule,
	],
	declarations: [
		ProductsComponent,
	],
	providers: [
		ProductsService
	],
	exports: [
		ProductsComponent
	]
})
export class ProductsModule {
	
}
