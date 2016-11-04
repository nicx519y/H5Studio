import { Component, Input, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'ide-previewer',
  templateUrl: './previewer.component.html',
  styleUrls: ['./previewer.component.css']
})
export class PreviewerComponent implements OnInit {

  @Input()
	public src: string;

	@Input()
	public width: number;

	@Input()
	public height: number;

	@ViewChild('canvas')
	public canvas: ElementRef;

	public previewData: string = '';

	constructor() {
		
	}

	private loadImage() {
		if( this.src == '' ) {
			this.previewData = '';
			return;
		}
		let image = new Image();
		image.onload = ( evt ) => {
			this.imageLoaded( evt.target );
		}
		image.src = this.src;
	}

	private imageLoaded( image ) {
		let sx: number;
		let sy: number;
		let sw: number;
		let sh: number;
		let d: number = image.width / image.height;
		let ic = document.createElement('canvas');
		let icx = ic.getContext('2d');
		let oc = document.createElement('canvas');
		let ocx = oc.getContext('2d');

		if( this.width / this.height >= image.width / image.height ) {
			sh = this.height;
			sw = d * sh;
		} else {
			sw = this.width;
			sh = sw / d;
		}

		sx = ( this.width - sw ) / 2;
		sy = ( this.height - sh ) / 2;

		//抗锯齿绘制
		oc.width = image.width / 2;
		oc.height = image.height / 2;
		ic.width = this.width;
		ic.height = this.height;
		ocx.drawImage(image, 0, 0, oc.width, oc.height);
		ocx.drawImage(oc, 0, 0, oc.width / 2, oc.height / 2);
		icx.drawImage( oc, 0, 0, oc.width / 2, oc.height / 2, Math.floor(sx), Math.floor(sy), Math.floor(sw), Math.floor(sh) );

		this.previewData = ic.toDataURL('image/png');

		ic = oc = icx = ocx = null;
	}


	ngAfterViewInit() {
		this.loadImage();
	}

  ngOnInit() {
  }

}