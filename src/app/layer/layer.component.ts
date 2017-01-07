import { Component, Input, Output, ElementRef, ViewChild, EventEmitter, HostListener, OnInit, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { FrameModel, LayerModel } from '../models';

/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { List, Map } from 'immutable';

@Component({
	selector: 'ide-layer',
	templateUrl: './layer.component.html',
	styleUrls: ['./layer.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerComponent implements OnInit {

	@Input()
	private frameWidth: number;

	@Input()
	private model: LayerModel;

	@ViewChild('action')
	actionEle: ElementRef;

	constructor(
		private container: ElementRef
	) {

	}

	public get elementId(): string {
		return this.model.getIn(['element', 'id']);
	}

	public changeActiveOptions(options: Map<string, number> = null) {
		if(!options) {
			options = Immutable.Map({
				start: -1,
				duration: 0,
			});
		}
		if (options.get('duration') > 0) {
			this.actionEle.nativeElement.style.left = options.get('start') * this.frameWidth + 'px';
			this.actionEle.nativeElement.style.width = this.frameWidth * options.get('duration') + 'px';
		} else {
			this.actionEle.nativeElement.style.left = -9 * this.frameWidth + 'px';
			this.actionEle.nativeElement.style.width = 0 + 'px';
		}
	}

	ngOnChanges(changes) {

	}

	ngAfterViewInit() {
		this.changeActiveOptions();
	}

	ngOnInit() {
	}

}
