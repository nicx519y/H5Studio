import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ProductsService } from '../products.service';
import { NavComponent } from '../nav/nav.component';

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {


	constructor(
		private viewContainerRef: ViewContainerRef, // need this small hack in order to catch application root view container ref. for ng2-bootstrap
		private service: ProductsService
	) {
		
	}

	ngOnInit() {
		this.service.fetch();
	}

}
