import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise'
import { ProductModel, MainModel } from './models';

@Injectable()
export class ProductsService {

	private fetchURL: string = '/api/fetch';
	private createURL: string = '/api/create';
	private removeURL: string = '/api/remove';

	options: ProductModel[] = [];

	constructor(
		private http: Http
	) { 
		
	}

	public fetch() {
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

	public createNewProject() {
		return this.http.post(this.createURL, {});
	}

	public removeProject(id: string) {
		return this.http.post(this.removeURL, {});
	}
	
	private errorHandler(error: Response | any): Promise<any> {
		return Promise.reject(error.message || error);
	}

}
