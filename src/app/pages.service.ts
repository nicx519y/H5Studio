import { Injectable, Output, EventEmitter } from '@angular/core';
import { PageModel } from './models';

/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { List, Map } from 'immutable';

@Injectable()
export class PagesService {

	/**
	 * @desc	active的页面改变事件
	 */

	private _active: number = -1;
	private _data: List<PageModel> = Immutable.List<PageModel>();

	constructor() {

	}

	public getData(): List<PageModel> {
		return this._data;
	}

	public setData(options: List<PageModel>) {
		this._data = options;
	}

	public set active(index: number) {
		if(index < 0 || index > this._data.size - 1) {
			this._active = -1;
		} else {
			this._active = index;
		}
	}

	public get active(): number {
		return this._active;
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



	// get pages() {
	// 	return this.list;
	// }

	// set stages( options: Array<PageModel> ) {
	// 	this.list = options;
	// 	this.active = 0;
	// 	this.pageActiveChangeEvent.emit( this.active );
	// }

	// set active( index: number ) {
	// 	if(index < 0 || index > this.list.length - 1) {
	// 		this._active = -1;
	// 		this._activeId = '';
	// 		this._activeName = '';
	// 		return;
	// 	}
	// 	if( index !== this._active ) {
	// 		this._active = index;
	// 		this._activeId = this.list[this._active].name;
	// 		this._activeName = this.list[this._active].id;
	// 		this.pageActiveChangeEvent.emit( this.active );
	// 	}
	// }

	// get active() {
	// 	return this._active;
	// }

	// set activeName(name: string) {
	// 	this.active = this.list.findIndex(p => {
	// 		return p.name == name;
	// 	});
	// }

	// get activeName() {
	// 	return this._activeName;
	// }

	// set activeId(id: string) {
	// 	this.active = this.list.findIndex(p => {
	// 		return p.id == id;
	// 	});
	// }

	// get activeId() {
	// 	return this._activeId;
	// }

	// getStage(index: number) {
	// 	return this.list[index];
	// }

	// addEmptyStage(index: number, name: string) {
	// 	let opt = new PageModel({
	// 		name: name,
	// 	});

	// 	this.list.splice(index, 0, opt);
	// 	this.pageChangedEvent.emit();
	// 	this.active = index;
	// }

	// removeStage(index: number) {
	// 	if(index >= 0 && index <= this.list.length - 1) {
	// 		this.list.splice(index, 1);
	// 		this.pageChangedEvent.emit();
	// 		this.active = Math.max(0, this.active - 1);
	// 		this.pageActiveChangeEvent.emit( this.active );
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

	// swapStages(index1: number, index2: number) {
	// 	this.list[index1] = this.list.splice(index2, 1, this.list[index1])[0];
	// 	this.pageChangedEvent.emit();
	// 	return this.list;
	// }

	// upStage(index: number) {
	// 	if(index == 0) return false;
	// 	this.swapStages(index, index - 1);
	// 	this.active --;
	// 	return true;
	// }

	// downStage(index: number) {
	// 	if(index == this.list.length - 1) return false;
	// 	this.swapStages(index, index + 1);
	// 	this.active ++;
	// 	return true;
	// }
}