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
	hoverChangeEvent: EventEmitter<{
		layer: string,
		hoverIndex: number
	}> = new EventEmitter<{
		layer: string,
		hoverIndex: number
	}>();

	@Output()
	actionChangeEvent: EventEmitter<{
		layer: string,
		start: number,
		duration: number
	}> = new EventEmitter<{
		layer: string,
		start: number,
		duration: number
	}>();

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

	private moveOption: {
		start: number,
		duration: number,
		handlerOffset: number,
		offset: number
	} = {
		start: -1,
		duration: 0,
		handlerOffset: -1,
		offset: 0
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
		this.hoverChangeEvent.emit({
			hoverIndex: idx,
			layer: this.id
		});

		let ac = this.actionOption;

		//不是在移动模式
		if (this.moveOption.handlerOffset < 0) {
			if (this.mouseIsDown && ac.start >= 0) {
				let duration = idx - ac.start + 1;
				if (duration <= 0)
					duration -= 1;
				this.actionChangeEvent.emit({
					start: ac.start,
					duration: duration,
					layer: this.id
				});
			}
		} else {	//移动模式
			let newStart: number = Math.max(idx - this.moveOption.handlerOffset, 0);
			this.actionChangeEvent.emit({
				start: newStart,
				duration: ac.duration,
				layer: this.id
			});
		}
	}

	@HostListener('mouseout', ['$event'])
	private mouseOut(evt: MouseEvent) {
		this.hoverChangeEvent.emit({
			hoverIndex: -1,
			layer: this.id
		});
		this.mouseIsDown = false;
	}

	@HostListener('mousedown', ['$event'])
	private mouseDown(evt: MouseEvent) {
		let mx: number = evt.offsetX;
		let ac = this.actionOption;

		if (evt.shiftKey && ac.start >= 0) {
			let duration = Math.floor(mx / FRAME_WIDTH) - ac.start + 1;
			if (duration <= 0)
				duration -= 1;
			this.actionChangeEvent.emit({
				start: ac.start,
				duration: duration,
				layer: this.id
			});
		} else {
			let idx: number = Math.floor(mx / FRAME_WIDTH);
			//在已选择区域内
			if (idx >= ac.start && idx < ac.start + ac.duration) {
				this.moveOption = {
					start: ac.start,
					duration: ac.duration,
					handlerOffset: idx - ac.start,
					offset: 0
				}
			} else {	//在已选择区域外
				this.actionChangeEvent.emit({ start: Math.floor(mx / FRAME_WIDTH), duration: 1, layer: this.id });
			}
		}

		this.mouseIsDown = true;
	}

	@HostListener('mouseup', ['$event'])
	private mouseUp(evt: MouseEvent) {
		let mc = this.moveOption;
		let mx: number = evt.offsetX;
		let idx: number = Math.floor(mx / FRAME_WIDTH);
		let newStart: number = Math.max(idx - this.moveOption.handlerOffset, 0);
		if (mc.start >= 0) {
			let nmc = {
				start: mc.start,
				duration: mc.duration,
				offset: newStart - mc.start,
				handlerOffset: mc.handlerOffset
			};

			if (nmc.start != mc.start || nmc.duration != mc.duration || nmc.offset != mc.offset) {
				this.actionMoveEvent.emit({
					start: mc.start,
					duration: mc.duration,
					offset: newStart - mc.start,
					layer: this.id
				});
				this.moveOption = nmc;
			}
		}

		this.mouseIsDown = false;

		this.moveOption = {	//reset
			start: -1,
			handlerOffset: -1,
			duration: 0,
			offset: 0
		};
	}

	ngAfterViewInit() {
		let self = this;
		this.hoverIndex = -1;
		this.resetAction();
	}

	ngOnInit() {
	}

}
