import { Injectable, Output, EventEmitter } from '@angular/core';
import { PagesService } from './pages.service';
// import { ItemsService } from './items.service';
// import { AttrsService } from './attrs.service';
// import { TimelineService } from './timeline.service';
// import { BitmapImporterService } from './bitmap-importer.service';
import { MainModel, BitmapModel, ElementModel, ElementStateModel, ItemModel, ItemType, PageModel, LayerModel } from './models';

@Injectable()
export class MainService {
	
	private options: MainModel = new MainModel();

	@Output()
	timelineChange: EventEmitter<{
		type: 'page' | 'item',
		model: PageModel
	}> = new EventEmitter();

	constructor(
		// private itemsService: ItemsService,
		private pagesService: PagesService,
		// private timelineService: TimelineService,
		// private importBitmapService: BitmapImporterService,
	) {
		// this.pagesService.stages = this.options.pages;
		// this.itemsService.items = this.options.library;
		// this.pagesService.pageActiveChangeEvent.subscribe(index => this.activeStageChangeHandler( index ));
		// this.pagesService.pageChangedEvent.subscribe(() => this.timelineDataChangeHandler());
		// this.itemsService.itemEditEvent.subscribe(item => this.itemEditHandler( item ));
		// this.itemsService.itemInsertEvent.subscribe(item => this.itemInsertHandler( item ));
		// this.itemsService.itemDeleteEvent.subscribe(item => this.itemDeleteHandler( item ));
		// this.importBitmapService.uploadCompleteEvent.subscribe((bitmaps: BitmapSourceModel[]) => this.importBitmapCompleteHandler( bitmaps ));
		// this.timelineService.dataChangeEvent.subscribe(timelineService => this.timelineDataChangeHandler());

	}

	// private activeStageChangeHandler( index: number ) {
	// 	let page: PageModel = this.options.pages[index];
	// 	this.changeActivePage(page.id);
	// }

	// private itemEditHandler( item: ItemModel ) {
	// 	if(item.type == ItemType.movieclip){
	// 		this.changeActivePage(item.source.id);
	// 	} else {
	// 		alert('只能编辑 Movie Clip 类型的元件！');
	// 	}
	// }

	// private itemInsertHandler( item: ItemModel ) {
	// 	if( this.timelineService.stageId != '' ) {
	// 		this.timelineService.addElement(
	// 			ElementModel.fromItem( item )
	// 		);
	// 	} else {
	// 		alert( '请选择要插入的页面' );
	// 	}
	// }

	/**
	 * @desc	删除item 以及所在图层
	 * @param	{ item }	需要删除的item
	 */
	// private itemDeleteHandler( item: ItemModel ) {
	// 	this.options.pages.forEach( page => {
	// 		let layers: LayerModel[] = page.timeline.layers;
	// 		page.timeline.removeLayersWithElement( ( ele: ElementModel ) => {
	// 			return ele.item === item.id;
	// 		});
	// 	});
	// 	//通知canvas刷新
	// 	this.timelineChange.emit();
	// }

	// private importBitmapCompleteHandler( bitmaps: BitmapSourceModel[] ) {
	// 	bitmaps.map( bitmap => this.itemsService.addItem({
	// 			name: bitmap.fileName,
	// 			source: bitmap,
	// 			thumbnail: bitmap.url,
	// 			type: ItemType.bitmap
	// 		})
	// 	);
	// }

	private timelineDataChangeHandler() {
		this.timelineChange.emit();
	}


	// private getPageModelType(pageId: string): {
	// 	id: string,
	// 	name: string,
	// 	type: string,
	// 	timeline: TimelineModel,
	// } {
	// 	let result = null;
	// 	let page: PageModel = this.options.pages.find(page => { return page.id == pageId }); 
	// 	if(page) {
	// 		result = {
	// 			id: pageId,
	// 			name: page.name,
	// 			type: 'page',
	// 			timeline: page.timeline,
	// 		};
	// 	} else {
	// 		let it: ItemModel = this.options.library.find(item => {
	// 			return (item.type == ItemType.movieclip && item.source.id == pageId);
	// 		});
			
	// 		if(it){
	// 			result = {
	// 				id: pageId,
	// 				name: it.name,
	// 				type: 'movieclip',
	// 				timeline: it.source.timeline
	// 			};
	// 		}
	// 	}
		
	// 	return result;
	// }

	// public changeActivePage(pageId: string) {
	// 	let obj = this.getPageModelType(pageId);
	// 	this.timelineService.setTimeline(obj);
	// 	this.pagesService.activeId = pageId;
	// }

	// public get activeStageName(): string {
	// 	let id: string = this.timelineService.stageId;
	// 	let obj = this.getPageModelType(id);
	// 	if(obj)
	// 		return obj.name;
	// 	else
	// 		return '';
	// }

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

}
