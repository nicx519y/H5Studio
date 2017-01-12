import { Injectable, Output, EventEmitter } from '@angular/core';
import { PageModel } from './models';
import { DataResource } from './data-resource';
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { List, Map } from 'immutable';

@Injectable()
export class PagesService implements DataResource {

	/**
	 * @desc	active的页面改变事件
	 */

	private _data: List<PageModel> = Immutable.List<PageModel>();

	constructor() {

	}

	public getData(): List<PageModel> {
		return this._data;
	}

	public setData(options: List<PageModel>) {
		this._data = options;
	}

	public fetch(path: any[]): PageModel {
		return this._data.getIn(path);
	}

	public writeback(data: any, path: any[]) {
		if(!Immutable.is(data, this._data.getIn(path)))
			this._data = this._data.setIn(path, data);
	}

	public getPage(index: number): PageModel {
		return this._data.get(index);
	}

	public setPage(page: PageModel, index: number) {
		if(this._data.has(index))
			this._data = this._data.set(index, page);
	}

	public addPage(page: PageModel, index: number = -1) {
		if(index >= 0 && index < this._data.size){
			this._data = this._data.insert(index, page);
		} else {
			this._data = this._data.push(page);
		}
	}

	public removePage(index: number) {
		if(index >= 0 && index <= this._data.size - 1) {
			this._data = this._data.delete(index);
		}
	}

	public swapPages(index1: number, index2: number) {
		if(this._data.has(index1) && this._data.has(index2)) {
			let page1 = this._data.get(index1);
			let page2 = this._data.get(index2);
			this._data = this._data.set(index2, page1).set(index1, page2);
		}
	}

	public upPage(index: number) {
		this.swapPages(index, index - 1);
	}

	public downPage(index: number) {
		this.swapPages(index, index + 1);
	}



}