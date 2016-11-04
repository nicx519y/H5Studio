import {
	Component,
	Input,
	Output,
	EventEmitter,
	ElementRef,
	ViewChild,
	ViewChildren,
	QueryList,
	OnInit,
} from '@angular/core';

@Component({
	selector: 'ide-panel',
	templateUrl: './panel.component.html',
	styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

	@Input()
	title: string = '';

	@Input()
	isOpen: boolean = true;

	@Input()
	hasTitle: boolean = true;

	@Input()
	hasTools: boolean = false;

	@Input()
	closeAble: boolean = true;

	@Input()
	autoHeight: number = 0;

	/**
	 * @desc 关闭和开启状态改变事件
	 */
	@Output()
	stateChange: EventEmitter<any> = new EventEmitter();

	/**
	 * @desc 主容器
	 */
	@ViewChild('container')
	container: ElementRef;

	/**
	 * @desc title容器
	 */
	@ViewChild('titleContainer')
	titleContainer: ElementRef;

	/**
	 * @desc content容器
	 */
	@ViewChild('contentContainer')
	contentContainer: ElementRef;

	/**
	 * @desc tools容器
	 */
	@ViewChild('toolsContainer')
	toolsContainer: ElementRef;

	/**
	 * @desc content容器集合，用于监听状态改变
	 */
	@ViewChildren('contentContainer')
	contentContainers: QueryList<ElementRef>;

	constructor() {

	}

	open() {
		this.isOpen = true;
	}

	close() {
		if (this.closeAble)
			this.isOpen = false;
	}

	toggle() {
		if (this.isOpen)
			this.close();
		else
			this.open();
	}

	get height() {
		return this.container.nativeElement.clientHeight;
	}

	set height(h: number) {
		if (!this.isOpen) return;
		this.container.nativeElement.style.height = h + 'px';
	}

	resetHeight() {
		if (!this.isOpen) {
			this.container.nativeElement.style.height = 'auto';
		} else {
			if (this.autoHeight <= 0) {
				this.container.nativeElement.style.height = 'auto';
			} else {
				this.container.nativeElement.style.height = this.autoHeight + 'px';
			}
		}
	}

	scrollTo(n: number) {
		this.contentContainer.nativeElement.scrollTop = n;
	}

	ngAfterViewInit() {
		this.contentContainers.changes.subscribe(() => {
			if (this.isOpen) {
				this.resetHeight();
			}
			this.stateChange.emit();
		});
	}

	ngOnInit() {
	}

}
