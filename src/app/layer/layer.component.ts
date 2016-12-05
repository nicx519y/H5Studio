import { Component, Input, Output, ElementRef, ViewChild, EventEmitter, HostListener, OnInit } from '@angular/core';
import { FrameModel, LayerModel } from '../models';

const FRAME_WIDTH: number = 9;

@Component({
	selector: 'ide-layer',
	templateUrl: './layer.component.html',
	styleUrls: ['./layer.component.css']
})
export class LayerComponent implements OnInit {

	@Input()
	option: LayerModel;

	@Input()
	scaleFrame: number;					//每帧刻度

	@Output()
	mouseActionEvent: EventEmitter<{
		event: MouseEvent,
		frameIdx: number,
		layerId: string
	}> = new EventEmitter();

	@Output()
	actionMoveEvent: EventEmitter<{
		layer: string,
		start: number,
		duration: number,
		offset: number
	}> = new EventEmitter<{
		layer: string,
		start: number,
		duration: number,
		offset: number
	}>();

	@ViewChild('hover')
	hoverEle: ElementRef;

	@ViewChild('action')
	actionEle: ElementRef;

	private mouseIsDown: boolean = false;

	private actionOption: {
		start: number,
		duration: number
	} = {
		start: -1,
		duration: 0
	};

	constructor(
		private container: ElementRef
	) {

	}

	public resetAction() {
		this.actionOption = {
			start: -1,
			duration: 0
		};
		this.action = this.actionOption;
	}

	public set hoverIndex(index: number) {
		this.hoverEle.nativeElement.style.left = index * FRAME_WIDTH + 'px';
	}

	@Input()
	public set action(option: { start: number, duration: number }) {
		if (option.duration >= 0) {
			this.actionEle.nativeElement.style.left = option.start * FRAME_WIDTH + 'px';
			this.actionEle.nativeElement.style.width = FRAME_WIDTH * option.duration + 'px';
			this.actionOption = option;
		} else {
			this.actionEle.nativeElement.style.left = (option.start + option.duration) * FRAME_WIDTH + 'px';
			this.actionEle.nativeElement.style.width = FRAME_WIDTH * (- option.duration + 1) + 'px';
			this.actionOption = option;
		}
	}

	public get id(): string {
		return this.option.id;
	}

	@HostListener('mousemove', ['$event'])
	private mouseMove(evt: MouseEvent) {
		let mx: number = evt.offsetX;
		let idx: number = Math.floor(mx / FRAME_WIDTH);
		this.mouseActionEvent.emit({
			event: evt,
			frameIdx: idx,
			layerId: this.id
		});
	}

	@HostListener('mouseout', ['$event'])
	private mouseOut(evt: MouseEvent) {
		let mx: number = evt.offsetX;
		let idx: number = Math.floor(mx / FRAME_WIDTH);
		this.mouseActionEvent.emit({
			event: evt,
			frameIdx: idx,
			layerId: this.id
		});
	}

	@HostListener('mousedown', ['$event'])
	private mouseDown(evt: MouseEvent) {
		let mx: number = evt.offsetX;
		let idx: number = Math.floor(mx / FRAME_WIDTH);
		this.mouseActionEvent.emit({
			event: evt,
			frameIdx: idx,
			layerId: this.id
		});
	}

	@HostListener('mouseup', ['$event'])
	private mouseUp(evt: MouseEvent) {
		let mx: number = evt.offsetX;
		let idx: number = Math.floor(mx / FRAME_WIDTH);
		this.mouseActionEvent.emit({
			event: evt,
			frameIdx: idx,
			layerId: this.id
		});
	}

	ngAfterViewInit() {
		let self = this;
		this.hoverIndex = -1;
		this.resetAction();
	}

	ngOnInit() {
	}

}
