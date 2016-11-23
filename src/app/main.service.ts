import { Injectable, Output, EventEmitter } from '@angular/core';
import { ItemsService } from './items.service';
import { PagesService } from './pages.service';
import { AttrsService } from './attrs.service';
import { TimelineService } from './timeline.service';
import { BitmapImporterService } from './bitmap-importer.service';
import { MainModel, BitmapSourceModel, ElementModel, ItemModel, ItemType, TimelineModel, PageModel } from './models';

@Injectable()
export class MainService {
	
	private options: MainModel = new MainModel();
	private _outputData: MainModel;

	@Output()
	public dataUpdateEvent: EventEmitter<MainModel|boolean> = new EventEmitter();

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

		this.importBitmapService.uploadCompleteEvent.subscribe( (bitmaps: BitmapSourceModel[]) => {
			this.importBitmapCompleteHandler( bitmaps );
		});
	}

	private activeStageChangeHandler( index: number ) {
		this.timelineService.timeline = this.options.pages[index].timeline;
		this.createOuputData();
	}

	private itemEditHandler( item: ItemModel ) {
		this.createOuputData();
	}

	private itemInsertHandler( item: ItemModel ) {
		if( this.pagesService.active >= 0 ) {
			this.timelineService.addElement(
				ElementModel.fromItem( item )
			);
			this.createOuputData();
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
				return ele.item === item.id;
			});
		});
		this.createOuputData();
	}

	private importBitmapCompleteHandler( bitmaps: BitmapSourceModel[] ) {
		bitmaps.map( bitmap => {
			this.itemsService.addItem({
				name: bitmap.fileName,
				source: bitmap,
				thumbnail: bitmap.url,
				type: ItemType.bitmap
			});
		});
		this.createOuputData();
	}

	/**
	 * @desc	生成输出数据，可能是一个item或者是整个应用的数据
	 */
	private createOuputData(itemId: string = '') {
		if(!itemId || itemId == '') {
			this._outputData = this.options.value;
			return;
		}
		let lib: ItemModel[] = this.options.library;
		let item: ItemModel = lib.find(item => {
			return item.id == itemId;
		});

		if(item) {
			if(item.type != ItemType.movieclip) {
				this._outputData = new MainModel().value;	//不是影片剪辑
			} else {
				let output: MainModel = new MainModel();
				output.pages = [item.source as PageModel];
				output.library = lib;
				this._outputData = output.value;
			}
		} else {
			this._outputData = new MainModel().value;
		}
	}

	/**
	 * @desc	保存数据
	 */
	public saveData() {
		
	}

	/**
	 * @desc	预览
	 */
	public preview() {

	}

	/**
	 * @desc	建立并打开新项目
	 */
	public createNewProject() {

	}

	/**
	 * @desc	发布
	 */
	public publish() {

	}

	public get data(): MainModel {
		return this.options;
	}


	public get outputData(): MainModel {
		return this._outputData;
	}
}
