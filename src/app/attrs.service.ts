import { Injectable } from '@angular/core';
import { 
	PropertyBasicModel,
	PropertyTextboxModel,
	PropertyNumberModel,
	PropertyRangeModel,
} from './properties';
import { ElementModel, ElementStateModel } from './models';

export enum AttrMode {
	none,
	property,
	fontSetter,
};

@Injectable()
export class AttrsService {

	private _mode: AttrMode = AttrMode.property;
	public attrs: PropertyBasicModel<any>[] = [];

	constructor() {
		this.mode = AttrMode.none;
	}

	public set mode( modeType: AttrMode ) {
		if(modeType == this.mode) return;
		this._mode = modeType;
		this.clear();
	}

	public get mode(): AttrMode {
		return this._mode;
	}

	public clear() {
		this.attrs.length = 0;
	}

	public setElement(options: {
		element: ElementModel,
		state: ElementStateModel
	}) {
		this.clear();
		if(this.mode == AttrMode.property) {
			this.getPropertysModels(options).forEach(model => this.attrs.push(model));
		} else if(this.mode == AttrMode.fontSetter) {
			this.getFontSettingModels(options).forEach(model => this.attrs.push(model));
		}
	}

	private getPropertysModels(options: {element: ElementModel, state: ElementStateModel}): PropertyBasicModel<any>[]  {
		let models: PropertyBasicModel<any>[] = [];
		let ele: ElementModel = options.element;
		let state: ElementStateModel = options.state;
		models.push(
			new PropertyTextboxModel({
				label: 'id: ',
				key: 'instanceName',
				value: ele.instanceName
			}),
			new PropertyTextboxModel({
				label: 'item: ',
				key: 'item',
				value: ele.item,
				disabled: true
			}),
			new PropertyNumberModel({
				label: 'center x: ',
				key: 'originX',
				value: state.originX
			}),
			new PropertyNumberModel({
				label: 'center y: ',
				key: 'originY',
				value: state.originY
			}),
			new PropertyNumberModel({
				label: 'x: ',
				key: 'x',
				value: state.x
			}),
			new PropertyNumberModel({
				label: 'y: ',
				key: 'y',
				value: state.y
			}),
			new PropertyNumberModel({
				label: 'scale x: ',
				key: 'scaleX',
				value: state.scaleX
			}),
			new PropertyNumberModel({
				label: 'scale y: ',
				key: 'scaleY',
				value: state.scaleY
			}),
			new PropertyRangeModel({
				label: 'rotation: ',
				key: 'rotation',
				value: state.rotation,
				min: 0,
				max: 360,
				step: 0.1
			}),
			new PropertyRangeModel({
				label: 'alpha: ',
				key: 'alpha',
				value: state.alpha,
				min: 0,
				max: 100,
				step: 1
			}),
		);
		return models;
	}

	private getFontSettingModels({element: ElementModel, state: ElementStateModel}): PropertyBasicModel<any>[] {
		let models: PropertyBasicModel<any>[] = [];
		return models;
	}
}