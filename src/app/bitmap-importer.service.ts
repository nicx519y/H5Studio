import { Injectable, Output, EventEmitter,  } from '@angular/core';
import { BitmapSourceModel } from './models';

@Injectable()
export class BitmapImporterService {

	public _bitmaps: BitmapSourceModel[] = [];

	@Output()
	public uploadCompleteEvent: EventEmitter<BitmapSourceModel[]> = new EventEmitter();

	constructor(
	) {
	}

	public removeBitmap( index: number ) {
		this._bitmaps.splice( index, 1 );
	}

	public createNewBitmap( options: {
		url: string,
		fileName: string,
		size: number
	} ) {
		let newBitmap: BitmapSourceModel = new BitmapSourceModel( options );
		this._bitmaps.push( newBitmap );
	}

	public clearData() {
		this._bitmaps.length = 0;
	}

	public upload() {
		this.uploadCompleteEvent.emit( this._bitmaps );
	}

	public get bitmaps() {
		return this._bitmaps;
	}

}