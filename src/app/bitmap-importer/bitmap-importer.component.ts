import { Component, Input, ViewChild, ElementRef, ChangeDetectionStrategy, EventEmitter, OnInit } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { MF, BitmapModel } from '../models';
import { BitmapImporterService } from '../bitmap-importer.service';
import { ItemsService } from '../items.service';

/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { List, Map } from 'immutable';


@Component({
	selector: 'ide-bitmap-importer',
	templateUrl: './bitmap-importer.component.html',
	styleUrls: ['./bitmap-importer.component.css', '../../assets/modal.form.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitmapImporterComponent implements OnInit {

  	@ViewChild('modal')
	public modal: ModalComponent;

	@ViewChild('fileInput')
	public fileInput: ElementRef;

	@Input()
	private model: List<BitmapModel>;

	constructor(
		private service: BitmapImporterService,
		private itemsService: ItemsService,
	) {
	}

	public show() {
		this.modal.show();
	}

	public hide() {
		this.modal.hide();
	}

	public importStart() {
		//....
		this.service.upload();
	}

	public removeBitmap( index: number ) {
		this.service.removeBitmap( index );
	}

	private fileInputChange( evt ) {
		if( evt.target.value == '' ) return;
		let files: FileList = evt.target.files;
		for( let i = 0, file: File; file = files[i]; i ++ ) {
			if( !this.fileFilter( file.type ) ) {  
				continue;
			}

			if( this.hasFile( file ) ) {		//不加载重复图片
				continue;
			}

			let reader: FileReader = new FileReader();
			reader.onload = ( evt: ProgressEvent ) => {
				let bitmap = MF.g(BitmapModel, {
					url: String(reader.result),
					name: file.name,
					fileSize: file.size,
					fileName: file.name,
				});
				this.service.addBitmap(bitmap);
			};
			reader.readAsDataURL( file );
		}
		evt.target.value = '';
	}

	private hasFile( file: File ): boolean {
		let bitmap: BitmapModel = this.model.find(value => value.get('fileName') === file.name);
		return !!bitmap;
	}

	private fileFilter(value) {
		var regexp=new RegExp("(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png)$",'g');
		return regexp.test(value);
	}

	private uploadCompleteHandler(data: List<BitmapModel>) {
		this.itemsService.addBitmaps(data);
	}

	private submitName(index: number, value: string) {
		this.service.setBitmap(this.service.getBitmap(index).set('name', value), index);
	}

	ngAfterViewInit() {
		this.modal.onHidden.subscribe( () => this.service.clearData() );
		this.service.uploadCompleteEvent.subscribe(data => this.uploadCompleteHandler(data));
	}

	ngOnInit() {
		this.service.uploadCompleteEvent.subscribe( bitmaps => this.hide());
	}

	ngOnChanges(change) {
		
	}

}
