export enum Direction {
	vertial,		//垂直
	horizontal		//水平
}

export enum PageType {
	none,
	swiper 
}

export enum SwiperEffect {
	slide
}

export enum ItemType { 
	movieclip, 	//影片剪辑
	bitmap, 	//位图
	text,		//文字
	video,		//视频
}

export enum SourceType {
	bitmap,
	video
}

export enum ElementType {
	symbol,		//元件库元件的实例
	shape		//图形
}

export enum TweenType {
	none,				//没有动画
	normal,				//补间动画
	shape				//图形动画
}

export enum EditorState {
	none,
	choose,				//选择
	text,				//文字
	zoom,				//放大缩小
	draw				//绘制
}

export enum Ease {		//具体请参照createjs Ease类
	backIn,
	backInOut,
	backOut,
	bounceIn,
	bounceInOut,
	bounceOut,
	circIn,
	circInOut,
	circOut,
	cubicIn,
	cubicInOut,
	cubicOut,
	elasticIn,
	elasticInOut,
	elasticOut,
	get,
	getBackIn,
	getBackInOut,
	getBackOut,
	getElasticIn,
	getElasticInOut,
	getElasticOut,
	getPowIn,
	getPowInOut,
	getPowOut,
	linear,
	none,
	quadIn,
	quadInOut,
	quadOut,
	quartIn,
	quartInOut,
	quartOut,
	quintIn,
	quintInOut,
	quintOut,
	sineIn,
	sineInOut,
	sineOut 
}

export enum LayerType {
	normal,				//普通图层
	mask,				//遮罩层
	path				//引导层
}


export class BasicModel {
	static idrandoms: Array<string> = [];
	protected idpre: string = '';
	id: string = '';
	
	constructor() {
	}

	public init(options: {} = {}) {
		//如果没有指定id，则生成唯一id
		if(typeof this['id'] != 'string' || this['id'] == '') {
			this['id'] = BasicModel.createNewId(this.idpre);
		}
		
		for(let key in options) {
			if( key == 'value' ) continue;

			if(!Reflect.has(this, key)) {
				continue;
			}

			let value: any = options[key];
			let property: any = Reflect.get(this, key);

			if(typeof value == 'undefined') {
				continue;
			}

			if(typeof property == 'undefined') {
				Reflect.set(this, key, value);
				continue;
			}
			if(value.constructor.name == property.constructor.name) {
				Reflect.set(this, key, value);
			} else if(typeof value == 'Object') {
				Reflect.set(this, key, new property.constructor(value));
			} else {
				continue;
			}
		}
	}
	private static createRandom(): string {
		let str: string = Math.round(1000 * Math.random()).toString();
		let len: number = 3 - str.length;

		for(let i = 0; i < len; i ++){
			str = '0' + str;
		}
		if(this.idrandoms.indexOf(str) >= 0) {
			str = BasicModel.createRandom();
		}
		this.idrandoms.push(str);
		return str;
	}
	
	/***
	 * @desc 生成唯一id
	 */
	private static createNewId(pre:string): string {
		return pre + new Date().getTime() + this.createRandom();
	}

	private deepValue(obj): any {
		// return obj;
		if(typeof obj == 'undefined' || obj === null) return obj;
		let keys: string[] = Object.getOwnPropertyNames(obj);
		let value: any;
		if(Reflect.has(obj, 'length')) {
			value = [];
		} else {
			value = {};
		}
		keys.forEach(key => {
			if(key != 'idpre') {
				let realKey: string = key.replace(/^_/, '');
				let o: any = obj[realKey];
				let val: any;
				if(typeof o == 'function' || typeof o == 'undefined' || o == null) {
					//do nothing..
				} else if (val instanceof BasicModel) {
					val = val.getValue();
					Reflect.set(value, realKey, val);
				} else if (typeof o == 'object') {
					val = this.deepValue(o);
					Reflect.set(value, realKey, val);
				} else {
					val = o;
					Reflect.set(value, realKey, val);
				}
			}
		});
		return value;
	}

	public getValue(): any {
		let value: any = this.deepValue(this);
		return value;
	}
	
}


export class TextSourceModel extends BasicModel {
	protected idpre: string = 'text';
	width: number = 0;					//宽度
	height: number = 0;					//高度
	text: string = '';					//文字内容
	font: string = 'arial';					//字体
	color: string = '#000000';			//颜色
	background: BackgroundModel = new BackgroundModel();	//背景色
	size: number = 12;					//字号
	bold: boolean = false;				//粗体
	italic: boolean = false;			//斜体
	underline: boolean = false;			//下划线
	lineheight: number = 20;			//行高

	constructor(options: {
		width?: number,
		height?: number,
		text?: string,
		font?: string,
		color?: string,
		background?: BackgroundModel,
		size?: number,
		bold?: boolean,
		italic?: boolean,
		underline?: boolean,
		lineheight?: number
	} = {}) {
		super();
		super.init(options);
	}

	
}

export class ShapeSourceModel extends BasicModel {
	protected idpre: string = 'shape';
	//to do ...
	constructor(options: {} = {}) {
		super();
		super.init(options);
	}
}

export class SourceModel extends BasicModel {
	protected idpre: string = 'source';
	type: ItemType;
	url: string = '';			//资源
	width: number = 0;
	height: number = 0;
	fileName: string = '';
	size: number = 0;
	constructor(options: {
		url?: string,
		width?: number,
		height?: number,
		fileName?: string,
		size?: number
	} = {}) {
		super();
		super.init(options);
	}

	public static createSourceModel(type: ItemType, options:{}={}) {
		let model: BasicModel;
		switch( type ) {
			case ItemType.bitmap:
				model = new BitmapSourceModel( options );
				break;
			case ItemType.video:
				model = new VideoSorceModel( options );
				break;
			case ItemType.text:
				model = new TextSourceModel( options );
				break;
			case ItemType.movieclip:
				model = new PageModel( options );
				break;
		}
		return model;
	}
}

export class BitmapSourceModel extends SourceModel {
	protected idpre: string = 'bitmap';
	type: ItemType = ItemType.bitmap;
	constructor(options: {
		url?: string,
		size?: number,
		width?: number,
		height?: number,
		fileName?: string
	}={}) {
		super();
		super.init(options);
	}
}

export class VideoSorceModel extends SourceModel {
	protected idpre: string = 'video';
	type: ItemType = ItemType.video;
	constructor(options: {
		url?: string,
		size?: number,
		width?: number,
		height?: number,
		fileName?: string
	}={}) {
		super();
		super.init(options);
	}
}

export class ElementStateModel extends BasicModel {
	protected idpre: string = 'eleState';
	x: number = 0;			//父级坐标
	y: number = 0;
	originX: number = 0;	//原点X坐标
	originY: number = 0;	//原点Y坐标
	rotation: number = 0;
	scaleX: number = 0;
	scaleY: number = 0;
	skewX: number = 0;
	skewY: number = 0;
	alpha: number = 100;	//透明度 0 - 100
	
	matrix: {
		a: number, b: number, c: number, d: number, e: number, f: number
	} = {
		a: 1, b: 0, c: 0, d: 1, e: 0, f: 0
	};

	constructor(options: {
		x?: number,
		y?: number,
		rotation?: number;
		scaleX?: number;
		scaleY?: number;
		skewX?: number;
		skewY?: number;
		originX?: number,
		originY?: number,
		alpha?: number,
		matrix?: { a: number, b: number, c: number, d: number, e: number, f: number },
	} = {}) {
		super();
		super.init(options);
	}
}

export class TweenModel extends BasicModel {
	protected idpre: string = 'tween'; 
	type: TweenType = TweenType.normal;
	loop: boolean = false;						//是否循环
	ease: Ease = Ease.linear;
	duration: number = 0;						//动画帧长

	constructor(options: {
		type?: TweenType,
		loop?: boolean,
		ease?: Ease,
		duration?: number
	} = {}) {
		super();
		super.init(options);
	}
}

export class ElementModel extends BasicModel {
	protected idpre: string = 'ele';
	public instanceName: string = '';											//人为指定的标识，同样具有唯一性
	public visible: boolean = true;
	private _type: ElementType = ElementType.symbol;					//标识element的类型
	private _item: any = '';

	constructor(options: {
		instanceName?: string,
		type?: ElementType,
		item?: any,
		visible?: boolean,
	}={}) {
		super();
		super.init(options);
	}

	public set type(t: ElementType) {
		if(t != this._type) {
			this._type = t;
			switch(this._type) {
				case ElementType.symbol:
					this._item = '';		//item id
					break;
				case ElementType.shape:
					this._item = new ShapeSourceModel();
					break;
			}
		}
	}

	public get type() {
		return this._type;
	}

	public set item(src: any) {
		switch(this._type) {
			case ElementType.symbol:
				if( typeof src == 'string' ) {
					this._item = src;
				} else {
					throw new Error('Can not set source which not match ElementType!');
				}
				break;
			case ElementType.shape:
				this._item.init(src);
				break;
		}
	}

	public get item() {
		return this._item;
	}


	public static fromItem( item: ItemModel ) {
		let ele: ElementModel = new ElementModel({
			type: ElementType.symbol,
			item: item.id
		});
		return ele;
	}
}

export class FilterModel extends BasicModel {
	protected idpre: string = 'filter';
	// to do ...

	constructor(options: {} = {}) {
		super();
		super.init(options);
	}
}

export class FrameModel extends BasicModel {
	protected idpre: string = 'frame';
	name: string = '';											//帧名，如果没有指定则为空字符串
	index: number = 0;											//帧序号
	isKeyFrame: boolean = true;									//是否是关键帧
	isEmpty: boolean = false;									//是否是空帧
	tweenType: TweenType = TweenType.none;						//区间动画类型
	tween: TweenModel = new TweenModel();						//指定到下一个关键帧之间的动画参数
	elementState: ElementStateModel = new ElementStateModel();	//当前状态
	duration: number = 1;										//关键帧区域长度

	constructor(options: {
		name?: string,
		index?: number,
		isKeyFrame?: boolean,
		isEmpty?: boolean,
		tweenType?: TweenType,
		tween?: TweenModel,
		elementState?: ElementStateModel | {
			originX?: number,
			originY?: number,
			matrix?: {
				a: number, b: number, c: number, d: number, e: number, f:number
			},
			alpha?: number,
			visible?: boolean
		},
		duration?: number
	} = {}) {
		super();
		super.init(options);
	}

	public setDuration(dur: number) {
		this.duration = dur;
		if(this.tween) {
			this.tween.duration = dur;
		}
		
	}

	public copy(): FrameModel {
		let newFrame: FrameModel = new FrameModel({
			name: this.name,
			index: this.index,
			isKeyFrame: this.isKeyFrame,
			isEmpty: this.isEmpty,
			tweenType: TweenType.none,				//不复制动画
			duration: this.duration
		});

		newFrame.elementState = new ElementStateModel();
		Object.assign( newFrame.elementState, this.elementState );

		return newFrame;
	}

}



export class LayerModel extends BasicModel {
	protected idpre: string = 'layer';
	id: string = '';									//图层id
	name: string = '';									//手动命名的name
	type: LayerType = LayerType.normal;					//图层类型
	parentLayer: string = '';							//自身的遮罩或者引导层id
	children: Array<string> = [];						//如果自身是遮罩或者引导层，会有子图层的列表
	startFrame: number = 0;								//开始帧
	element: ElementModel = new ElementModel();			//包含的element
	frames: Array<FrameModel> = [];						//关键帧集合
	frameCount: number = 0;								//总帧数
	visible: boolean = true;							//在编辑状态是否可见，不影响实际展示

	constructor(options: {
		name?: string,
		type?: LayerType,
		parentLayer?: string,
		children?: string[],
		startFrame?: number,
		element?: ElementModel,
		frames?: FrameModel[],
		frameCount?: number,
		visible?: boolean
	} = {}) {
		super();
		super.init(options);
		this.frames.forEach(frame => {
			this.frameCount += frame.duration;
		});
	}


	/**
	 * @desc	将一个帧转换为关键帧
	 * @param	{ index1 }	开始帧序号
	 * @param	{ index2 }	结束帧序号
	 */
	public changeToKeyFrames(index1: number, index2: number) {
		if( index1 > index2 ) return;
		//首先转换为普通帧
		this.changeToFrames(index1, index2);

		let tempArr: Array<FrameModel> = [];
		
		for( let i: number = index1; i <= index2; i ++ ) {
			let keyframe: FrameModel = this.getKeyFrameByFrame( i );
			if( !keyframe ) continue;
			let f: FrameModel = keyframe.copy();
			f.index = i;
			tempArr.push( f );
		}

		this.mergeFrames( tempArr );
		this.resetFramesDuration();
	}

	public changeToEmptyKeyFrames( index1: number, index2: number ) {
		if( index1 > index2 ) return;
		this.changeToFrames(index1, index2);
		let tempArr: Array<FrameModel> = [];
		
		for( let i: number = index1; i <= index2; i ++ ) {
			let keyframe: FrameModel = this.getKeyFrameByFrame( i );
			if( !keyframe ) continue;
			let f: FrameModel = keyframe.copy();
			f.init({
				index: i,
				isEmpty: true
			});
			tempArr.push( f );
		}

		this.mergeFrames( tempArr );
		this.resetFramesDuration();
	}

	/**
	 * @desc	转换一个普通帧
	 * @param	{ index1 }	开始帧序号
	 * @param	{ index2 }	结束帧序号
	 */
	public changeToFrames(index1: number, index2: number) {
		if(index1 > index2) return;
		this.frameCount = Math.max( this.frameCount, index2 + 1 );
		this.resetFramesDuration();
	}

	/**
	 * @desc	删除帧的关键帧属性
	 * @param	{ index1 }	开始帧序号
	 * @param	{ index2 }	结束帧序号
	 */
	public removeKeyFrames(index1: number, index2: number) {
		if( index1 > index2 ) return;
		let idxs: Array<number> = [];
		this.frames.forEach((frame: FrameModel, i: number) => {
			if( frame.index >= index1 && frame.index <= index2 ) {
				idxs.push(i);
			}
		});
		if ( idxs.length > 0 ) {
			this.frames.splice(idxs[0], idxs.length);
		}
		this.checkKeyFrames();
		this.resetFramesDuration();
	}

	/**
	 * @desc	删除帧
	 * @param	{ index1 }	开始帧序号
	 * @param	{ index2 }	结束帧序号
	 */
	public removeFrames(index1: number, index2: number) {
		if( index1 > index2 ) return;
		if( index1 > this.frameCount - 1 ) return;
		
		index2 = Math.min( this.frameCount - 1, index2 );

		this.removeKeyFrames(index1, index2);
		let len: number = index2 - index1 + 1;
		this.frames.forEach((frame: FrameModel, i: number) => {
			if ( frame.index > index2 ) {
				frame.index -= len;
			}
		});
		this.frameCount -= len;
		this.resetFramesDuration();
	}

	/**
	 * @desc	建立动画
	 * @param	{ index }		帧序号
	 * @param	{ tweenType }	动画类型
	 */
	
	public createTweens( index1: number, index2: number, tweenType: TweenType = TweenType.normal ) {
		let frameMap: Map<number, FrameModel> = new Map<number, FrameModel>();
		for(let i = index1; i <= index2; i ++) {
			let frame: FrameModel = this.getKeyFrameByFrame( i );
			if( frame.isEmpty ) continue;
			frameMap.set(frame.index, frame);
		}
		frameMap.forEach( frame => {
			frame.tweenType = tweenType;
			frame.tween.init({
				tweenType: tweenType,
				duration: frame.duration,
				ease: Ease.linear
			});
		} );
	}

	/**
	 * @desc	删除动画
	 * @param	{ index }	帧序号
	 */
	public removeTweens( index1: number, index2: number ) {
		let frameMap: Map<number, FrameModel> = new Map<number, FrameModel>();
		for(let i = index1; i <= index2; i ++) {
			let frame: FrameModel = this.getKeyFrameByFrame( i );
			if( frame.isEmpty ) continue;
			frameMap.set(frame.index, frame);
		}
		frameMap.forEach( frame => {
			frame.tweenType = TweenType.none;
		} );
	}

	/**
	 * @desc	移动帧
	 * @param	{ index1 }	区间开始帧序号
	 * @param	{ index2 }	区间结束帧序号
	 * @param	{ offset }	移动偏移量，正数为向右移动，负数为向左移动
	 */
	public moveFrames( index1: number, index2: number, offset: number ) {
		if( index1 > index2 || index1 < 0 ) return;
		let moveFrameIds: Array<string> = [];
		let target1: number = Math.max( index1 + offset, 0 );
		let target2: number = Math.max( index2 + offset, 0 );

		if( index1 < this.frameCount ) {
			this.changeToKeyFrames( index1, index1 );		//将移动区间内第一帧转换为关键帧
		}
		this.changeToFrames(target1, target2);			//建立目标区间范围内普通帧

		let framesMap: Map<number, FrameModel> = new Map<number, FrameModel>();
		let moveFramesMap: Map<number, FrameModel> = new Map<number, FrameModel>();
		this.frames.forEach( frame => {
			if( frame.index <= index2 && frame.index >= index1 ){
				frame.index += offset;
				moveFramesMap.set( frame.index, frame );
			} else {
				framesMap.set( frame.index, frame );
			}
		} );
		moveFramesMap.forEach(( frame: FrameModel, index: number ) => {
			framesMap.set( index, frame );
		});

		let framesTemp: Array<FrameModel> = [];
		framesMap.forEach( frame => {
			framesTemp.push( frame );
		});
		framesTemp.sort((a, b) => {
			if( b.index > a.index )
				return -1;
			else
				return 1;
		});
		this.frames = framesTemp;
		this.checkKeyFrames();
		this.resetFramesDuration();
	}

	/**
	 * @desc	当图层中帧状态有改变时，重新计算帧的duration属性
	 */
	private resetFramesDuration() {
		this.frames.forEach((frame: FrameModel, i: number) => {
			if( i < this.frames.length - 1 ) {
				frame.setDuration( this.frames[i + 1].index - frame.index );
			} else {
				frame.setDuration( this.frameCount - frame.index );
			}
		});
	}

	/**
	 * @desc	根据一个帧获取作用于它的关键帧
	 */
	public getKeyFrameByFrame(index: number): FrameModel {
		let fs: Array<FrameModel> = this.frames.filter( (frame: FrameModel, i: number) => {
			return frame.index <= index;
		} );

		return fs[fs.length - 1];
	}

	/**
	 * @desc	判断是否存在指定element
	 */
	public hasElement( element: Function | ElementModel ) {
		let ele: ElementModel = this.element;
		if( typeof element === 'function' ) {
			if( element( ele ) )
				return true;
		} else if( element instanceof ElementModel ) {
			if( element === ele )
				return true;
		}
	}

	/**
	 * 合并一个帧序列到帧序列当中，并根据index做排序 
	 */
	private mergeFrames( fs: Array<FrameModel> ) {
		let temp: Map<number, FrameModel> = new Map<number, FrameModel>();
		let tempArr: Array<FrameModel> = [];
		this.frames.forEach( f => {
			temp.set( f.index, f );
		} );
		fs.forEach( f => {
			temp.set( f.index, f );
		} );
		temp.forEach( (f: FrameModel, i: number) => {
			tempArr.push(f);
		} );

		this.frames = tempArr.sort( ( a, b ) => {
			if( b.index < a.index )
				return 1;
			else
				return -1;
		} );
	}

	private checkKeyFrames(): boolean {
		//检查是否还存在关键帧
		if( this.frames.length <= 0 ) {
			this.frames.unshift(new FrameModel({
				index: 0,
				isKeyFrame: true,
				isEmpty: true,
			}));
			return false;
		}
		//检查0帧时候存在关键帧，如果没有关键帧，则创建空关键帧
		if( this.frames[0].index != 0 ) {
			this.frames.unshift(new FrameModel({
				index: 0,
				isKeyFrame: true,
				isEmpty: true,
			}));
		}

		return true;
	}
}

export class TimelineModel extends BasicModel {
	protected idpre: string = 'timeline';
	name: string = '';
	actionOption: {
		layer: string,
		start: number,
		duration: number
	}={
		layer: null,
		start: -1,
		duration: 0
	};
	layers: Array<LayerModel>=[];

	constructor(options: {} = {}) {
		super();
		super.init(options);
	}

	get frameCount() {
		if(!this.layers) return 0;
		let count: number = 0;
		this.layers.map(layer => {
			count = Math.max( count, layer.frameCount );
		});
		return count;
	}

	/**
	 * @desc	删除一个图层
	 */
	public removeLayer( layer: Function | LayerModel ) {
		// let tempLayer: Array<LayerModel> = [];
		// this.layers.forEach( l => {
		// 	if( typeof layer === 'function' ) {
		// 		if( !layer( l ) ) {
		// 			tempLayer.push( l );
		// 		}
		// 	} else if( layer instanceof LayerModel ) {
		// 		if( layer !== l ) {
		// 			tempLayer.push( l );
		// 		}
		// 	}
		// });

		let idx: number = 0;
		while(idx < this.layers.length) {
			let l: LayerModel = this.layers[idx];
			if( typeof layer === 'function' ) {
				if( layer( l ) ) {
					this.layers.splice(idx, 1);
				} else {
					idx ++;
				}
			} else if( layer instanceof LayerModel ) {
				if( layer == l ) {
					this.layers.splice(idx, 1);
				} else {
					idx ++;
				}
			}
		}
	}

	/**
	 * @desc	删除包含有指定element的图层
	 */
	public removeLayerWithElement( element: Function | ElementModel ) {
		this.removeLayer( ( layer: LayerModel ) => {
			return layer.hasElement( element );
		});
	}

	/**
	 * @desc	根据element id获取当前活动帧下的某一个element及其状态
	 */
	public getElementStateInActionFrameById(elementId: string): {
		element: ElementModel,
		state: ElementStateModel,
	} {
		let element: ElementModel;
		let elementState: ElementStateModel;
		let result: {
			element: ElementModel,
			state: ElementStateModel,
		};
		let layer: LayerModel = this.layers.find(l => {
			return l.element.id == elementId;
		});
		if(layer) {
			element = layer.element;
			let frame: FrameModel = layer.getKeyFrameByFrame(Math.max(this.actionOption.start, 0));
			frame && (elementState = frame.elementState);
		}
		result = {
			element: element,
			state: elementState,
		};

		return result;
	}
}

export class PageModel extends BasicModel {
	protected idpre: string = 'page';
	name: string = '';												//name
	background: BackgroundModel = new BackgroundModel();			//背景色
	thumbnail: string = '';											//缩略图
	timeline: TimelineModel = new TimelineModel();
	layers: LayerModel[];

	constructor(options: {
		name?: string,
		background?: BackgroundModel | {},
		thumbnail?: string,
		timeline?: TimelineModel | {}
	} = {}) {
		super();
		super.init(options);
		this.layers = this.timeline.layers;
	}
}

export class SwiperModel extends BasicModel {
	protected idpre: string = 'swiper';
	initialSlide: number = 1;						//初始页序号
	direction: Direction = Direction.vertial;		//动画方向
	speed: number = 100;							//变换速度
	autoPlay: boolean = false;						//是否自动播放
	effect: SwiperEffect = SwiperEffect.slide;		//滑动特效
	loop: boolean = false;							//是否循环播放

	constructor(options: {
		initialSlide?: number,
		direction?: Direction,
		speed?: number,
		autoPlay?: boolean,
		effect?: SwiperEffect | {}
	} = {}) {
		super();
		super.init(options);
	}
}

export class ItemModel extends BasicModel {
	protected idpre: string = 'item'; 						//id 前缀
	id: string = '';								//item id 唯一标识
	name: string = '';								//item name
	thumbnail: string = '';							//缩略图
	private _type: ItemType = ItemType.movieclip;	//类型
	private _source: BasicModel = new PageModel();			//存储资源数据
	constructor(options: {
		name?: string,
		thumbnail?: string,
		type?: ItemType,
		source?: any
	} = {}) {
		super();
		super.init(options);
		this.type = options.type;
		this.source = options.source;
	}

	get type(): ItemType {
		return this._type;
	}

	set type(t: ItemType) {
		if(this.type != t) {
			this._type = t;
			this._source = SourceModel.createSourceModel(t);
		}
	}

	get source(): any {
		return this._source;
	}

	set source( src: any ) {
		this.source.init(src);
	}

}

export class BackgroundModel extends BasicModel {
	protected idpre: string = 'bg';
	color: string = '#ffffff';
	image: string = '';
	repeat: boolean = false;

	constructor(options: {
		color?: string,
		image?: string,
		repeat?: boolean
	} = {}) {
		super();
		super.init(options);
	}
}


export class HotKeyModel extends BasicModel {
	protected idpre: string = 'hotkey';
	target: string = '';
	shift: boolean = false;
	ctrl: boolean = false;
	alt: boolean = false;
	key: string = '';
	api: string = '';
	arguments: Array<any> = [];
	desc: string = '';

	constructor(options: {
		target?: string,
		shift?: boolean,
		ctrl?: boolean,
		alt?: boolean,
		key?: string,
		api?: string,
		arguments?: any[],
		desc?: string
	} = {}) {
		super();
		super.init(options);
		
	}
}

export class StageModel extends BasicModel {
	protected idpre: string = 'stage';
	background: BackgroundModel = new BackgroundModel();
	title: string = '';
	pageType: PageType = PageType.swiper;

	constructor(options: {
		background?: BackgroundModel,
		title?: string,
		pageType?: PageType 
	} = {}) {
		super();
		super.init(options);
	}
}

export class MainModel extends BasicModel {
	protected idpre: string = 'main';
	stage: StageModel = new StageModel();
	swiper: SwiperModel = new SwiperModel();
	pages: Array<PageModel> = [];
	library: Array<ItemModel> = [];

	constructor(options: {
		stage?: StageModel,
		swiper?: SwiperModel,
		pages?: PageModel[],
		library?: ItemModel[]
	} = {}) {
		super();
		super.init(options);
	}
}

export class ProductModel extends BasicModel {
	protected idpre: string = 'product';
	title: string = '';
	user: string = '';
	lastModify: number = 0;
	prodId: string = '';

	constructor(options: {
		title?: string,
		user?: string,
		lastModify?: number,
		prodId?: string
	} = {}) {
		super();
		super.init(options);
	}
}

