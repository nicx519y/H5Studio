import { Injectable } from '@angular/core';
import { ProductModel } from './models';

@Injectable()
export class ProductsService {

	options: ProductModel[] = [];

	constructor() { 
		this.options = [
			new ProductModel({
				title: 'One Product',
				user: 'Lily',
				lastModify: new Date().getTime(),
				prodId: 'aad'
			}),
			new ProductModel({
				title: 'One Product',
				user: 'Lily',
				lastModify: new Date().getTime(),
				prodId: 'aad'
			}),
			new ProductModel({
				title: 'One Product',
				user: 'Lily',
				lastModify: new Date().getTime(),
				prodId: 'aad'
			}),
			new ProductModel({
				title: 'One Product',
				user: 'Lily',
				lastModify: new Date().getTime(),
				prodId: 'aad'
			}),
			new ProductModel({
				title: 'One Product',
				user: 'Lily',
				lastModify: new Date().getTime(),
				prodId: 'aad'
			}),
		];
	}

	fetch() {

	}

	update() {
		
	}
}
