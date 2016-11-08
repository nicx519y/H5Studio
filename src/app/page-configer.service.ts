import { Injectable } from '@angular/core';
import { SwiperEffect, StageModel, PageType, SwiperModel } from './models';

@Injectable()
export class PageConfigerService {

	public config: {
		stage: StageModel,
		swiper: SwiperModel
	} = {
		stage: new StageModel(),
		swiper: new SwiperModel()
	};

	constructor() {

	}
}
