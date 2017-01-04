import { Injectable, Output, EventEmitter,  } from '@angular/core';
import { BitmapModel } from './models';

/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { List, Map } from 'immutable';

@Injectable()
export class BitmapImporterService {

	public _data: List<BitmapModel> = Immutable.List<BitmapModel>();

	@Output()
	public uploadCompleteEvent: EventEmitter<List<BitmapModel>> = new EventEmitter();

	constructor(
	) {

	}

	public getData() {
		return this._data;
	}

	public setData(data: List<BitmapModel>) {
		this._data = data;
	}

	public addBitmap(bitmap: BitmapModel, index: number = -1) {
		if(index >= 0 && index < this._data.size)
			this._data = this._data.insert(index, bitmap);
		else
			this._data = this._data.push(bitmap);
	}

	public getBitmap(index: number): BitmapModel {
		return this._data.get(index);
	}

	public setBitmap(bitmap: BitmapModel, index: number) {
		this._data = this._data.set(index, bitmap);
	}

	public removeBitmap( index: number ) {
		this._data = this._data.delete(index);
	}

	public clearData() {
		this._data = this._data.clear();
	}

	public upload() {
		this.uploadCompleteEvent.emit( this._data );
	}

}