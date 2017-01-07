import { Injectable, QueryList, Output, EventEmitter } from '@angular/core';
import { 
	MF,
	LayerModel,
	FrameModel,
	ElementModel,
	ElementStateModel,
	TweenModel,
	TweenType,
	LayerType,
	ElementType
} from './models';

/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { List, Map, Iterable } from 'immutable';


@Injectable()
export class TimelineService {

	private _data: List<LayerModel> = Immutable.List<LayerModel>();
	private _activeOptions: List<Map<string, number>> = Immutable.List<Map<string, any>>();

	constructor() {
		
	}

	public setData(options: List<LayerModel>) {
		if(!Immutable.is(options, this._data))
			this._data = options;
	}

	public getData() {
		return this._data;
	}

	public getActiveOptions(): List<Map<string, any>> {
		return this._activeOptions;
	}

	public resetActiveOptions() {
		this._activeOptions = Immutable.List<Map<string, any>>();
	}

	public setActiveOptions(range: number[]) {
		if(range.length < 4) {
			this.resetActiveOptions();
			return;
		}
		let frame1 = Math.min(range[0], range[2]);
		let layer1 = Math.min(range[1], range[3]);
		let frame2 = Math.max(range[0], range[2]);
		let layer2 = Math.max(range[1], range[3]);
		let ao = Immutable.List<Map<string, any>>();
		this._data.forEach((layer, index) => {
			(index >= layer1 && index <= layer2) &&
			(ao = ao.push(Immutable.Map<string, any>({
				elementId: layer.getIn(['element', 'id']),
				start: frame1,
				duration: frame2 - frame1 + 1,
			})));
		});

		if(!Immutable.is(ao, this._activeOptions)) {
			this._activeOptions = ao;
		}
	}

	public getFrameCount(): number {
		let count: number = 0;
		this._data.forEach(layer => count = Math.max(count, layer.get('frameCount')));
		return count;
	}

	public addElement(element: ElementModel, index: number = -1) {
		let newKeyFrame: FrameModel = MF.g(FrameModel, {
			name: '',
			isKeyFrame: true,
			isEmptyFrame: false,
			index: 0,
			elementState: new ElementStateModel()
		});
		let newLayer: LayerModel = new LayerModel({
			name: 'New Element',
			type: LayerType.normal,
			frameCount: 1,
			element: element,
			frames: Immutable.List<LayerModel>().push(newKeyFrame)
		});

		if(index >= 0 && index < this._data.size) {
			this.setData(this._data.insert(index, newLayer));
		} else {
			this.setData(this._data = this._data.push(newLayer));
		}
	}

	/**
	 * 批量删除elements
	 */
	public removeElements(eleIds: string[]) {
		let data: List<LayerModel> = Immutable.List<LayerModel>();
		data = this._data.filter(layer => eleIds.indexOf(layer.getIn(['element', 'id'])) < 0).toList();
		(!Immutable.is(this._data, data)) && (this.setData(data));
	}

	public swapElements(eleId1: string, eleId2: string) {
		let idx1: number = this._data.findIndex(layer => layer.getIn(['element', 'id']) === eleId1);
		let idx2: number = this._data.findIndex(layer => layer.getIn(['element', 'id']) === eleId2);
		if(idx1 >= 0 && idx2 >= 0) {
			let layer1 = this._data.get(idx1);
			let layer2 = this._data.get(idx2);
			this._data = this._data.set(idx2, layer1).set(idx1, layer2);
		}
	}

	public upElements(elementIds: string[]) {
		let eleIdxs: number[] = elementIds.map(id => this._data.findIndex(layer => layer.getIn(['element', 'id']) === id));
		eleIdxs = eleIdxs.sort((a, b) => {
			if(a < b)
				return -1;
			else if(a > b)
				return 1;
			else
				return 0;
		});
		if(eleIdxs[0] <= 0) return;

		let newIdxs: number[] = [];
		for(let i = 0; i < this._data.size; i ++) {
			newIdxs[i] = i;
			if(eleIdxs.indexOf(i) >= 0) 
				this.swapArray(newIdxs, i, i - 1);
		}

		let tempData = Immutable.List<LayerModel>();
		newIdxs.forEach(idx => tempData = tempData.push(this._data.get(idx)));
		this.setData(tempData);
	}

	public downElements(elementIds: string[]) {
		let eleIdxs: number[] = elementIds.map(id => this._data.findIndex(layer => layer.getIn(['element', 'id']) === id));
		eleIdxs = eleIdxs.sort((a, b) => {
			if(a < b)
				return -1;
			else if(a > b)
				return 1;
			else
				return 0;
		});
		if(eleIdxs[eleIdxs.length - 1] >= this._data.size - 1) return;

		let newIdxs: number[] = [];
		for(let i = this._data.size - 1; i >= 0; i --) {
			newIdxs[i] = i;
			if(eleIdxs.indexOf(i) >= 0) 
				this.swapArray(newIdxs, i, i + 1);
		}
		
		let tempData = Immutable.List<LayerModel>();
		newIdxs.forEach(idx => tempData = tempData.push(this._data.get(idx)));
		this.setData(tempData);
	}

	public changeToKeyFrames(options: {
		elementId: string,
		start: number,
		duration: number,
	}[]): List<LayerModel> {
		let data: List<LayerModel> = this.changeToFrames(options)
			.map(layer => {
				let obj = options.find(opt => opt.elementId === layer.getIn(['element', 'id']));
				if(!obj) return layer;
				let idx: number = obj.start;
				let idx2: number = obj.start + obj.duration - 1;
				let frames: List<FrameModel> = layer.get('frames');
				for(let i = idx; i <= idx2; i ++) {
					let frame: FrameModel = frames.find(frame => frame.get('index') === i);
					if(frame) continue;
					//克隆上一个关键帧，作为新的关键帧
					let newFrame: FrameModel = FrameModel.clone(frames.findLast(frame => frame.get('index') < i))
						.set('elementState', null)
							.set('index', i);
					frames = frames.push(newFrame);
				}
				frames = frames.sort((a, b) => {
					if(a.get('index') > b.get('index')) return 1;
					if(a.get('index') < b.get('index')) return -1;
					if(a.get('index') === b.get('index')) return 0;
				}).toList();
				return layer.set('frames', frames);
			}).toList();
		return this.resetDuration(data);
	}

	public changeToEmptyKeyFrames(options: {
		elementId: string,
		start: number,
		duration: number,
	}[]): List<LayerModel> {
		let data: List<LayerModel> = this.changeToFrames(options)
			.map(layer => {
				let obj = options.find(opt => opt.elementId === layer.getIn(['element', 'id']));
				if(!obj) return layer;
				let idx: number = obj.start;
				let idx2: number = obj.start + obj.duration - 1;
				let frames: List<FrameModel> = layer.get('frames');
				for(let i = idx; i <= idx2; i ++) {
					let frameIdx: number = frames.findIndex(frame => frame.get('index') === i);
					if(frameIdx >= 0) {	//删除原有关键帧
						frames = frames.setIn([frameIdx, 'elementState'], null);
						frames = frames.setIn([frameIdx, 'isEmptyFrame'], true);
					} else {
						let newFrame: FrameModel = MF.g(FrameModel, {
							elementState: null,
							isEmptyFrame: true,
							tweenType: TweenType.none,
							index: i,
						});
						frames = frames.push(newFrame);
					}
				}
				frames = frames.sort((a, b) => {
					if(a.get('index') > b.get('index')) return 1;
					if(a.get('index') < b.get('index')) return -1;
					if(a.get('index') === b.get('index')) return 0;
				}).toList();
				return layer.set('frames', frames);
			}).toList();
		return this.resetDuration(data);
	}

	public changeToFrames(options: {
		elementId: string,
		start: number,
		duration: number,
	}[]): List<LayerModel> {
		let data: List<LayerModel> = this._data.map(layer => {
			let obj = options.find(opt => opt.elementId === layer.getIn(['element', 'id']));
			if(obj)
				return layer.set('frameCount', Math.max(layer.get('frameCount'), obj.start + obj.duration));
			else
				return layer;
		}).toList();
		return this.resetDuration(data);
	}

	public removeKeyFrames(options: {
		elementId: string,
		start: number,
		duration: number,
	}[]): List<LayerModel> {
		let data: List<LayerModel> = this._data.map(layer => {
			let obj = options.find(opt => opt.elementId === layer.getIn(['element', 'id']));
			if(!obj) return layer;
			let idx: number = obj.start;
			let idx2: number = obj.start + obj.duration - 1;
			let frames: List<FrameModel> = layer.get('frames');
			while(idx <= idx2) {
				let n: number = frames.findIndex(frame => frame.get('index') === idx);
				if(n >= 0)
					frames = frames.delete(n);
				idx ++;
			}
			return layer.set('frames', frames);
		}).toList();
		return this.resetDuration(data);
	}

	public removeFrames(options: {
		elementId: string,
		start: number,
		duration: number,
	}[]): List<LayerModel> {
		let data: List<LayerModel> = this.removeKeyFrames(options)
			.map(layer => {
				let obj = options.find(opt => opt.elementId === layer.getIn(['element', 'id']));
				if(!obj) return layer;
				let count: number = layer.get('frameCount');
				if(obj.start > count - 1) return layer;
				let lastIndex: number = Math.min(count - 1, obj.start + obj.duration -1);
				let dur: number = lastIndex - obj.start + 1;
				layer = layer.set('frameCount', layer.get('frameCount') - dur);
				let frames: List<FrameModel> = layer.get('frames')
					.map(frame => {
						let idx: number = frame.get('index');
						if(idx > obj.start + obj.duration - 1) {
							frame = frame.set('index', idx - dur);
						}
						return frame;
					}).toList();
				
				return layer.set('frames', frames);
			}).toList();
		return this.resetDuration(data);
	}

	public setTweens(options: {
		elementId: string,
		start: number,
		duration: number,
	}[], tweenOptions: {
		type: TweenType,
		tween: TweenModel,
	} = {
		type: TweenType.normal,
		tween: MF.g(TweenModel)
	}): List<LayerModel> {
		let data: List<LayerModel> = this._data.map(layer => {
			let obj = options.find(opt => opt.elementId === layer.getIn(['element', 'id']));
			if(!obj) return layer;
			let idx: number = obj.start;
			let idx2: number = obj.start + obj.duration - 1;
			let frames: List<FrameModel> = layer.get('frames');
			for(let i = idx; i <= idx2; i ++) {
				let fidx: number = frames.findIndex(
					frame => frame.get('index') <= i 
					&& frame.get('index') + frame.get('duration') - 1 >= i 
					&& (frame.get('tweenType') !== tweenOptions.type
					|| !Immutable.is(frame.get('tween').set('id', ''), tweenOptions.tween.set('id', '')))
				);
				if(fidx >= 0) {
					frames = frames.setIn([fidx, 'tweenType'], tweenOptions.type);
					frames = frames.setIn([fidx, 'tween'], tweenOptions.tween);
				}
			}
			return layer.set('frames', frames);
		}).toList();
		return data;
	}

	public moveFrames(idxs: number[], eleIds: string[]) {

	}

	public changeKeyFramesState(frameIdx: number, changes: {
		layerId: string,
		frame: any,
	}[]) {

	}

	private resetDuration(options: List<LayerModel>): List<LayerModel> {
		return options.map(layer => {
			let frames: List<FrameModel> = layer.get('frames');
			frames = frames.map((frame, idx) => {
				let dur: number;
				if(idx < frames.size - 1) {
					let next = frames.get(idx + 1);
					dur = next.get('index') - frame.get('index');
				} else {
					dur = layer.get('frameCount') - frame.get('index');
				}
				frame = frame.set('duration', dur);
				if(frame.has('tween') && frame.get('tween')) {
					frame = frame.setIn(['tween', 'duration'], dur);
				}
				return frame;
			}).toList();
			return layer.set('frames', frames);
		}).toList();
	}

	private swapArray(arr: any[], idx1: number, idx2: number) {
		let e1 = arr[idx1];
		let e2 = arr[idx2];
		arr[idx1] = e2;
		arr[idx2] = e1;
	}

	
}