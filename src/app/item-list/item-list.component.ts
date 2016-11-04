import { 
	Component, 
	ViewChild, 
	Output, 
	EventEmitter,
	QueryList,
	ElementRef,
	ViewChildren,
  OnInit
} from '@angular/core';
import { ItemsService } from '../items.service';
import { ItemModel, ItemType } from '../models';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'ide-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css', '../../assets/modal.form.css']
})
export class ItemListComponent implements OnInit {

  @ViewChildren('itemContainer')
	itemsEle: QueryList<ElementRef>;

	@ViewChild('modal')
	modal: ModalComponent;

	@ViewChild('nameInput')
	nameInput: ElementRef;

	private options: Array<ItemModel>;
	private lastChange: 'added' | 'removed';

	constructor(
		private service: ItemsService
	) {
		this.options = service.items;
		
	}

	public addItem() {
		this.modal.show();
	}

	public removeItem() {
		this.service.removeItem(this.service.active);
		this.service.active = -1;
		this.lastChange = 'removed';
	}

	public editItem() {
		this.service.editItem(this.service.active);
	}

	public insertItem() {
		this.service.insertItem(this.service.active);
	}

	public changeActive(index: number) {
		this.service.active = index;
	}

	private addNewItem(value: { name: string, type: ItemType }) {
		this.service.addItem({
			thumbnail: '',
			name: value.name,
			type: Number(value.type)
		});
		this.changeActive(this.options.length - 1);
		this.modal.hide();
	}

  ngOnInit() {
  }

}
