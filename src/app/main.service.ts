import { Injectable, Output, EventEmitter } from '@angular/core';
import { ItemsService } from './items.service';
import { PagesService } from './pages.service';
import { AttrsService } from './attrs.service';
import { TimelineService } from './timeline.service';
import { BitmapImporterService } from './bitmap-importer.service';
import { MainModel, BitmapSourceModel, ElementModel, ElementStateModel, ItemModel, ItemType, TimelineModel, PageModel, LayerModel } from './models';

@Injectable()
export class MainService {
	
	private options: MainModel = new MainModel();

	@Output()
	timelineChange: EventEmitter<any> = new EventEmitter();

	constructor(
		private itemsService: ItemsService,
		private pagesService: PagesService,
		private attrsService: AttrsService,
		private timelineService: TimelineService,
		private importBitmapService: BitmapImporterService,
	) {
		this.pagesService.stages = this.options.pages;
		this.itemsService.items = this.options.library;
		this.pagesService.pageActiveChangeEvent.subscribe(index => this.activeStageChangeHandler( index ));
		this.itemsService.itemEditEvent.subscribe(item => this.itemEditHandler( item ));
		this.itemsService.itemInsertEvent.subscribe(item => this.itemInsertHandler( item ));
		this.itemsService.itemDeleteEvent.subscribe(item => this.itemDeleteHandler( item ));
		this.importBitmapService.uploadCompleteEvent.subscribe((bitmaps: BitmapSourceModel[]) => this.importBitmapCompleteHandler( bitmaps ));
		this.timelineService.dataChange.subscribe(timelineService => this.timelineDataChangeHandler(timelineService));
		this.attrsService.attrsSubmit.subscribe(() => this.attrsSubmitHandler());
	}

	private activeStageChangeHandler( index: number ) {
		let page: PageModel = this.options.pages[index];
		this.timelineService.setTimeline(page.id, page.timeline);
	}

	private itemEditHandler( item: ItemModel ) {
		if(item.type == ItemType.movieclip)
			this.timelineService.setTimeline(item.id, item.source.timeline);
		else {
			alert('只能编辑 Movie Clip 类型的元件！');
		}
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
			let layers: LayerModel[] = page.timeline.layers;
			
			page.timeline.removeLayersWithElement( ( ele: ElementModel ) => {
				return ele.item === item.id;
			});
			page.timeline.layers
		});
	}

	private importBitmapCompleteHandler( bitmaps: BitmapSourceModel[] ) {
		bitmaps.map( bitmap => this.itemsService.addItem({
				name: bitmap.fileName,
				source: bitmap,
				thumbnail: bitmap.url,
				type: ItemType.bitmap
			})
		);
	}

	private timelineDataChangeHandler(tlService: TimelineService) {
		this.timelineChange.emit(tlService);
	}

	private attrsSubmitHandler() {
		this.timelineChange.emit(this.timelineService);
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

	// public getElementStateInActionFrameById(id: string): {
	// 	element: ElementModel,
	// 	state: ElementStateModel,
	// } {
	// 	return this.timelineService.getElementStateInActionFrameById(id);
	// }
}
