import { Component, ViewContainerRef } from '@angular/core';
import { MainService } from '../main.service';
import { NavDropdownMenuModel } from '../models';

@Component({
	selector: 'ide',
	templateUrl: './ide.component.html',
	styleUrls: ['./ide.component.css'],
})

export class IdeComponent {

	constructor(
		private service: MainService
	){
		
	}

	public saveData() {
		console.log('save');
		this.service.saveData();
	}

	public preview() {
		console.log('preview');
	}

	public publish() {
		console.log('publish');
	}

	public createNewProject() {
		this.service.createNewProject();
	}
}