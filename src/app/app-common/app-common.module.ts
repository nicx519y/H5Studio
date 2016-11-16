import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavComponent } from '../nav/nav.component';
import { LayoutComponent } from '../layout/layout.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
	],
	declarations: [
		NavComponent,
		LayoutComponent,
	],
	exports: [
		NavComponent,
		LayoutComponent,
	]
})
export class AppCommonModule { }
