import { Injectable, Output, EventEmitter } from '@angular/core';
import { ItemModel, ItemType } from './models';


@Injectable()
export class ItemsService {
	private itemsList: Array<ItemModel>=[];
	private _active: number = -1;

	@Output()
	itemEditEvent: EventEmitter<ItemModel> = new EventEmitter();

	@Output()
	itemInsertEvent: EventEmitter<ItemModel> = new EventEmitter();

	@Output()
	itemDeleteEvent: EventEmitter<ItemModel> = new EventEmitter();

	constructor() {
	}

	get active(): number {
		return this._active;
	}

	set active( index: number ) {
		if( index >= 0 && index <= this.itemsList.length - 1 && index != this.active ) {
			this._active = index;
		}
	}

	get items() {
		return this.itemsList;
	}

	set items( list: Array<ItemModel> ) {
		this.itemsList = list;
	}

	getItemById( id: string ) {
		let item: ItemModel = this.items.find( i => {
			return ( i.id === id );
		});
	}
 
	addItem(options) {
		this.itemsList.push(new ItemModel(options));
		return true;
	}

	removeItem(index: number) {
		if(index >= 0) {
			let item: ItemModel = this.items[ index ];
			this.itemsList.splice(index, 1);
			this.itemDeleteEvent.emit( item );
			return true;
		} else {
			return false;
		}
	}

	editItem(index: number) {
		if( index >= 0 && index <= this.items.length - 1 ) {
			this.itemEditEvent.emit( this.items[index] );
		}
	}

	insertItem(index: number) {
		if( index >= 0 && index <= this.items.length - 1 ) {
			this.itemInsertEvent.emit( this.items[index] );
		}
	}

}