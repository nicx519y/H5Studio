import { Injectable } from '@angular/core';
import { PropertiesService } from './properties.service';
import { FontSetterService } from './font-setter.service';
import { PropertyBasicModel } from './properties';

export enum AttrMode {
	property,
	fontSetter
};

@Injectable()
export class AttrsService {

	private _service: FontSetterService | PropertiesService;
	private _mode: AttrMode = AttrMode.property;

	constructor() {
		this.mode = AttrMode.property;
	}

	set mode( modeType: AttrMode ) {
		this._mode = modeType;
		if( modeType == AttrMode.fontSetter ) {
			this._service = new FontSetterService();
		} else if( modeType == AttrMode.property ) {
			this._service = new PropertiesService();
		}
	}

	get mode(): AttrMode {
		return this._mode;
	}

	get attrs(): PropertyBasicModel<any>[] {
		return this._service.attrs;
	}

	get values(): Map<string, any> {
		return this._service.values;
	}
}