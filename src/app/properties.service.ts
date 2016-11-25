import { Injectable } from '@angular/core';

import { 
	PropertyBasicModel, 
	PropertyTextboxModel, 
	PropertyNumberModel, 
	PropertyRangeModel, 
	PropertyDropdownModel, 
	PropertyColorpickerModel 
} from './properties';

import { ElementStateModel, ElementModel } from './models'; 

@Injectable()
export class PropertiesService {

	public element: ElementModel;
	public state: ElementStateModel;
	public attrs: PropertyBasicModel<any>[] = [];

	constructor() {
		
	}

	get values(): Map<string, any> {
		let values = new Map<string, any>();

		this.attrs.forEach((model) => {
			values.set(model.key, model.value)
		});

		return values;
	}

	public clear() {
		this.attrs.length = 0;
	}

	public setElement(options: {
		element: ElementModel,
		state: ElementStateModel
	}) {
		let ele: ElementModel = this.element = options.element;
		let state: ElementStateModel = this.state = options.state;
		this.attrs.push(
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
		
	}

}