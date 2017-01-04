import { Component, Input, ViewChildren, QueryList, ElementRef, OnInit, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { PagesService } from '../pages.service';
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
	private active: number;

	@ViewChildren('nameInput')
	nameInputList: QueryList<ElementRef>;

	constructor(
		private services: PagesService
	) {

	}

	/**
	 * 在最后新增空白页
	 */
	addEmptyPageAtLast() {
		this.services.addPage(MF.g(PageModel, { name: 'New Page' }), this.model.size);
		this.services.active = this.services.getData().size - 1;
	}

	/**
	 * 删除
	 */
	removePage(index: number) {
		this.services.removePage(index);
		this.services.active --;
	}
	/**
	 * @dest 上移
	 */
	upPage(index: number) {
		this.services.upPage(index);
	}

	/**
	 * @dest 下移
	 */
	downPage(index: number) {
		this.services.downPage(index);
	}

	pageActive(index: number) {
		this.services.active = index;
	}

	nameInputSubmit(index: number, value: string) {
		let page: PageModel = this.services.getPage(index);
		this.services.setPage(page.set('name', value), index);
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

	}

}
