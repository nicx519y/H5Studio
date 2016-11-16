import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
	{ 
		path: '', 
		redirectTo: 'products',
		pathMatch: 'full' 
	},
	{ 
		path: 'products', 
		loadChildren: 'app/products/products.module#ProductsModule'
	},
	{ 
		path: 'studio', 
		loadChildren: 'app/ide/ide.module#IdeModule'
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(ROUTES)
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule {}