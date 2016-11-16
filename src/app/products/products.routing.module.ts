import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';

const ROUTES: Routes = [
	{
		path: '',
		component: ProductsComponent,
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(ROUTES)
	],
	exports: [
		RouterModule
	]
})

export class ProductsRoutingModule {}