import { Injectable, QueryList } from '@angular/core';
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
	timeline: TimelineModel = new TimelineModel();
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
			name: element.source.name,
			type: LayerType.normal,
			element: element,
			frames: [
				newKeyFrame
			]
		});

		this.timeline.layers.push(newLayer);
	}
	/**
	 * @desc	删除一个element
	 * @param	{ elementId }	需要删除的elementModel id
	 */
	public removeElement(elementId: string) {
		this.timeline.removeLayerWithElement( ( ele: ElementModel ) => {
			return ele.id === elementId;
		});
	}

	/**
	 * @desc	删除一个图层
	 * @param	{ layerId }		需要删除的图层id
	 */
	public removeLayer(layerId: string) {
		this.timeline.removeLayer( ( layer: LayerModel ) => {
			return layer.id === layerId;
		});
	}

	/**
	 * @desc	上移图层
	 */
	public upLayer( layerId: string ){
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

	/**
	 * @desc	下移图层
	 */
	public downLayer( layerId: string ){
		let layerIndex: number = this.timeline.layers.findIndex( layer => {
			return (layer.id === layerId);
		});
		if( layerIndex < 0 || layerIndex > this.timeline.layers.length - 1 ){
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

			return true;
		}

		return false;
	}

	/**
	 * @desc	转换成关键帧
	 * @param	{ index1 }	起始帧序号
	 * @param	{ index2 }	结束帧序号
	 * @param	{ layerId }	要操作的图层ID
	 */
	public changeToKeyFrames( index1: number, index2: number, layerId: string ) {
		this.getLayerById(layerId).changeToKeyFrames(index1, index2);
	}

	public changeToEmptyKeyFrames( index1: number, index2: number, layerId: string ) {
		this.getLayerById(layerId).changeToEmptyKeyFrames(index1, index2);
	}

	/**
	 * @desc	增加新的普通帧
	 * @param	{ index1 }	起始帧序号
	 * @param	{ index2 }	结束帧序号
	 * @param	{ layerId }	要操作的图层ID
	 */
	public changeToFrames( index1: number, index2: number, layerId: string ) {
		this.getLayerById(layerId).changeToFrames(index1, index2);
	}

	/**
	 * @desc	移除关键帧属性
	 * @param	{ index1 }	起始帧序号
	 * @param	{ index2 }	结束帧序号
	 * @param	{ layerId }	要操作的图层ID
	 */
	public removeKeyFrames( index1: number, index2: number, layerId: string ) {
		this.getLayerById(layerId).removeKeyFrames(index1, index2);
	}

	/**
	 * @desc	删除帧（包括关键帧）
	 * @param	{ index1 }	起始帧序号
	 * @param	{ index2 }	结束帧序号
	 * @param	{ layerId }	要操作的图层ID
	 */
	public removeFrames( index1: number, index2: number, layerId: string ) {
		this.getLayerById(layerId).removeFrames(index1, index2);
	}
	
	/**
	 * @desc	创建一个动画
	 * @param	{ index }	创建帧序号
	 * @param	{ layerId }	要操作的图层ID
	 */
	public createTweens( index1: number, index2: number, layerId: string, tweenType: TweenType = TweenType.normal ) {
		this.getLayerById( layerId ).createTweens( index1, index2, tweenType );
	}

	/**
	 * @desc	删除一个动画
	 * @param	{ index }	删除帧序号
	 * @param	{ layerId }	作用图层ID
	 */
	public removeTweens( index1: number, index2: number, layerId: string ) {
		this.getLayerById( layerId ).removeTweens( index1, index2 );
	}

	/**
	 * @desc	移动一些帧
	 */
	public moveFrames( index1: number, index2: number, offset: number, layerId: string ) {
		this.getLayerById( layerId ).moveFrames( index1, index2, offset );
	}

	public getLayerById( id: string ): LayerModel {
		return this.timeline.layers.find((layer: LayerModel) => {
			return ( layer.id === id );
		});
	}
}