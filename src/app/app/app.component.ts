import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NavDropdownMenuModel } from '../models';


@Component({
	selector: 'app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	private navOptions: NavDropdownMenuModel[];

	constructor(
		private viewContainerRef: ViewContainerRef, // need this small hack in order to catch application root view container ref. for ng2-bootstrap
	) { }

	ngOnInit() {
	}

}
