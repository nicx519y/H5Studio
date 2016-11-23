import { Component, OnInit, ViewChild, Input, ViewContainerRef } from '@angular/core';
import { MainService } from '../main.service';
import { ActivatedRoute, Router, RouterState } from '@angular/router';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

	constructor(
		private viewContainerRef: ViewContainerRef, // need this small hack in order to catch application root view container ref. for ng2-bootstrap
		private router: ActivatedRoute,
	) { 

	}

	ngOnInit() {
		
	}

}
