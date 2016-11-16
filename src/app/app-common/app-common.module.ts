import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../nav/nav.component';
import { LayoutComponent } from '../layout/layout.component';

@NgModule({
	imports: [
		CommonModule
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
