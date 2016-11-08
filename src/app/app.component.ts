import { Component, ViewContainerRef } from '@angular/core';
import { MainService } from './main.service';
import { TimelineService } from './timeline.service';
import { ItemsService } from './items.service';
import { PagesService } from './pages.service';
import { AttrsService } from './attrs.service';
import { BitmapImporterService } from './bitmap-importer.service';
import { PageConfigerService } from './page-configer.service';


@Component({
	selector: 'ide',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [ 
		MainService,
		TimelineService,
		AttrsService,
		ItemsService,
		PagesService,
		BitmapImporterService,
		PageConfigerService,
	]
})

export class AppComponent {


	constructor(
		private viewContainerRef: ViewContainerRef, // need this small hack in order to catch application root view container ref. for ng2-bootstrap
		private service: MainService
	){

	}

}