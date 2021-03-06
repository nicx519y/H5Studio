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
				api: 'changeActiveToKeyFrames',
				desc: '转换为关键帧'
			}),
			new HotKeyModel({
				target: 'timeline',
				key: 'f6',
				shift: true,
				api: 'removeActiveKeyFrames',
				desc: '删除关键帧'
			}),
			new HotKeyModel({
				target: 'timeline',
				key: 'f5',
				api: 'changeActiveToFrames',
				desc: '转换为普通帧'
			}),
			new HotKeyModel({
				target: 'timeline',
				key: 'f5',
				shift: true,
				api: 'removeActiveFrames',
				desc: '删除帧'
			}),
			new HotKeyModel({
				target: 'timeline',
				key: 'f7',
				api: 'changeActiveToEmptyKeyFrames',
				desc: '转换为空白关键帧'
			}),
			new HotKeyModel({
				target: 'timeline',
				key: 'f8',
				api: 'createActiveTweens',
				desc: '添加补间动画'
			}),
			new HotKeyModel({
				target: 'timeline',
				key: 'f8',
				shift: true,
				api: 'removeActiveTweens',
				desc: '删除补间动画'
			}),
			new HotKeyModel({
				target: 'toolsbar',
				key: 'v',
				api: 'changeState',
				arguments: [ EditorState.choose ],
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
				key: 'b',
				api: 'changeState',
				arguments: [ EditorState.draw ],
				desc: '绘制'
			}),
			new HotKeyModel({
				target: 'toolsbar',
				key: 't',
				api: 'changeState',
				arguments: [ EditorState.text ],
				desc: '插入文字'
			}),
			new HotKeyModel({
				target: 'ide',
				ctrl: true,
				key: 's',
				api: 'saveData',
				desc: '保存数据'
			}),
			new HotKeyModel({
				target: 'ide',
				ctrl: true,
				key: 'v',
				api: 'preview',
				desc: '预览'
			}),
			new HotKeyModel({
				target: 'ide',
				key: 'f',
				api: 'fullscreen',
				desc: '全屏'
			}),
			new HotKeyModel({
				target: 'pageConfiger',
				ctrl: true,
				key: ',',
				api: 'show',
				desc: '页面配置'
			}),
			new HotKeyModel({
				target: 'bitmapImporter',
				ctrl: true,
				key: 'b',
				api: 'show',
				desc: '导入图片'
			}),
			new HotKeyModel({
				target: 'itemList',
				ctrl: true,
				key: 'i',
				api: 'addItem',
				desc: '新建元件'
			}),
			new HotKeyModel({
				target: 'pageList',
				ctrl: true,
				key: 'p',
				api: 'addEmptyPageAtLast',
				desc: '新增页面'
			})
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