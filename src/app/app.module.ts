import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ProductsModule } from './products/products.module';
import { IdeModule } from './ide/ide.module';
import { AppComponent } from './app/app.component';
import { MainService } from './main.service';
import { ProductsComponent } from './products/products.component';
import { IdeComponent } from './ide/ide.component';
import { LayoutComponent } from './layout/layout.component';
import { NavComponent } from './nav/nav.component';

const ROUTERS: Routes = [
	{ path: '', redirectTo: '/products', pathMatch: 'full' },
	{ path: 'products', component: ProductsComponent },
	{ path: 'ide/:id', component: IdeComponent },
];

@NgModule({
	imports: [
		BrowserModule,
		RouterModule.forRoot(ROUTERS),
		ProductsModule,
		IdeModule,
	],
	declarations: [
		AppComponent,
		NavComponent,
		LayoutComponent
	],
	providers: [
		MainService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	
}
