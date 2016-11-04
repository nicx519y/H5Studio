import { Component, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';
import { PagesService } from '../pages.service';

@Component({
  selector: 'ide-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css']
})
export class PageListComponent implements OnInit {

  private model;

	@ViewChildren('nameInput')
	nameInputList: QueryList<ElementRef>;

	constructor(
		private services: PagesService
	) {
		this.model = services.pages;
	}

	/**
	 * 新增空白场景
	 */
	addEmptyPageAfterActive() {
		this.services.addEmptyStage( this.services.active + 1, 'new page' );
	}

	/**
	 * 在最后新增空白页
	 */
	addEmptyPageAtLast() {
		this.services.addEmptyStage( this.services.pages.length, 'new page' );
	}

	/**
	 * 删除
	 */
	removeActivePage() {
		this.services.removeStage(this.services.active);
	}
	/**
	 * @dest 上移
	 */
	upActivePage() {
		this.services.upStage(this.services.active);
	}

	/**
	 * @dest 下移
	 */
	downActivePage() {
		this.services.downStage(this.services.active);
	}

	pageActive( index: number ) {
		this.services.active = index;
		this.nameInputList.toArray()[index].nativeElement.focus();
	}

	ngAfterViewInit() {
		this.nameInputList.changes.subscribe( (list: QueryList<ElementRef>) => {
			setTimeout( () => {
				this.nameInputList.toArray()[this.services.active].nativeElement.focus();
			}, 100);
		});
	}

  ngOnInit() {
  }

}