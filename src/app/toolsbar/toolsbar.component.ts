import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { EditorState } from '../models';

@Component({
  selector: 'ide-toolsbar',
  templateUrl: './toolsbar.component.html',
  styleUrls: ['./toolsbar.component.css']
})
export class ToolsbarComponent implements OnInit {

  public state: EditorState = EditorState.none;
	public states = [
		{
			name: '选择元素',
			state: EditorState.choose,
			class: 'glyphicon-screenshot'
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
	
	@Output()
	public stageChangeEvent: EventEmitter<EditorState> = new EventEmitter();

	constructor() {

	}

	public changeState( state: EditorState ) {
		if( this.state != state ) {
			this.stageChangeEvent.emit( state );
		}
		this.state = state;
	}

  ngOnInit() {
  }

}
