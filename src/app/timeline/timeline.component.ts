import { Component, ViewChild, ViewChildren, ElementRef, Input, Output, QueryList, OnInit, AfterViewInit } from '@angular/core';
import { TimelineService } from '../timeline.service';
import { TimelineModel, LayerModel, TweenType } from '../models';
import { LayerComponent } from '../layer/layer.component';
import { TimelineRulerComponent } from '../timeline-ruler/timeline-ruler.component';

@Component({
	selector: 'ide-timeline',
	templateUrl: './timeline.component.html',
	styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

	@ViewChildren(LayerComponent)
	layers: QueryList<LayerComponent>;
	
	@ViewChild('timelineContainer')
	tlContainer: ElementRef;

	@ViewChild('ruler')
	ruler: TimelineRulerComponent;

	@ViewChild('marking')
	marking: ElementRef;

	private lastHoverLayer: string = null;
	private lastActionLayer: string = null;
	private scaleFrame: number = 9;				//每帧的宽度
	private actionIsChanging: boolean = false;
	private moveDistance: number = -1;
	private actionStart: {
		layerId: string,
		frameIdx: number
	} = {
		layerId: null,
		frameIdx: -1
	};
	private actionEnd: {
		layerId: string,
		frameIdx: number
	} = {
		layerId: null,
		frameIdx: -1
	};

	constructor(
		private service: TimelineService
	) {
	}

	public removeLayers() {
		let actionLayers: string[] = this.service.timeline.actionOption.layers;
		if( !actionLayers || actionLayers.length <= 0 ) return;
		this.service.removeLayers( actionLayers );
	}

	public upLayers() {
		let actionLayers: string[] = this.service.timeline.actionOption.layers;
		if( !actionLayers || actionLayers.length <= 0 ) return;
		this.service.upLayers( actionLayers );
	}

	public downLayers() {
		let actionLayers: string[] = this.service.timeline.actionOption.layers;
		if( !actionLayers || actionLayers.length <= 0 ) return;
		this.service.downLayers( actionLayers );
	}

	public changeToKeyFrames() {
		let op = this.getActionIndexs();
		this.service.changeToKeyFrames( op.index1, op.index2, this.service.timeline.actionOption.layers );
	}

	public changeToEmptyKeyFrames() {
		let op = this.getActionIndexs();
		this.service.changeToEmptyKeyFrames( op.index1, op.index2, this.service.timeline.actionOption.layers );
	}

	public changeToFrames() {
		let op = this.getActionIndexs();
		this.service.changeToFrames( op.index1, op.index2, this.service.timeline.actionOption.layers );
	}

	public removeKeyFrames() {
		let op = this.getActionIndexs();
		this.service.removeKeyFrames( op.index1, op.index2, this.service.timeline.actionOption.layers );
	}

	public removeFrames() {
		let op = this.getActionIndexs();
		this.service.removeFrames( op.index1, op.index2, this.service.timeline.actionOption.layers );
	}
	
	public createTweens() {
		let op = this.getActionIndexs();
		this.service.createTweens( op.index1, op.index2, this.service.timeline.actionOption.layers );
	}

	public removeTweens() {
		let op = this.getActionIndexs();
		this.service.removeTweens( op.index1, op.index2, this.service.timeline.actionOption.layers );
	}

	public moveFrames( index1: number, index2: number, offset: number, layers: string[] ) {
		this.service.moveFrames( index1, index2, offset, layers );
	}

	private moveFramesStart(frameIdx: number) {
		this.moveDistance = frameIdx - this.service.timeline.actionOption.start;
	}

	private moveingFrames(frameIdx: number) {
		let ao = this.service.timeline.actionOption;
		ao.start = frameIdx - this.moveDistance;
	}
	
	private moveFramesEnd(frameIdx: number, layerId) {
		let ao = this.service.timeline.actionOption;
		if(this.actionStart.frameIdx != ao.start) {
			this.moveingFrames(frameIdx);
			this.moveFrames(this.actionStart.frameIdx, this.actionEnd.frameIdx, ao.start - this.actionStart.frameIdx, ao.layers);
			this.actionStart.frameIdx = ao.start;
			this.actionEnd.frameIdx = ao.start + ao.duration;
			this.moveDistance = -1;
		} else {
			this.moveDistance = -1;
			this.actionChangeStart(frameIdx, layerId);
			this.actionChangeEnd(frameIdx, layerId);
		}
	}

	private layerMouseEventHandler(evt: {
		event: MouseEvent,
		frameIdx: number,
		layerId: string,
	}) {
		if(event.type == 'mousemove') {
			this.hoverChange(evt.frameIdx, evt.layerId);
			if(this.actionIsChanging)
				this.actionChange(evt.frameIdx, evt.layerId);
			else if(this.moveDistance >= 0)
				this.moveingFrames(evt.frameIdx);
		}else if(event.type == 'mouseout') {
			this.hoverChange();
		}else if(event.type == 'mousedown') {
			if(event['shiftKey']) {
				if(this.actionStart.frameIdx >= 0) {
					this.actionIsChanging = true;
					this.actionChangeEnd(evt.frameIdx, evt.layerId);
				}
			} else if(!this.service.timeline.isInAction(evt.frameIdx, evt.layerId)) { 
				this.actionChangeStart(evt.frameIdx, evt.layerId);
			} else {
				this.moveFramesStart(evt.frameIdx);
			}
		}else if(event.type == 'mouseup') {
			if(this.actionIsChanging)
				this.actionChangeEnd(evt.frameIdx, evt.layerId);
			else if(this.moveDistance >= 0) {
				this.moveFramesEnd(evt.frameIdx, evt.layerId);
			}
		}
	}

	private hoverChange(frameIdx: number=-1, layerId: string=null) {
		let lastHoverLayer: LayerComponent;
		if(this.lastHoverLayer && this.lastHoverLayer != '') {
			lastHoverLayer = this.getLayerById(this.lastHoverLayer);
			lastHoverLayer.hoverIndex = -1;
			this.lastHoverLayer = '';
		}
		
		if(layerId && layerId != '') {
			this.getLayerById(layerId).hoverIndex = frameIdx;
			this.lastHoverLayer = layerId;
		}

		this.marking.nativeElement.style.left = frameIdx * this.scaleFrame + 'px';
	}

	private actionChangeStart(frameIdx: number, layerId: string) {
		this.actionIsChanging = true;
		this.actionStart.layerId = layerId;
		this.actionStart.frameIdx = frameIdx;
		this.actionEnd.layerId = null;
		this.actionEnd.frameIdx = -1;
		let ao = this.service.timeline.actionOption;
		ao.layers.length = 0;
		ao.layers.push(layerId);
		ao.start = frameIdx;
		ao.duration = 1;
	}

	private actionChange(frameIdx: number, layerId: string) {
		if(!this.actionIsChanging) return;
		let layers: LayerModel[] = this.service.timeline.layers;
		let ao = this.service.timeline.actionOption;
		let layerStartIdx: number = layers.findIndex(layer => {return layer.id == this.actionStart.layerId});
		let layerEndIdx: number = layers.findIndex(layer => {return layer.id == layerId});
		let oldLayerEndIdx: number = layers.findIndex(layer => {return layer.id == this.actionEnd.layerId});
		if(oldLayerEndIdx != layerEndIdx) {
			ao.layers.length = 0;
			for(let i: number = Math.min(layerStartIdx, layerEndIdx); i <= Math.max(layerEndIdx, layerStartIdx); i ++)
				ao.layers.push(layers[i].id);
		}
		ao.start = Math.min(this.actionStart.frameIdx, frameIdx);
		ao.duration = Math.abs(this.actionStart.frameIdx - frameIdx) + 1;
		this.actionEnd.layerId = layerId;
		this.actionEnd.frameIdx = frameIdx;
	}

	private actionChangeEnd(frameIdx: number, layerId: string) {
		this.actionChange(frameIdx, layerId);
		this.actionIsChanging = false;
	}
 
	/**
	 * @desc	改变可见状态
	 */
	public toggleVisible( layerId: string ) {
		let layer: LayerModel = this.service.getLayerById( layerId );
		if(layer.element) {
			layer.element.visible = !layer.element.visible;
		}
	}

	private getLayerById( id: string ): LayerComponent {
		let layer: LayerComponent = this.layers.filter( item => {
			return item.id == id; 
		} )[0];
		return layer;
	}

	/**
	 * 根据actionOption获取起始帧和末尾帧
	 */
	private getActionIndexs(): { index1: number, index2: number } {
		let ac = this.service.timeline.actionOption;
		if( ac.duration >= 0 ) {
			return {
				index1: ac.start,
				index2: ac.start + ac.duration - 1
			}
		} else {
			return {
				index1: ac.start + ac.duration,
				index2: ac.start
			}
		}
	}

	public getLayerAction(layerId: string) {
		let ao = this.service.timeline.actionOption;
		if(ao.layers.indexOf(layerId) >= 0) {
			return {
				start: ao.start,
				duration: ao.duration
			};
		} else {
			return {
				start: -1,
				duration: 0
			}
		}
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		this.tlContainer.nativeElement.addEventListener('scroll', (evt: Event) => {
			this.ruler.render( (evt.target as Element).scrollLeft );
		});
	}

}
