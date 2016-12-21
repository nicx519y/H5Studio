import { Injectable, QueryList, Output, EventEmitter } from '@angular/core';
import { 
	LayerModel,
	FrameModel,
	ElementModel,
	TimelineModel,
	ElementStateModel,
	TweenModel,
	TweenType,
	LayerType,
	ElementType
} from './models';


@Injectable()
export class TimelineService {
	private _timeline: TimelineModel = new TimelineModel();
	private _stageId: string = '';
	private _stageName: string = '';
	private _stageType: string = 'page';
	private _dataChangeTimer: any;

	@Output()
	public dataChangeEvent: EventEmitter<TimelineService> = new EventEmitter();

	constructor() {
		
	}
	/**
	 * @desc	新增element到最上层，每新增一个element会同时新增一个layer
	 * @param	{ element }	添加的ElemntModel
	 */
	public addElement(element: ElementModel) {

		let newKeyFrame: FrameModel = new FrameModel({
			name: '',
			isKeyFrame: true,
			isEmpty: false,
			index: 0,
			elementState: new ElementStateModel()
		});

		let newLayer: LayerModel = new LayerModel({
			name: 'New Element',
			type: LayerType.normal,
			element: element,
			frames: [
				newKeyFrame
			]
		});

		this.timeline.layers.push(newLayer);

		this.dataChange();
	}
	/**
	 * @desc	删除一个element
	 * @param	{ elementId }	需要删除的elementModel id
	 */
	public removeElement(elementId: string) {
		this.timeline.removeLayersWithElement( ( ele: ElementModel ) => {
			return ele.id === elementId;
		});

		this.dataChange();
	}

	/**
	 * @desc	删除一个图层
	 * @param	{ layerId }		需要删除的图层id
	 */
	public removeLayers(layerIds: string[]) {
		this.timeline.removeLayers( ( layer: LayerModel ) => {
			return (layerIds.indexOf(layer.id) >= 0);
		});
		this.dataChange();
	}

	public upLayers(layerIds: string[]) {
		if(layerIds.length <= 0) return;
		let layers: LayerModel[] = this.timeline.layers;
		if(layerIds.indexOf(layers[0].id) >= 0) return;
		let ids: string[] = layerIds.concat();
		ids.sort((a, b) => {
			let idx1: number = layers.findIndex(layer => {return layer.id == a});
			let idx2: number = layers.findIndex(layer => {return layer.id == b});
			if(idx2 > idx1) return -1;
			else if(idx2 < idx1) return 1;
			else return 0;
		});

		ids.forEach(id => this.upLayer(id));
		this.dataChange();
	}

	/**
	 * @desc	上移图层
	 */
	private upLayer( layerId: string ){
		let layerIndex: number = this.timeline.layers.findIndex( layer => {
			return (layer.id === layerId);
		});
		if( layerIndex <= 0 ){
			return;
		} else {
			let temp: LayerModel = this.timeline.layers[layerIndex];
			this.timeline.layers[layerIndex] = this.timeline.layers[layerIndex - 1];
			this.timeline.layers[layerIndex - 1] = temp;
		}
	}

	public downLayers(layerIds: string[]) {
		if(layerIds.length <= 0) return;
		let layers: LayerModel[] = this.timeline.layers;
		if(layerIds.indexOf(layers[layers.length - 1].id) >= 0) return;
		let ids: string[] = layerIds.concat();
		ids.sort((a, b) => {
			let idx1: number = layers.findIndex(layer => {return layer.id == a});
			let idx2: number = layers.findIndex(layer => {return layer.id == b});
			if(idx2 > idx1) return 1;
			else if(idx2 < idx1) return -1;
			else return 0;
		});
		ids.forEach(id => this.downLayer(id));
		this.dataChange();
	}

	/**
	 * @desc	下移图层
	 */
	private downLayer( layerId: string ){
		let layerIndex: number = this.timeline.layers.findIndex( layer => {
			return (layer.id === layerId);
		});
		if( layerIndex < 0 || layerIndex >= this.timeline.layers.length - 1 ){
			return;
		} else {
			let temp: LayerModel = this.timeline.layers[layerIndex];
			this.timeline.layers[layerIndex] = this.timeline.layers[layerIndex + 1];
			this.timeline.layers[layerIndex + 1] = temp;
		}
	}

	/**
	 * @desc	交换两个layer的层级
	 */
	public swapLayerIndex(layerId1: string, layerId2: string): boolean {
		
		let idx1: number = this.timeline.layers.findIndex((value: LayerModel) => {
			return (value.id === layerId1);
		});

		let idx2: number = this.timeline.layers.findIndex((value: LayerModel) => {
			return (value.id === layerId2);
		});

		if(idx1 >= 0 && idx2 >= 0) {
			let temp: LayerModel = this.timeline.layers[idx2];
			this.timeline.layers[idx2] = this.timeline.layers[idx1];
			this.timeline.layers[idx1] = temp;
			this.dataChange();
			return true;
		}

		return false;
	}

	/**
	 * @desc	转换成关键帧
	 * @param	{ index1 }	起始帧序号
	 * @param	{ index2 }	结束帧序号
	 * @param	{ layerIds }	要操作的图层ID
	 */
	public changeToKeyFrames( index1: number, index2: number, layerIds: string[] ) {
		layerIds.forEach(id => {
			let layer: LayerModel = this.getLayerById(id);
			layer && layer.changeToKeyFrames(index1, index2);
		});
		this.dataChange();
	}

	public changeToEmptyKeyFrames( index1: number, index2: number, layerIds: string[] ) {
		layerIds.forEach(id => {
			this.getLayerById(id).changeToEmptyKeyFrames(index1, index2);
		});
		this.dataChange();
	}

	/**
	 * @desc	增加新的普通帧
	 * @param	{ index1 }	起始帧序号
	 * @param	{ index2 }	结束帧序号
	 * @param	{ layerIds }	要操作的图层ID
	 */
	public changeToFrames( index1: number, index2: number, layerIds: string[] ) {
		layerIds.forEach(id => {
			this.getLayerById(id).changeToFrames(index1, index2);
		});
		this.dataChange();
	}

	/**
	 * @desc	移除关键帧属性
	 * @param	{ index1 }	起始帧序号
	 * @param	{ index2 }	结束帧序号
	 * @param	{ layerId }	要操作的图层ID
	 */
	public removeKeyFrames( index1: number, index2: number, layerIds: string[] ) {
		layerIds.forEach(id => {
			this.getLayerById(id).removeKeyFrames(index1, index2);
		});
		this.dataChange();
	}

	/**
	 * @desc	删除帧（包括关键帧）
	 * @param	{ index1 }	起始帧序号
	 * @param	{ index2 }	结束帧序号
	 * @param	{ layerId }	要操作的图层ID
	 */
	public removeFrames( index1: number, index2: number, layerIds: string[] ) {
		layerIds.forEach(id => {
			this.getLayerById(id).removeFrames(index1, index2);
		});
		this.dataChange();
	}
	
	/**
	 * @desc	创建一个动画
	 * @param	{ index }	创建帧序号
	 * @param	{ layerId }	要操作的图层ID
	 */
	public createTweens( index1: number, index2: number, layerIds: string[], tweenType: TweenType = TweenType.normal ) {
		layerIds.forEach(id => {
			this.getLayerById( id ).createTweens( index1, index2, tweenType );
			this.dataChange();
		});
	}

	/**
	 * @desc	删除一个动画
	 * @param	{ index }	删除帧序号
	 * @param	{ layerId }	作用图层ID
	 */
	public removeTweens( index1: number, index2: number, layerIds: string[] ) {
		layerIds.forEach(id => {
			this.getLayerById( id ).removeTweens( index1, index2 );
			this.dataChange();
		});
	}

	/**
	 * @desc	移动一些帧
	 */
	public moveFrames( index1: number, index2: number, offset: number, layerIds: string[] ) {
		layerIds.forEach(id => {
			this.getLayerById( id ).moveFrames( index1, index2, offset );
			this.dataChange();
		});
	}

	public getLayerById( id: string ): LayerModel {
		return this.timeline.layers.find((layer: LayerModel) => {
			return ( layer.id === id );
		});
	}

	public get timeline(): TimelineModel {
		return this._timeline;
	}

	public get stageId(): string {
		return this._stageId;
	}

	public get stageName(): string{
		return this._stageName;
	}

	public get stageType(): string{
		return this._stageType;
	}


	public setTimeline(stageOptions: {
		id: string,
		name: string,
		type: string,
		timeline: TimelineModel,
	}) {
		console.log(stageOptions);
		if(this._stageId != stageOptions.id) {
			this._stageId = stageOptions.id;
			this._stageType = stageOptions.type;
			this._stageName = stageOptions.name;
			this._timeline = stageOptions.timeline;
			// this.dataChange();
		}
	}

	/**
	 * @desc	改变一个关键帧的状态
	 * @returns	FrameModel[]
	 */
	public changeKeyFramesState(frameIdx: number, changes: {layerId: string, frame: any}[] = []): FrameModel[] {
		let frameArr: FrameModel[] = changes.map(change => {
			return this.timeline.layers.find(l => { return l.id == change.layerId })
				.frames.find(f => { return f.index == frameIdx })
					.init(change.frame);
		});
		this.dataChange();
		return frameArr;
	}

	/**
	 * @desc	改变可见状态
	 */
	public toggleVisible( layerId: string ) {
		let layer: LayerModel = this.getLayerById( layerId );
		if(layer.element) {
			layer.element.visible = !layer.element.visible;
			this.dataChange();
		}
	}

	public dataChange() {
		clearTimeout(this._dataChangeTimer);
		this._dataChangeTimer = setTimeout(() => {
			this.dataChangeEvent.emit(this);
		}, 50);
	}
	
}