import { Component, ViewChildren, ElementRef, Input, QueryList, EventEmitter, OnInit } from '@angular/core';
import { TimelineService } from '../timeline.service';
import { TimelineModel, LayerModel, TweenType } from '../models';
import { LayerComponent } from '../layer/layer.component';

@Component({
	selector: 'ide-timeline',
	templateUrl: './timeline.component.html',
	styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

	@ViewChildren(LayerComponent)
	layers: QueryList<LayerComponent>;

	private lastHoverLayer: string = null;
	private lastActionLayer: string = null;

	constructor(
		private service: TimelineService
	) {
	}

	public removeLayer() {
		let actionLayer: string = this.service.timeline.actionOption.layer;
		if( !actionLayer ) return;
		this.service.removeLayer( actionLayer );
	}

	public upLayer() {
		let actionLayer: string = this.service.timeline.actionOption.layer;
		if( !actionLayer ) return;
		this.service.upLayer( actionLayer );
	}

	public downLayer() {
		let actionLayer: string = this.service.timeline.actionOption.layer;
		if( !actionLayer ) return;
		this.service.downLayer( actionLayer );
	}

	public changeToKeyFrames() {
		let op = this.getActionIndexs();
		this.service.changeToKeyFrames( op.index1, op.index2, this.service.timeline.actionOption.layer );
	}

	public changeToEmptyKeyFrames() {
		let op = this.getActionIndexs();
		this.service.changeToEmptyKeyFrames( op.index1, op.index2, this.service.timeline.actionOption.layer );
	}

	public changeToFrames() {
		let op = this.getActionIndexs();
		this.service.changeToFrames( op.index1, op.index2, this.service.timeline.actionOption.layer );
	}

	public removeKeyFrames() {
		let op = this.getActionIndexs();
		this.service.removeKeyFrames( op.index1, op.index2, this.service.timeline.actionOption.layer );
	}

	public removeFrames() {
		let op = this.getActionIndexs();
		this.service.removeFrames( op.index1, op.index2, this.service.timeline.actionOption.layer );
	}
	
	public createTweens() {
		let op = this.getActionIndexs();
		this.service.createTweens( op.index1, op.index2, this.service.timeline.actionOption.layer );
	}

	public removeTweens() {
		let op = this.getActionIndexs();
		this.service.removeTweens( op.index1, op.index2, this.service.timeline.actionOption.layer );
	}

	public moveFrames( index1: number, index2: number, offset: number, layer: string ) {
		this.service.moveFrames( index1, index2, offset, layer );
	}

	public layerHoverChangeHandler( hoverOption: { hoverIndex: number, layer: string } ) {
		if(this.lastHoverLayer != hoverOption.layer && this.lastHoverLayer != null) {
			let lastHoverLayer: LayerComponent = this.getLayerById( this.lastHoverLayer ); 
			lastHoverLayer && ( lastHoverLayer.hoverIndex = -1 );
		}
		this.lastHoverLayer = hoverOption.layer;
		this.getLayerById( hoverOption.layer ).hoverIndex = hoverOption.hoverIndex;
	}

	public layerActionChangeHandler( actionOption: { start: number, duration: number, layer: string } ) {
		if(this.lastActionLayer != actionOption.layer && this.lastActionLayer != null) {
			let lastActionLayer: LayerComponent = this.getLayerById( this.lastActionLayer );
			lastActionLayer && lastActionLayer.resetAction();
		}
		this.lastActionLayer = actionOption.layer;
		this.getLayerById( actionOption.layer ).action = {
			start: actionOption.start,
			duration: actionOption.duration
		};

		this.service.timeline.actionOption = actionOption;
	}

	public layerActionMoveHandler( actionMoveOption: { start: number, duration: number, offset: number, layer: string } ) {
		let mc = actionMoveOption;
		this.moveFrames( mc.start, mc.duration + mc.start - 1, mc.offset, mc.layer );
	}

	/**
	 * @desc	改变可见状态
	 */
	public toggleVisible( layerId: string ) {
		let layer: LayerModel = this.service.getLayerById( layerId );
		layer.visible = !layer.visible;
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

	ngOnInit() {
	}

}
