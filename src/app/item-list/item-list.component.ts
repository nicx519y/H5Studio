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
import { MF, ItemModel, ItemType, PageModel, ElementModel, ElementType } from '../models';
import { ModalComponent } from '../modal/modal.component';

/// <reference path="immutable/dist/immutable.d.ts" />
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

	@Input()
	private editedPage: string;

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

		this.timelineService.addElement(ele, this.model.getIn([this.active, 'name']));
	}

	private editActiveItem() {
		this.timelineService.registerDataSource(this.service, [this.active, 'source']);
	}

	private addNewEmptyItem(value: { name: string, type: ItemType }) {
		let source: any;
		if(value.type == ItemType.movieclip) {
			source = MF.g(PageModel, {
				name: value.name
			});
		}
		let newItem: ItemModel = MF.g(ItemModel, {
			name: value.name,
			type: Number(value.type),
			source: source,
		});
		this.service.addItem(newItem);
		this.changeActive(this.service.getData().size - 1);
		this.modal.hide();
	}

	private submitItemName(index: number, value: string) {
		let item = this.service.getItem(index).set('name', value);
		if(this.service.getItem(index).get('type') === ItemType.movieclip) {
			item = item.setIn(['source', 'name'], value);
		}
		this.service.setItem(item, index);
	}

	private isEditedPage(index: number) {
		if(!this.model || !this.editedPage) return false;
		let item = this.model.get(index);
		if(item.get('type') !== ItemType.movieclip)
			return false;
		return item.getIn(['source', 'id']) === this.editedPage;
	}

	ngAfterViewInit() {
	}

	ngOnInit() {

	}

}
