import { Component, OnInit, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core';
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

/// <reference path="immutable/dist/immutable.d.ts" />
import { List, Map } from 'immutable';

@Component({
	selector: 'ide-page-configer',
	templateUrl: './page-configer.component.html',
	styleUrls: ['./page-configer.component.css', '../../assets/modal.form.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageConfigerComponent implements OnInit {

	@Input()
	private model: Map<string, any>;

	@ViewChild('modal')
	private modal: ModalComponent;

	public options: PropertyBasicModel<any>[];

	constructor(
		private service: PageConfigerService
	) {

		
	}

	public show() {
		this.modal.show();
	}

	public hide() {
		this.modal.hide();
	}

	private saveData() {
		this.options.forEach(opt => this.model = this.model.setIn(opt.dataPath, opt.getValue()));
	}
	
	ngOnInit() {
		let title = new PropertyTextboxModel({
			label: '标题：',
			key: 'title',
			value: this.model.getIn(['stage', 'title']),
		});
		let backgroundColor = new PropertyColorpickerModel({
			label: '背景色：',
			key: 'color',
			value: this.model.getIn(['stage', 'background', 'color']),
		});
		let backgroundImage = new PropertyFileSelectModel({
			label: '背景图片：',
			key: 'image',
			value: this.model.getIn(['stage', 'background', 'image']),
		});
		let backgroundRepeat = new PropertySingleCheckboxModel({
			label: '背景重复：',
			key: 'repeat',
			value: this.model.getIn(['stage', 'background', 'repeat']),
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
			value: this.model.getIn(['stage', 'pageTpye']),
		});
		let initialSlide = new PropertyNumberModel({
			label: '起始页：',
			key: 'initialSlide',
			value: this.model.getIn(['swiper', 'initialSlide']),
		});
		let direction = new PropertyDropdownModel({
			label: '页面变换方向：',
			key: 'direction',
			options: [{
				key: '纵向',
				value: Direction.vertial
			}, {
				key: '横向',
				value: Direction.horizontal
			}],
			value: this.model.getIn(['swiper', 'direction']),
		});
		let speed = new PropertyNumberModel({
			label: '变换动画速度：',
			key: 'speed',
			value: this.model.getIn(['swiper', 'speed']),
		});
		let effect = new PropertyDropdownModel({
			label: '变换动画特效：',
			key: 'effect',
			options: [{
				key: 'Slide',
				value: SwiperEffect.slide
			}],
			value: this.model.getIn(['swiper', 'effect']),
		});
		let loop = new PropertySingleCheckboxModel({
			label: '循环播放：',
			key: 'loop',
			value: this.model.getIn(['swiper', 'loop']),
		});
		let autoPlay = new PropertySingleCheckboxModel({
			label: '自动播放：',
			key: 'autoPlay',
			value: this.model.getIn(['swiper', 'autoPlay']),
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
}
