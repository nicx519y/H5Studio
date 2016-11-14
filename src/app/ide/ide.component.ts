import { Component, ViewContainerRef } from '@angular/core';
import { MainService } from '../main.service';
import { NavDropdownMenuModel } from '../models';

@Component({
	selector: 'ide',
	templateUrl: './ide.component.html',
	styleUrls: ['./ide.component.css'],
})

export class IdeComponent {

	private navOptions:  NavDropdownMenuModel[];

	constructor(
		private service: MainService
	){
		this.navOptions = [
			new NavDropdownMenuModel({
				navId: 'file',
				title: '文件',
				list: [{
					
				}]
			})
		];
	}

}