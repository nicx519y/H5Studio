import { Injectable, QueryList, Output, EventEmitter } from '@angular/core';
import { 
	MF,
	PageModel,
	LayerModel,
	FrameModel,
	ElementModel,
	ElementStateModel,
	TweenModel,
	TweenType,
	LayerType,
	ElementType
} from './models';
import { DataResource } from './data-resource';

/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { List, Map, Iterable } from 'immutable';


@Injectable()
export class TimelineService {

	private _activeOptions: List<Map<string, number>> = Immutable.List<Map<string, any>>();
	private _dataResourceInstance: DataResource;
	private _dataResourcePath: any[];
	private _tempData: PageModel = MF.g(PageModel);
	private _elementStateCreator: Function;

	@Output()
	public dataResourceChangeEvent: EventEmitter<PageModel> = new EventEmitter<PageModel>();

	constructor() {
		
	}

	public get _data(): List<LayerModel> {
		return this.getData().get('layers');
	}

	/**
	 * 注册数据来源
	 */
	public registerDataSource(instance: DataResource, path: any[]) {
		if(this._dataResourceInstance != instance || this._dataResourcePath != path) {
			this._dataResourceInstance = instance;
			this._dataResourcePath = path;
			this.dataResourceChangeEvent.emit(this.getData());
		}
	}

	public setData(options: PageModel) {
		if(this._dataResourceInstance && this._dataResourcePath && this._dataResourcePath.length >= 0
			&& !Immutable.is(this.getData(), options)) {
			this._dataResourceInstance.writeback(options, this._dataResourcePath);
		}
	}

	public getData(): PageModel {
		if(!this._dataResourceInstance || !this._dataResourcePath || this._dataResourcePath.length <= 0)
			return this._tempData;
		return this._dataResourceInstance.fetch(this._dataResourcePath);
	}

	public hasData(): boolean {
		return !!(this._dataResourceInstance && this._dataResourcePath);
	}

	public setTimelineData(data: List<LayerModel>) {
		if(!this.hasData()) {
			alert('Timeline has no data.');
			return;
		}
		this.setData(this.getData().set('layers', data));
	}

	/**
	 * 注册elementState的生成器
	 */
	public registerElementStateCreator(creator: Function) {
		this._elementStateCreator = creator;
	}

	public getActivePageId(): string {
		return this.getData().get('id');	
	}

	public getActiveOptions(): List<Map<string, any>> {
		return this._activeOptions;
	}

	

	public resetActiveOptions() {
		this._activeOptions = Immutable.List<Map<string, any>>();
	}

	public setActiveOptions(
		options: number[] | { elementId: string, start: number, duration: number, }[], 
		isRange: boolean = true
	) {
		console.log('set active options: ', options);
		let ao: List<Map<string, any>>;
		if(isRange) {
			let range = options as number[];
			if(range.length < 4) {
				this.resetActiveOptions();
				return;
			}
			let frame1 = Math.min(range[0], range[2]);
			let layer1 = Math.min(range[1], range[3]);
			let frame2 = Math.max(range[0], range[2]);
			let layer2 = Math.max(range[1], range[3]);
			ao = Immutable.List<Map<string, any>>();
			this._data.forEach((layer, index) => {
				(index >= layer1 && index <= layer2) &&
				(ao = ao.push(Immutable.Map<string, any>({
					elementId: layer.getIn(['element', 'id']),
					start: frame1,
					duration: frame2 - frame1 + 1,
				})));
			});
		} else {
			ao = Immutable.fromJS(options as {elementId: string, start: number, duration: number }[]).toList();
		}

		if(!Immutable.is(ao, this._activeOptions)) {
			console.log('active options change: ', ao);
			this._activeOptions = ao;
		}
	}

	public getFrameCount(): number {
		if(!this._data || this._data.size <= 0) return 0;
		let count: number = 0;
		this._data.forEach(layer => count = Math.max(count, layer.get('frameCount')));
		return count;
	}

	public addElement(element: ElementModel, layerName: string = 'New Element', index: number = -1) {
		let newKeyFrame: FrameModel = MF.g(FrameModel, {
			name: '',
			isKeyFrame: true,
			isEmptyFrame: false,
			index: 0,
			elementState: new ElementStateModel()
		});
		let newLayer: LayerModel = MF.g(LayerModel, {
			name: layerName,
			type: LayerType.normal,
			frameCount: 1,
			element: element,
			frames: Immutable.List<LayerModel>().push(newKeyFrame)
		});

		if(index >= 0 && index < this._data.size) {
			this.setTimelineData(this._data.insert(index, newLayer));
		} else {
			this.setTimelineData(this._data.push(newLayer));
		}
	}

	/**
	 * 批量删除elements
	 */
	public removeElements(eleIds: string[]) {
		let data: List<LayerModel> = Immutable.List<LayerModel>();
		data = this._data.filter(layer => eleIds.indexOf(layer.getIn(['element', 'id'])) < 0).toList();
		(!Immutable.is(this._data, data)) && (this.setTimelineData(data));
	}

	public swapElements(eleId1: string, eleId2: string) {
		let idx1: number = this._data.findIndex(layer => layer.getIn(['element', 'id']) === eleId1);
		let idx2: number = this._data.findIndex(layer => layer.getIn(['element', 'id']) === eleId2);
		if(idx1 >= 0 && idx2 >= 0) {
			let layer1 = this._data.get(idx1);
			let layer2 = this._data.get(idx2);
			this.setTimelineData(this._data.set(idx2, layer1).set(idx1, layer2));
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
		this.setTimelineData(tempData);
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
		this.setTimelineData(tempData);
	}

	public setToKeyFrames(options: {
		elementId: string,
		start: number,
		duration: number,
	}[], frameOptions: {
		elementId: string,
		isEmptyFrame: boolean,
		elementState?: ElementStateModel,
	}[] | {
		isEmptyFrame: boolean,
		elementState?: null
	} = {
		isEmptyFrame: false,
		elementState: null
	}): List<LayerModel> {
		if(!frameOptions) return;
		let fos: any;
		if(!frameOptions.hasOwnProperty('length')) {
			let fo = frameOptions;
			fos = options.map(opt => {
				return {
					elementId: opt.elementId,
					isEmptyFrame: fo['isEmptyFrame'],
					elementState: fo['elementState'] || null
				}
			});
		} else if(frameOptions['length'] != options.length) {
			return;
		} else {
			fos = frameOptions;
		}
		let data: List<LayerModel> = this.changeToFrames(options)
			.map(layer => {
				let obj = options.find(opt => opt.elementId === layer.getIn(['element', 'id']));
				if(!obj) return layer;
				let idx: number = obj.start;
				let idx2: number = obj.start + obj.duration - 1;
				let frames: List<FrameModel> = layer.get('frames');
				let eleId: string = layer.getIn(['element', 'id']);
				for(let i = idx; i <= idx2; i ++) {
					let fidx: number = frames.findIndex(frame => frame.get('index') === i);
					let frameOption = fos.find(opt => opt.elementId === eleId);
					if(fidx >= 0) {
						let frame: FrameModel = frames.get(fidx);
						if(frameOption.isEmptyFrame) {
							frame = frame.set('isEmptyFrame', frameOption.isEmptyFrame)
								.set('elementState', null)
								.set('tweenType', TweenType.none)
								.set('tween', MF.g(TweenModel));
						} else {
							frame = frame.set('isEmptyFrame', frameOption.isEmptyFrame)
								.set('elementState', MF.g(ElementStateModel, frameOption.elementState));
						}
						frames = frames.set(fidx, frame);
					} else {
						let newFrame: FrameModel;
						//克隆上一个关键帧，作为新的关键帧
						if(!frameOption.isEmptyFrame) {
							newFrame = FrameModel.clone(frames.findLast(frame => frame.get('index') < i))
								.set('index', i);
						} else {
							newFrame = MF.g(FrameModel, {
								isEmptyFrame: frameOption.isEmptyFrame,
								index: i,
								tweenType: TweenType.none,
								tween: MF.g(TweenModel),
							});
						}
						if(this._elementStateCreator) {
							newFrame = newFrame.set('elementState', this._elementStateCreator(eleId, i));
						} else {
							newFrame = newFrame.set('elementState', MF.g(ElementStateModel, frameOption.elementState));
						}
						frames = frames.insert(frames.findLastIndex(frame => frame.get('index') < i) + 1, newFrame);
					}
				}
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
			for(let i = idx; i <= idx2; i ++) {
				let n: number = frames.findIndex(frame => frame.get('index') === i);
				if(n >= 0)
					frames = frames.delete(n);
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
		//...todo
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