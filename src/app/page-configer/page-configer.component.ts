import { Component, OnInit, ViewChild } from '@angular/core';
import { PageConfigerService } from '../page-configer.service';
import { ModalComponent } from '../modal/modal.component';
import { PageType, Direction, SwiperEffect, BackgroundModel, SwiperModel, StageModel } from '../models';
import {
	PropertyBasicModel,
	PropertyTextboxModel,
	PropertyNumberModel,
	PropertyRangeModel,
	PropertyDropdownModel,
	PropertyColorpickerModel,
	PropertyBooleanModel,
	PropertySingleSelectionModel,
	PropertySingleCheckboxModel,
	PropertyFileSelectModel,
} from '../properties';

@Component({
	selector: 'ide-page-configer',
	templateUrl: './page-configer.component.html',
	styleUrls: ['./page-configer.component.css', '../../assets/modal.form.css'],
})
export class PageConfigerComponent implements OnInit {

	@ViewChild('modal')
	modal: ModalComponent;

	public options: PropertyBasicModel<any>[];

	constructor(
		private service: PageConfigerService
	) {

		let title = new PropertyTextboxModel({
			label: '标题：',
			key: 'title',
			value: service.config.stage.title
		});
		let backgroundColor = new PropertyColorpickerModel({
			label: '背景色：',
			key: 'backgroundColor',
			value: service.config.stage.background.color
		});
		let backgroundImage = new PropertyFileSelectModel({
			label: '背景图片：',
			key: 'backgroundImage',
			value: service.config.stage.background.image
		});
		let backgroundRepeat = new PropertySingleCheckboxModel({
			label: '背景重复：',
			key: 'backgroundRepeat',
			value: service.config.stage.background.repeat
		});
		let pageType = new PropertyDropdownModel({
			label: '变换模式：',
			key: 'pageType',
			options: [{
				key: 'none',
				value: PageType.none
			}, {
				key: 'swiper',
				value: PageType.swiper
			}],
			value: service.config.stage.pageType
		});
		let initialSlide = new PropertyNumberModel({
			label: '起始页：',
			key: 'swiperInitialSlide',
			value: service.config.swiper.initialSlide
		});
		let direction = new PropertyDropdownModel({
			label: '页面变换方向：',
			key: 'swiperDirection',
			options: [{
				key: '纵向',
				value: Direction.vertial
			}, {
				key: '横向',
				value: Direction.horizontal
			}],
			value: service.config.swiper.direction,
			visible: (pageType.value == PageType.swiper)
		});
		let speed = new PropertyNumberModel({
			label: '变换动画速度：',
			key: 'swiperSpeed',
			value: service.config.swiper.speed
		});
		let effect = new PropertyDropdownModel({
			label: '变换动画特效：',
			key: 'swiperEffect',
			options: [{
				key: 'Slide',
				value: SwiperEffect.slide
			}],
			value: service.config.swiper.effect
		});
		let loop = new PropertySingleCheckboxModel({
			label: '循环播放：',
			key: 'swiperLoop',
			value: service.config.swiper.loop
		});
		let autoPlay = new PropertySingleCheckboxModel({
			label: '自动播放：',
			key: 'swiperAutoPlay',
			value: service.config.swiper.autoPlay
		});

		this.options = [
			title,
			backgroundColor,
			backgroundImage,
			backgroundRepeat,
			pageType,
			initialSlide,
			direction,
			speed,
			effect,
			loop,
			autoPlay,
		];
	}

	public show() {
		this.modal.show();
	}

	public hide() {
		this.modal.hide();
	}

	
	ngOnInit() {

	}
}
