import { Injectable } from '@angular/core';
import { 
	PropertyBasicModel,
	PropertyTextboxModel,
	PropertyNumberModel,
	PropertyRangeModel,
	PropertyDropdownModel,
	PropertyColorpickerModel,
	PropertyBooleanModel,
	PropertySingleSelectionModel,
} from './properties';
import { ElementModel, ElementStateModel } from './models';

@Injectable()
export class FontSetterService {
	familyModel: PropertyDropdownModel;
	sizeModel: PropertyNumberModel;
	colorModel: PropertyColorpickerModel;
	styleModel: PropertyDropdownModel;
	alignModel: PropertySingleSelectionModel;
	lineHeightModel: PropertyNumberModel;

	constructor() {
		this.familyModel = new PropertyDropdownModel({
			label: 'Family:',
			key: 'fontFamily',
			value: 'arial',
			options: [{
				key: 'Arial',
				value: 'arial'
			}, {
				key: '新细明体',
				value: 'PMingLiU'
			}, {
				key: '细明体',
				value: 'MingLiU'
			}, {
				key: '标楷体',
				value: 'DFKai-SB' 
			}, {
				key: '黑体',
				value: 'SimHei'
			}, {
				key: '宋体',
				value: 'SimSun'
			}, {
				key: '新宋体',
				value: 'NSimSun'
			}, {
				key: '仿宋',
				value: 'NSimSun'				
			}, {
				key: '仿宋',
				value: 'FangSong'				
			}, {
				key: '楷体',
				value: 'KaiTi'
			}, {
				key: '仿宋_GB2312',
				value: 'FangSong_GB2312'
			}, {
				key: '楷体_GB2312',
				value: 'KaiTi_GB2312'
			}, {
				key: '微软正黑体',
				value: 'Microsoft JhengHei'
			}, {
				key: '微软雅黑体',
				value: 'Microsoft YaHei'
			}]
		});

		this.sizeModel = new PropertyNumberModel({
			label: 'Size:',
			key: 'fontSize',
			value: '12',
			min: 0,
			max: 100,
			step: 1
		});

		this.colorModel = new PropertyColorpickerModel({
			label: 'Color:',
			key: 'color',
			value: '#000000',
		});

		this.styleModel = new PropertyDropdownModel({
			label: 'Style:',
			key: 'fontStyle',
			value: 'regular',
			options: [{
				key: 'Regular',
				value: 'regular'
			}, {
				key: 'Italic',
				value: 'italic'
			}, {
				key: 'Bold',
				value: 'bold'
			}, {
				key: 'Bold Italic',
				value: 'bold italic'
			}]
		});

		this.alignModel = new PropertySingleSelectionModel({
			label: 'Format:',
			key: 'align',
			value: 'left',
			options: [{
				class: 'glyphicon glyphicon-align-left',
				value: 'left'
			}, {
				class: 'glyphicon glyphicon-align-center',
				value: 'center'
			}, {
				class: 'glyphicon glyphicon-align-right',
				value: 'right'
			}, {
				class: 'glyphicon glyphicon-align-justify',
				value: 'justify'
			}]
		});

		this.lineHeightModel = new PropertyNumberModel({
			label: 'Lineheight:',
			key: 'lineheight',
			value: 18,
			min: 0,
			max: 100,
			step: 1
		});
	}

	get attrs(): PropertyBasicModel<any>[] {
		return [
			this.familyModel,
			this.styleModel,
			this.sizeModel,
			this.lineHeightModel,
			this.colorModel,
			this.alignModel,
		];
	}

	get values(): Map<string, any> {
		let values = new Map<string, any>();

		this.attrs.forEach((model) => {
			values.set(model.key, model.value)
		});

		return values;
	}

	public setElement(options: {
		element: ElementModel,
		state: ElementStateModel
	}) {
		
	}

	public clear() {

	}
}