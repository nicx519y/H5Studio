import { Component, OnInit, Input } from '@angular/core';
import { PropertyBasicModel } from '../properties';
import { AttrsService, AttrMode } from '../attrs.service';
import { AttrFormComponent } from '../attr-form/attr-form.component';
import { ElementModel, ElementStateModel, EditorState } from '../models';

@Component({
	selector: 'ide-attrs',
	templateUrl: './attrs.component.html',
	styleUrls: ['./attrs.component.css']
})
export class AttrsComponent implements OnInit {

	options: PropertyBasicModel<string>[];

	constructor(
		private service: AttrsService
	) {
		
	}

	public setElement(options: {
		element: ElementModel,
		state: ElementStateModel, 
	}) {
		this.service.setElement(options);
	}

	@Input()
	public set state(state: EditorState) {
		switch(state) {
			case EditorState.choose:
				this.service.mode = AttrMode.property;
				break;
			case EditorState.text:
				this.service.mode = AttrMode.fontSetter;
				break;
			default:
				this.service.clear();
				break;
		}
	}

	private onSubmit() {
		this.service.submit();
	}

	ngOnInit() {
		// this.service.mode = AttrMode.fontSetter;
		this.options = this.service.attrs;
	}

}
