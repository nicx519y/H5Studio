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
			state: EditorState.choise,
			class: 'glyphicon-screenshot'
		},
		{
			state: EditorState.font,
			class: 'glyphicon-font'
		},
		{
			state: EditorState.zoom,
			class: 'glyphicon-zoom-in'
		},
		{
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
