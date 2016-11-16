import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdeComponent } from './ide.component';

const ROUTES: Routes = [
	{
		path: '',
		component: IdeComponent,
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

export class IdeRoutingModule {}