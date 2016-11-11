import { Injectable, Output, EventEmitter } from '@angular/core';
import { BitmapSourceModel } from './models';

@Injectable()
export class BitmapImporterService {

	public bitmaps: BitmapSourceModel[] = [];

	@Output()
	public uploadCompleteEvent: EventEmitter<BitmapSourceModel[]> = new EventEmitter();

	constructor() {

	}

	public removeBitmap( index: number ) {
		this.bitmaps.splice( index, 1 );
	}

	public createNewBitmap( options: {
		path: string,
		fileName: string,
		size: number
	} ) {
		let newBitmap: BitmapSourceModel = new BitmapSourceModel( options );
		this.bitmaps.push( newBitmap );
	}

	public clearData() {
		this.bitmaps = [];
		this.bitmaps.length = 0;
	}

	public upload() {
		this.uploadCompleteEvent.emit( this.bitmaps );
	}

}