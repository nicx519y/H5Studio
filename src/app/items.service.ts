import { Injectable, Output, EventEmitter } from '@angular/core';
import { ItemModel, ItemType, BitmapModel, PageModel, MF } from './models';
import { DataResource } from './data-resource';

/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { List, Map } from 'immutable';

@Injectable()
export class ItemsService implements DataResource {

	private _data: List<ItemModel> = Immutable.List<ItemModel>();
	private _active: number = -1;

	constructor() {

	}

	public setData(data: List<ItemModel>) {
		this._data = data;
	}

	public getData() {
		return this._data;
	}

	public fetch(path: any[]): any {
		return this._data.getIn(path);
	}

	public writeback(data: any, path: any[]) {
		if(!Immutable.is(this._data.getIn(path), data)) {
			this._data = this._data.setIn(path, data);
		}
	}

	public set active(index: number) {
		if(this._data.has(index)) {
			this._active = index;
		} else {
			this._active = -1;
		}
	}

	public get active(): number {
		return this._active;
	}

	public setItem(item: ItemModel, index: number) {
		if(this._data.has(index))
			this._data = this._data.set(index, item);
	}

	public getItem(index: number): ItemModel {
		return this._data.get(index);
	}

	public removeItem(index: number) {
		this._data = this._data.delete(index);
	}

	public addItem(item: ItemModel, index: number = -1) {
		if(index >= 0 && index < this._data.size) {
			this._data = this._data.insert(index, item);
		} else {
			this._data = this._data.push(item);
		}
	}

	public addItems(items: List<ItemModel>, index: number = -1) {
		if(items.size <= 0) return;
		let data = this._data;
		let idx: number = index;
		if(index < 0 || index > this._data.size)
			idx = this._data.size;

		items.forEach(item => {
			data = data.insert(idx, item);
			idx ++;
		});

		this._data = data;
	}

	public addMovieClips(pages: List<PageModel>) {
		let items = pages.map(page => MF.g(ItemModel, {
			name: page.get('name'),
			type: ItemType.movieclip,
			thumbnail: '',
			source: pages,
		}));
		this.addItems(items as List<ItemModel>);
	}

	public addBitmaps(bitmaps: List<BitmapModel>) {
		let items = bitmaps.map(bitmap => MF.g(ItemModel, {
			name: bitmap.get('name'),
			type: ItemType.bitmap,
			thumbnail: bitmap.get('url'),
			source: bitmap,
		}));
		this.addItems(items as List<ItemModel>);
	}
}