import { Component, ViewChild, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { BitmapModel } from '../models';
import { BitmapImporterService } from '../bitmap-importer.service';


@Component({
	selector: 'ide-bitmap-importer',
	templateUrl: './bitmap-importer.component.html',
	styleUrls: ['./bitmap-importer.component.css', '../../assets/modal.form.css']
})
export class BitmapImporterComponent implements OnInit {

  	@ViewChild('modal')
	public modal: ModalComponent;

	@ViewChild('fileInput')
	public fileInput: ElementRef;

	constructor(
		private service: BitmapImporterService
	) {
		this.service.uploadCompleteEvent.subscribe( bitmaps => {
			this.hide();
		});
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
				this.service.createNewBitmap({
					source: reader.result,
					fileName: file.name,
					name: file.name,
					size: file.size
				});
			};
			reader.readAsDataURL( file );
		}
		evt.target.value = '';
	}

	private hasFile( file: File ): boolean {
		let bitmap: BitmapModel = this.service.bitmaps.find((value: BitmapModel, index: number) => {
			return value.fileName === file.name;
		});
		return !!bitmap;
	}

	private fileFilter(value) {
		var regexp=new RegExp("(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png)$",'g');
		return regexp.test(value);
	}

	ngAfterViewInit() {
		this.modal.onHidden.subscribe( () => {
			this.service.clearData();
		});
	}

  ngOnInit() {
  }

}
