import { Injectable, Output, EventEmitter } from '@angular/core';
import { BitmapModel } from './models';

@Injectable()
export class BitmapImporterService {

	public bitmaps: BitmapModel[] = [];

	@Output()
	public uploadCompleteEvent: EventEmitter<BitmapModel[]> = new EventEmitter();

	constructor() {

	}

	public removeBitmap( index: number ) {
		this.bitmaps.splice( index, 1 );
	}

	public createNewBitmap( option: {
		source: string,
		name: string,
		fileName: string,
		size: number
	} ) {
		let newBitmap: BitmapModel = new BitmapModel( option );
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