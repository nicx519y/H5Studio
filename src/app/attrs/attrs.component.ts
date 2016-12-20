import { Component, OnInit, Input } from '@angular/core';
import { PropertyBasicModel } from '../properties';
import { AttrsService, AttrMode } from '../attrs.service';
import { TimelineService } from '../timeline.service';
import { AttrFormComponent } from '../attr-form/attr-form.component';
import { ElementModel, ElementStateModel, EditorState } from '../models';

@Component({
	selector: 'ide-attrs',
	templateUrl: './attrs.component.html',
	styleUrls: ['./attrs.component.css']
})
export class AttrsComponent implements OnInit {

	private activeFrame: number = -1;
	public options: PropertyBasicModel<string>[];

	constructor(
		private service: AttrsService,
		private timelineService: TimelineService,
	) {
		
	}

	public setElements(options: {
		frameIndex: number, 
        elements: {
            elementId: string,
            layerId: string,
            elementState: any,
            bounds: any
        }[]
	}) {
		// this.service.setElement(options);
		if(options.elements.length == 1) {
			let ele = options.elements[0];
			let result: {
				element: ElementModel,
				state: ElementStateModel,
			} = {
				element: this.timelineService.getLayerById(ele.layerId).element,
				state: ele.elementState,
			};
			this.service.setElement(result);
		} else if(options.elements.length > 1) {
			
		} else {
			this.service.clear();
		}
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
	/**
	 * @desc	改变帧状态
	 */
	private changeFramesState(frameIndex: number, changes: {
		layerId: string,
		frame: any
	}[]) {
		let layers: string[] = changes.map(change => { return change.layerId; });
		this.timelineService.changeToFrames(frameIndex, frameIndex, layers);
		this.timelineService.changeKeyFramesState(frameIndex, changes);
	}

	private onSubmit() {
		this.service.submit();
	}

	ngOnInit() {
		// this.service.mode = AttrMode.fontSetter;
		this.options = this.service.attrs;
	}

}
