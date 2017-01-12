import { Component, Input, ViewChildren, QueryList, ElementRef, OnInit, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { PagesService } from '../pages.service';
import { TimelineService } from '../timeline.service';
import { MF, PageModel } from '../models';

/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { List, Map } from 'immutable';

@Component({
	selector: 'ide-page-list',
	templateUrl: './page-list.component.html',
	styleUrls: ['./page-list.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageListComponent implements OnInit {

	@Input()
	private model: List<PageModel>;

	@Input()
	private editedPageId: string;

	@ViewChildren('nameInput')
	nameInputList: QueryList<ElementRef>;

	@ViewChildren('page')
	pageList: QueryList<ElementRef>;

	private active: number = -1;

	constructor(
		private services: PagesService,
		private timelineService: TimelineService, 
	) {
		
	}

	/**
	 * 在最后新增空白页
	 */
	public addEmptyPageAtLast() {
		this.services.addPage(MF.g(PageModel, { name: 'New Page' }), this.model.size);
	}

	/**
	 * 删除
	 */
	public removePage(index: number) {
		this.services.removePage(index);
	}
	/**
	 * @dest 上移
	 */
	public upPage(index: number) {
		this.services.upPage(index);
	}

	/**
	 * @dest 下移
	 */
	public downPage(index: number) {
		this.services.downPage(index);
	}

	private nameInputSubmit(index: number, value: string) {
		let page: PageModel = this.services.getPage(index);
		this.services.setPage(page.set('name', value), index);
	}

	private editPage(index: number) {
		this.timelineService.registerDataSource(this.services, [index]);
	}

	private changePageActive(activePage: PageModel) {
		if(this.pageList.length > this.active && this.active >= 0)
			this.pageList.toArray()[this.active].nativeElement.className = 'unactive';
		this.active = this.model.findIndex(page => Immutable.is(page, activePage));
		
		if(this.pageList.length > this.active && this.active >= 0)
			this.pageList.toArray()[this.active].nativeElement.className = 'active';
	}

	private getEditingStatus(index: number): boolean {
		if(!this.model || !this.editedPageId) return false;
		return this.model.getIn([index, 'id']) === this.editedPageId;
	}

	ngAfterViewInit() {
		//如果没有页面，自动增加一个空白页
		if(this.model.size <= 0) {
			this.addEmptyPageAtLast();
		}
	}

	ngOnInit() {

	}

	ngOnChanges(changes) {
		if(changes.hasOwnProperty('activePage')) {
		}
	}

}
