import { Injectable } from '@angular/core';
import { MF, SwiperEffect, StageModel, PageType, SwiperModel } from './models';

/// <reference path="immutable/dist/immutable.d.ts" />
import { List, Map, Iterable } from 'immutable';

@Injectable()
export class PageConfigerService {

	private _data: Map<string, any>;

	constructor() {
		
	}
	
	public setData(data: Map<string, any>) {
		if(!Immutable.is(this._data, data)) {
			this._data = data;
		}
	}

	public getData(): Map<string, any> {
		if(this._data) {
			return this._data;
		}
		let data: Map<string, any> = Immutable.Map<string, any>()
			.set('stage', MF.g(StageModel))
			.set('swiper', MF.g(SwiperModel));
		this.setData(data);
		return this._data;
	}
}
