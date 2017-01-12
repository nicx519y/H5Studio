import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { EditorState } from '../models';

@Component({
	selector: 'ide-toolsbar',
	templateUrl: './toolsbar.component.html',
	styleUrls: ['./toolsbar.component.css']
})
export class ToolsbarComponent implements OnInit {

	public state: EditorState = EditorState.choose;
	public states = [
		{
			name: '选择元素',
			state: EditorState.choose,
			class: 'glyphicon-screenshot',
		},
		{
			name: '插入文本',
			state: EditorState.text,
			class: 'glyphicon-font'
		},
		{
			name: '缩放视图',
			state: EditorState.zoom,
			class: 'glyphicon-zoom-in'
		},
		{
			name: '绘制图形',
			state: EditorState.draw,
			class: 'glyphicon-pencil'
		},
	];
	
	constructor() {

	}

	public changeState( state: EditorState ) {
		this.state = state;
	}

	ngOnInit() {
		
	}

}
