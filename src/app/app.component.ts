import { Component, ViewContainerRef } from '@angular/core';
import { MainService } from './main.service';
import { TimelineService } from './timeline.service';
import { ItemsService } from './items.service';
import { PagesService } from './pages.service';
import { AttrsService } from './attrs.service';
import { BitmapImporterService } from './bitmap-importer.service';


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
	]
})

export class AppComponent {


	constructor(
		private mainService: MainService,
		private timelineService: TimelineService,
		private attrsService: AttrsService,
		private itemsService: ItemsService,
		private pagesService: PagesService,
		private bitmapImporterService: BitmapImporterService,
		private viewContainerRef: ViewContainerRef // need this small hack in order to catch application root view container ref. for ng2-bootstrap
	){

	}

}