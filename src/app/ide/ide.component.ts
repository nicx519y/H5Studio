import { Component, ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';
import { PagesService } from '../pages.service';
// import { MainService } from '../main.service';
import { ItemsService } from '../items.service';
// import { AttrsService } from '../attrs.service';
import { BitmapImporterService } from '../bitmap-importer.service';

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
		private bitmapImporterService: BitmapImporterService,
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
}