import { Injectable, Output, EventEmitter } from '@angular/core';
import { PageModel } from './models';

@Injectable()
export class PagesService {

	private list: Array<PageModel> = [];

	/**
	 * @desc	active的页面改变事件
	 */
	@Output()
	pageActiveChangeEvent: EventEmitter<number> = new EventEmitter<number>();

	private _active: number = -1;
	private _activeName: string = '';
	private _activeId: string = '';

	constructor() {

	}

	get pages() {
		return this.list;
	}

	set stages( options: Array<PageModel> ) {
		this.list = options;
		this.active = 0;
		this.pageActiveChangeEvent.emit( this.active );
	}

	set active( index: number ) {
		if(index < 0 || index > this.list.length - 1) {
			this._active = -1;
			this._activeId = '';
			this._activeName = '';
			return;
		}
		if( index !== this._active ) {
			this._active = index;
			this._activeId = this.list[this._active].name;
			this._activeName = this.list[this._active].id;
			this.pageActiveChangeEvent.emit( this.active );
		}
	}

	get active() {
		return this._active;
	}

	set activeName(name: string) {
		this.active = this.list.findIndex(p => {
			return p.name == name;
		});
	}

	get activeName() {
		return this._activeName;
	}

	set activeId(id: string) {
		this.active = this.list.findIndex(p => {
			return p.id == id;
		});
	}

	get activeId() {
		return this._activeId;
	}

	getStage(index: number) {
		return this.list[index];
	}

	addEmptyStage(index: number, name: string) {
		let opt = new PageModel({
			name: name,
		});

		this.list.splice(index, 0, opt);
		this.active = index;
	}

	removeStage(index: number) {
		if(index >= 0 && index <= this.list.length - 1) {
			this.list.splice(index, 1);
			this.active = Math.max(0, this.active - 1);
			this.pageActiveChangeEvent.emit( this.active );
			return true;
		} else {
			return false;
		}
	}

	swapStages(index1: number, index2: number) {
		this.list[index1] = this.list.splice(index2, 1, this.list[index1])[0];
		return this.list;
	}

	upStage(index: number) {
		if(index == 0) return false;
		this.swapStages(index, index - 1);
		this.active --;
		return true;
	}

	downStage(index: number) {
		if(index == this.list.length - 1) return false;
		this.swapStages(index, index + 1);
		this.active ++;
		return true;
	}
}