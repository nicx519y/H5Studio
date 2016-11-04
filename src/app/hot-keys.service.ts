import { Injectable } from '@angular/core';
import { HotKeyModel } from './models';
import { EditorState } from './models';

@Injectable()
export class HotKeysService {

	public config: Map<string, HotKeyModel> = new Map<string, HotKeyModel>();

	constructor() {
		this.addHotKeys([
			new HotKeyModel({
				target: 'timeline',
				key: 'f6',
				api: 'changeToKeyFrames',
				desc: '转换为关键帧'
			}),
			new HotKeyModel({
				target: 'timeline',
				key: 'f6',
				shift: true,
				api: 'removeKeyFrames',
				desc: '删除关键帧'
			}),
			new HotKeyModel({
				target: 'timeline',
				key: 'f5',
				api: 'changeToFrames',
				desc: '转换为普通帧'
			}),
			new HotKeyModel({
				target: 'timeline',
				key: 'f5',
				shift: true,
				api: 'removeFrames',
				desc: '删除帧'
			}),
			new HotKeyModel({
				target: 'timeline',
				key: 'f7',
				api: 'changeToEmptyKeyFrames',
				desc: '转换为空白关键帧'
			}),
			new HotKeyModel({
				target: 'timeline',
				key: 'f8',
				api: 'createTweens',
				desc: '添加补间动画'
			}),
			new HotKeyModel({
				target: 'timeline',
				key: 'f8',
				shift: true,
				api: 'removeTweens',
				desc: '删除补间动画'
			}),
			new HotKeyModel({
				target: 'toolsbar',
				key: 'v',
				api: 'changeState',
				arguments: [ EditorState.choise ],
				desc: '选择舞台元素'
			}),
			new HotKeyModel({
				target: 'toolsbar',
				key: 'z',
				api: 'changeState',
				arguments: [ EditorState.zoom ],
				desc: '缩放舞台'
			}),
			new HotKeyModel({
				target: 'toolsbar',
				key: 'p',
				api: 'changeState',
				arguments: [ EditorState.draw ],
				desc: '绘制'
			}),
			new HotKeyModel({
				target: 'toolsbar',
				key: 't',
				api: 'changeState',
				arguments: [ EditorState.font ],
				desc: '插入文字'
			}),
		]);
	}

	public getKeyString( option: HotKeyModel ): string {
		let keys: string[] = [];
		if( option.ctrl ) {
			keys.push( 'ctrl' );
		}
		if( option.shift ) {
			keys.push( 'shift' );
		}
		if( option.alt ) {
			keys.push( 'alt' );
		}
		keys.push( option.key.toLocaleUpperCase() );
		return keys.join( '+' );
	}

	public addHotKey( option: HotKeyModel ) {
		let keyString: string = this.getKeyString( option );
		this.config.set( keyString, option );
	}

	public addHotKeys( options: HotKeyModel[] ) {
		options.forEach( option => {
			this.addHotKey( option );
		})
	}

}