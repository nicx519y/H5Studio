import { Component, ViewChild, ViewChildren, ElementRef, Input, Output, QueryList, OnInit, OnDestroy, AfterViewInit, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { TimelineService } from '../timeline.service';
import { MF, LayerModel, TweenType, FrameModel, ElementModel, TweenModel } from '../models';
import { LayerComponent } from '../layer/layer.component';
import { TimelineRulerComponent } from '../timeline-ruler/timeline-ruler.component';

/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { List, Map } from 'immutable';

const FRAME_WIDTH: number = 9;
const LAYER_HEIGHT: number = 23;
const LAYER_GAP: number = 0;

@Component({
	selector: 'ide-timeline',
	templateUrl: './timeline.component.html',
	styleUrls: ['./timeline.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnInit {

	@ViewChildren(LayerComponent)
	layers: QueryList<LayerComponent>;
	
	@ViewChild('timelineContainer')
	tlContainer: ElementRef;

	@ViewChild('timelineBox')
	timelineBox: ElementRef;

	@ViewChild('ruler')
	ruler: TimelineRulerComponent;

	@ViewChild('hoverRanger')
	hoverRanger: ElementRef;

	@ViewChild('marking')
	marking: ElementRef;

	@Input()
	model: List<LayerModel>;

	@Input()
	activeOptions: List<Map<string, any>>;

	@Input()
	frameCount: number;

	private frameWidth: number = FRAME_WIDTH;
	private isRange: boolean;
	private range: number[] = [-1, -1, -1, -1];

	constructor(
		private service: TimelineService
	) {
	}


	public removeActiveElements() {
		let ids: string[] = this.getActiveElements();
		this.service.removeElements(ids);
	}

	public upActiveElements() {
		let ids: string[] = this.getActiveElements();
		this.service.upElements(ids);
	}

	public downActiveElements() {
		let ids: string[] = this.getActiveElements();
		this.service.downElements(ids);
	}

	public changeActiveToKeyFrames() {
		this.service.setTimelineData(this.service.setToKeyFrames(this.activeOptions.toJS()));
	}

	public changeActiveToEmptyKeyFrames() {
		this.service.setTimelineData(this.service.setToKeyFrames(this.activeOptions.toJS(), { isEmptyFrame: true }));
	}

	public changeActiveToFrames() {
		this.service.setTimelineData(this.service.changeToFrames(this.activeOptions.toJS()));
	}

	public removeActiveKeyFrames() {
		this.service.setTimelineData(this.service.removeKeyFrames(this.activeOptions.toJS()));
	}

	public removeActiveFrames() {
		this.service.setTimelineData(this.service.removeFrames(this.activeOptions.toJS()));
	}
	
	public createActiveTweens() {
		this.service.setTimelineData(this.service.setTweens(this.activeOptions.toJS()));
	}

	public removeActiveTweens() {
		console.log('remove tweens.');
		this.service.setTimelineData(this.service.setTweens(this.activeOptions.toJS(), {
			type: TweenType.none,
			tween: MF.g(TweenModel),
		}));
	}

	/**
	 * 获取被选中的所有element索引值
	 */
	private getActiveElements(): string[] {
		return this.activeOptions.map(ao => ao.get('elementId')).toJS();
	}

	/**
	 * 用于改变element的被选中状态
	 */
	private isElementActive(eleId: string): boolean {
		if(!this.activeOptions || this.activeOptions.size <= 0) return false;
		let activeOption: Map<string, any> = this.activeOptions.find(ao => ao.get('elementId') === eleId);
		if(!activeOption) return false;
		return (activeOption.get('start') >= 0 && activeOption.get('duration') > 0);
	}

	private toggleElementVisible(eleId: string) {
		let index: number = this.model.findIndex(layer => layer.getIn(['element', 'id']) === eleId);
		if(index < 0) return;
		let isVisible: boolean = this.model.getIn([index, 'element', 'visible']);
		this.service.setTimelineData(this.model.setIn([index, 'element', 'visible'], !isVisible));
	}

	private timelineBoxMouseEventHandler(evt: MouseEvent) {
		let x: number = evt.offsetX;
		let y: number = evt.offsetY;
		let pos = this.getFramePosition(x, y);
		switch(evt.type) {
			case 'mouseup':
				this.service.setActiveOptions(this.range);
				this.isRange = false;
				break;
			case 'mousedown':
				this.isRange = true;
				this.range = [pos.frame, pos.layer, pos.frame, pos.layer];
				break;
			case 'mousemove':
				if(!this.isRange) {
					this.range = [pos.frame, pos.layer, pos.frame, pos.layer];
				} else {
					this.range[2] = pos.frame;
					this.range[3] = pos.layer;
				}

				this.markingPositionChange(pos.frame);

				break;
			case 'mouseout':
				this.isRange = false;
				this.range = [-1, -1, -1, -1];

				this.markingPositionChange();

				break;
		}
		this.setHoverRanger();
	}

	private scrollHandler(evt: Event) {
		this.ruler.render( (evt.target as Element).scrollLeft );
	}

	private setHoverRanger() {
		if(this.range.length < 4) return;
		let frame1 = Math.min(this.range[0], this.range[2]);
		let layer1 = Math.min(this.range[1], this.range[3]);
		let frame2 = Math.max(this.range[0], this.range[2]);
		let layer2 = Math.max(this.range[1], this.range[3]);
		let ne = this.hoverRanger.nativeElement;
		ne.style.left = FRAME_WIDTH * frame1 + 'px';
		ne.style.top = (LAYER_HEIGHT + LAYER_GAP) * layer1 + 'px';
		ne.style.width = (frame2 - frame1 + 1) * FRAME_WIDTH + 'px';
		ne.style.height = (layer2 - layer1 + 1) * (LAYER_HEIGHT + LAYER_GAP) - LAYER_GAP + 'px'; 
	}

	private getFramePosition(x: number, y: number): {
		frame: number, layer: number,
	} {
		let fidx: number = Math.floor(x / FRAME_WIDTH);
		let lidx: number = Math.floor(y / (LAYER_HEIGHT + LAYER_GAP));
		return {
			frame: fidx,
			layer: lidx,
		};
	}

	private markingPositionChange(frame: number = -1) {
		this.marking.nativeElement.style.left = frame * this.frameWidth + 'px';
	}

	/**
	 * 设置layer component的active状态
	 */
	private setLayersActive() {
		if(!this.layers) return;
		let eles: string[] = this.getActiveElements();
		let aos = this.activeOptions;
		this.layers.forEach(layer => {
			let eleId = layer.elementId;
			if(eles.indexOf(eleId) >= 0) {
				layer.changeActiveOptions(aos.find(ao => ao.get('elementId') === eleId));
			} else {
				layer.changeActiveOptions();
			}
		});
	}

	/**
	 * 更改一个图层的name
	 */
	private submitLayerName(index: number, value: string) {
		this.service.setTimelineData(this.model.setIn([index, 'name'], value));
	}

	ngOnInit() {

	}

	ngAfterViewInit() {
		this.tlContainer.nativeElement.addEventListener('scroll', this.scrollHandler.bind(this));
		this.timelineBox.nativeElement.addEventListener('mousedown', this.timelineBoxMouseEventHandler.bind(this));
		this.timelineBox.nativeElement.addEventListener('mouseup', this.timelineBoxMouseEventHandler.bind(this));
		this.timelineBox.nativeElement.addEventListener('mousemove', this.timelineBoxMouseEventHandler.bind(this));
		this.timelineBox.nativeElement.addEventListener('mouseout', this.timelineBoxMouseEventHandler.bind(this));
		this.setHoverRanger();
		// this.layers.forEach((layer, index) => layer.changeActiveOptions(this.activeOptions.get(index)));
		this.layers.changes.subscribe(this.setLayersActive.bind(this));
	}

	ngOnDestroy() {
		this.tlContainer.nativeElement.removeEventListener('scroll', this.scrollHandler.bind(this));
		this.timelineBox.nativeElement.removeEventListener('mousedown', this.timelineBoxMouseEventHandler.bind(this));
		this.timelineBox.nativeElement.removeEventListener('mouseup', this.timelineBoxMouseEventHandler.bind(this));
		this.timelineBox.nativeElement.removeEventListener('mousemove', this.timelineBoxMouseEventHandler.bind(this));
		this.timelineBox.nativeElement.removeEventListener('mouseout', this.timelineBoxMouseEventHandler.bind(this));
	}

	ngOnChanges(changes) {
		//设置layer组件的active状态
		if(changes.hasOwnProperty('activeOptions') && this.layers) {
			this.setLayersActive();
		}

		if(changes.hasOwnProperty('model')) {

		}
		
	}

}
