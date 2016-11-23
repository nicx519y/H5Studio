import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, RouterLink } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';
import { AppCommonModule } from '../app-common/app-common.module';
import { ProductsService } from '../products.service';
import { ProductsComponent } from './products.component';

const ROUTES: Routes = [
	{path: 'products', component: ProductsComponent}
];

@NgModule({
	imports: [
		RouterModule.forChild(ROUTES),
		CommonModule,
		HttpModule,
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
