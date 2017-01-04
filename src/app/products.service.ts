import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise'
import { MF, ProductModel, MainModel } from './models';

@Injectable()
export class ProductsService {

	private fetchURL: string = '/api/fetch';
	private createURL: string = '/api/create';
	private removeURL: string = '/api/remove';

	options: Immutable.List<any> = Immutable.List<any>();

	constructor(
		private http: Http
	) { 
		
	}

	public fetch() {
		this.options = this.options.push(
			MF.g(ProductModel, {
				title: 'title',
				user: 'jone',
				lastModify: new Date().getTime(),
				prodId: 'aas'
			})
		);
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
