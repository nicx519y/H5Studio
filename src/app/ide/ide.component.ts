import { Component, ViewContainerRef, ChangeDetectionStrategy, enableProdMode } from '@angular/core';
import { PagesService } from '../pages.service';
// import { MainService } from '../main.service';
import { ItemsService } from '../items.service';
// import { AttrsService } from '../attrs.service';
import { BitmapImporterService } from '../bitmap-importer.service';
import { TimelineService } from '../timeline.service';
import { PageConfigerService } from '../page-configer.service';

enableProdMode();	//防止出现一些dev版本才会出现的错误 

@Component({
	selector: 'ide',
	templateUrl: './ide.component.html',
	styleUrls: ['./ide.component.css'],
	changeDetection: ChangeDetectionStrategy.Default,
})

export class IdeComponent {

	constructor(
		// private service: MainService,
		private pagesService: PagesService,
		private itemsService: ItemsService,
		private timelineService: TimelineService,
		private bitmapImporterService: BitmapImporterService,
		private pageConfigerService: PageConfigerService,
	){
	}

	public saveData() {
		console.log('save');
		// this.service.saveData();
	}

	public preview() {
		console.log('preview');
	}

	public publish() {
		console.log('publish');
	}

	public createNewProject() {
		// this.service.createNewProject();
	}

	public fullscreen() {
		document.documentElement.webkitRequestFullscreen();
	}

	ngAfterViewInit() {
	}
}