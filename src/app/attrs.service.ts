import { Injectable, Output, EventEmitter } from '@angular/core';
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

	@Output()
	attrsSubmit: EventEmitter<any> = new EventEmitter();

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
				value: ele.instanceName,
				model: ele
			}),
			new PropertyTextboxModel({
				label: 'item: ',
				key: 'item',
				value: ele.item,
				disabled: true,
				model: ele
			}),
			new PropertyNumberModel({
				label: 'center x: ',
				key: 'originX',
				value: Math.round(state.originX),
				model: state
			}),
			new PropertyNumberModel({
				label: 'center y: ',
				key: 'originY',
				value: Math.round(state.originY),
				model: state
			}),
			new PropertyNumberModel({
				label: 'x: ',
				key: 'e',
				value: Math.round(state.matrix.e),
				model: state.matrix
			}),
			new PropertyNumberModel({
				label: 'y: ',
				key: 'f',
				value: Math.round(state.matrix.f),
				model: state.matrix
			}),
			new PropertyNumberModel({
				label: 'rotation: ',
				key: 'rotation',
				value: Math.round(state.rotation),
				model: state
			}),
			new PropertyNumberModel({
				label: 'scale x: ',
				key: 'scaleX',
				value: Math.round(state.scaleX * 10) / 10,
				model: state
			}),
			new PropertyNumberModel({
				label: 'scale y: ',
				key: 'scaleY',
				value: Math.round(state.scaleY * 10) / 10,
				model: state
			}),
			new PropertyNumberModel({
				label: 'skew x: ',
				key: 'skewX',
				value: Math.round(state.skewX * 10) / 10,
				model: state
			}),
			new PropertyNumberModel({
				label: 'skew y: ',
				key: 'skewY',
				value: Math.round(state.skewY * 10) / 10,
				model: state
			}),
			new PropertyRangeModel({
				label: 'alpha: ',
				key: 'alpha',
				value: Math.round(state.alpha),
				min: 0,
				max: 100,
				step: 1,
				model: state
			}),
		);
		return models;
	}

	private getFontSettingModels({element: ElementModel, state: ElementStateModel}): PropertyBasicModel<any>[] {
		let models: PropertyBasicModel<any>[] = [];
		return models;
	}

	public submit() {
		this.attrs.forEach(attr => attr.setModel());
		this.attrsSubmit.emit();
	}
}