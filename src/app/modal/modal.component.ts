import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

@Component({
	selector: 'ide-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

	@ViewChild('smModal')
	public childModal: ModalDirective;

	@Input()
	public title: string;

	@Input()
	public width: number;

	@Output()
	public onShow: EventEmitter<ModalComponent> = new EventEmitter();

	@Output()
	public onShown: EventEmitter<ModalComponent> = new EventEmitter();

	@Output()
	public onHide: EventEmitter<ModalComponent> = new EventEmitter();

	@Output()
	public onHidden: EventEmitter<ModalComponent> = new EventEmitter();

	constructor() {

	}

	public show() {
		this.childModal.show();
	}

	public hide() {
		this.childModal.hide();
	}

	ngAfterViewInit() {
		this.childModal.onShow.subscribe(() => {
			this.onShow.emit(this);
		});
		this.childModal.onShown.subscribe(() => {
			this.onShown.emit(this);
		});
		this.childModal.onHide.subscribe(() => {
			this.onHide.emit(this);
		});
		this.childModal.onHidden.subscribe(() => {
			this.onHidden.emit(this);
		});
	}

	ngOnInit() {
	}

}
