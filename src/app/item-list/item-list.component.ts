import {
	Component,
	ViewChild,
	Output,
	EventEmitter,
	QueryList,
	ElementRef,
	ViewChildren,
	Input,
	OnInit,
	ChangeDetectionStrategy,
} from '@angular/core';
import { ItemsService } from '../items.service';
import { TimelineService } from '../timeline.service';
import { MF, ItemModel, ItemType, ElementModel, ElementType } from '../models';
import { ModalComponent } from '../modal/modal.component';

/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { List, Map } from 'immutable';

@Component({
	selector: 'ide-item-list',
	templateUrl: './item-list.component.html',
	styleUrls: ['./item-list.component.css', '../../assets/modal.form.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemListComponent implements OnInit {

	@ViewChild('modal')
	modal: ModalComponent;

	@ViewChild('nameInput')
	nameInput: ElementRef;

	@Input()
	private model: List<ItemModel>;

	@Input()
	private active: number;

	constructor(
		private service: ItemsService,
		private timelineService: TimelineService,
	) {

	}

	public openCreateItemModal() {
		this.modal.show();
	}

	public removeActiveItem() {
		this.service.removeItem(this.service.active);
		this.changeActive(-1);
	}

	private changeActive(index: number) {
		this.service.active = index;
	}

	private insertActiveItem() {
		let ele: ElementModel = MF.g(ElementModel, {
			type: ElementType.symbol,
			item: this.model.getIn([this.active, 'id']), 
		});

		this.timelineService.addElement(ele);
	}

	private editActiveItem() {
		//...todo
	}

	private addNewEmptyItem(value: { name: string, type: ItemType }) {
		let newItem: ItemModel = MF.g(ItemModel, {
			name: value.name,
			type: Number(value.type)
		});
		this.service.addItem(newItem);
		this.changeActive(this.service.getData().size - 1);
		this.modal.hide();
	}

	private submitItemName(index: number, value: string) {
		this.service.setItem(this.service.getItem(index).set('name', value), index);
	}

	ngOnInit() {

	}

}
