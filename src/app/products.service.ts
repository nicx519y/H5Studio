import { Injectable } from '@angular/core';
import { ProductModel, MainModel } from './models';

@Injectable()
export class ProductsService {

	options: ProductModel[] = [];

	constructor() { 
		
	}

	fetch() {
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

	createNewProject() {
		
	}

	removeProject(id: string) {
		
	}
	
	

}
