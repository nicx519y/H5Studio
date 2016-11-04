import { Injectable } from '@angular/core';
import { ItemsService } from './items.service';
import { PagesService } from './pages.service';
import { AttrsService } from './attrs.service';
import { TimelineService } from './timeline.service';
import { BitmapImporterService } from './bitmap-importer.service';
import { MainModel, BitmapModel, ElementModel, ItemModel, ItemType } from './models';

@Injectable()
export class MainService {
	
	private options: MainModel = new MainModel();

	constructor(
		private itemsService: ItemsService,
		private pagesService: PagesService,
		private attrsService: AttrsService,
		private timelineService: TimelineService,
		private importBitmapService: BitmapImporterService,
	) {
		this.pagesService.stages = this.options.pages;
		this.itemsService.items = this.options.library;

		this.pagesService.pageActiveChangeEvent.subscribe( index => {
			this.activeStageChangeHandler( index );
		});

		this.itemsService.itemEditEvent.subscribe( item => {
			this.itemEditHandler( item );
		});

		this.itemsService.itemInsertEvent.subscribe( item => {
			this.itemInsertHandler( item );
		});

		this.itemsService.itemDeleteEvent.subscribe( item => {
			this.itemDeleteHandler( item );
		});

		this.importBitmapService.uploadCompleteEvent.subscribe( (bitmaps: BitmapModel[]) => {
			this.importBitmapCompleteHandler( bitmaps );
		});
	}

	private activeStageChangeHandler( index: number ) {
		this.timelineService.timeline = this.options.pages[index].timeline;
	}

	private itemEditHandler( item: ItemModel ) {

	}

	private itemInsertHandler( item: ItemModel ) {
		if( this.pagesService.active >= 0 ) {
			this.timelineService.addElement(
				ElementModel.fromItem( item )
			);
		} else {
			alert( '请选择要插入的页面' );
		}
	}

	/**
	 * @desc	删除item 以及所在图层
	 * @param	{ item }	需要删除的item
	 */
	private itemDeleteHandler( item: ItemModel ) {
		this.options.pages.forEach( page => {
			page.timeline.removeLayerWithElement( ( ele: ElementModel ) => {
				return ele.source === item;
			});
		});
	}

	private importBitmapCompleteHandler( bitmaps: BitmapModel[] ) {
		bitmaps.map( bitmap => {
			this.itemsService.addItem({
				name: bitmap.name,
				source: bitmap.source,
				thumbnail: bitmap.source,
				type: ItemType.bitmap
			});
		});
	}
}