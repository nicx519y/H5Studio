import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../main.service';
import { PageConfigerComponent } from '../page-configer/page-configer.component';
import { BitmapImporterComponent } from '../bitmap-importer/bitmap-importer.component';

@Component({
	selector: 'ide-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

	@ViewChild('pageConfiger')
	pageConfiger: PageConfigerComponent;

	@ViewChild('bitmapImporter')
	bitmapImporter: BitmapImporterComponent;

	constructor(
		private mainService: MainService
	) { 

	}

	public saveData() {
		this.mainService.saveData();
	}

	public preview() {
		this.mainService.preview();
	}

	public publish() {
		this.mainService.publish();
	}

	public createNewProject() {
		this.mainService.createNewProject();
	}

	public showPageConfiger() {
		this.pageConfiger.show();
	}

	public showBitmapImporter() {
		this.bitmapImporter.show();
	}

	ngOnInit() {
	}

}
