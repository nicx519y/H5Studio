import { Injectable } from '@angular/core';

import { 
	PropertyBasicModel, 
	PropertyTextboxModel, 
	PropertyNumberModel, 
	PropertyRangeModel, 
	PropertyDropdownModel, 
	PropertyColorpickerModel 
} from './properties';

@Injectable()
export class PropertiesService {
	idModel: PropertyTextboxModel;			//id
	libItemModel: PropertyTextboxModel;		//lib name
	originalXModel: PropertyNumberModel;		//原点x坐标
	originalYModel: PropertyNumberModel;		//原点y坐标
	positionXModel: PropertyNumberModel;		//x坐标
	positionYModel: PropertyNumberModel;		//y坐标
	scaleXModel: PropertyNumberModel;		//x scale值
	scaleYModel: PropertyNumberModel;		//y scale值
	rotationModel: PropertyRangeModel;		//旋转
	alphaModel: PropertyRangeModel;			//透明度

	constructor() {
		this.idModel = new PropertyTextboxModel({
			label: 'id: ',
			key: 'id',
			value: ''
		});
		this.libItemModel = new PropertyTextboxModel({
			label: 'item: ',
			key: 'libItem',
			value: '',
			disabled: true
		});
		this.originalXModel = new PropertyNumberModel({
			label: 'ori x: ',
			key: 'origianlX',
			value: 0
		});
		this.originalYModel = new PropertyNumberModel({
			label: 'ori y: ',
			key: 'originalY',
			value: 0
		});
		this.positionXModel = new PropertyNumberModel({
			label: 'x: ',
			key: 'positionX',
			value: 0
		});
		this.positionYModel = new PropertyNumberModel({
			label: 'y: ',
			key: 'positionY',
			value: 0
		});
		this.scaleXModel = new PropertyNumberModel({
			label: 'scale x: ',
			key: 'scaleX',
			value: 1
		});
		this.scaleYModel = new PropertyNumberModel({
			label: 'scale y: ',
			key: 'scaleY',
			value: 1
		});
		this.rotationModel = new PropertyRangeModel({
			label: 'rotation: ',
			key: 'rotation',
			value: 0,
			min: 0,
			max: 360,
			step: 0.1
		});
		this.alphaModel = new PropertyRangeModel({
			label: 'alpha: ',
			key: 'alpha',
			value: 100,
			min: 0,
			max: 100,
			step: 1
		});
	}

	get attrs(): PropertyBasicModel<any>[] {
		let attrs: PropertyBasicModel<any>[] = [
			this.idModel,
			this.libItemModel,
			this.originalXModel,
			this.originalYModel,
			this.positionXModel,
			this.positionYModel,
			this.scaleXModel,
			this.scaleYModel,
			this.rotationModel,
			this.alphaModel
		];

		return attrs;
	}

	get values(): Map<string, any> {
		let values = new Map<string, any>();

		this.attrs.forEach((model) => {
			values.set(model.key, model.value)
		});

		return values;
	}
}