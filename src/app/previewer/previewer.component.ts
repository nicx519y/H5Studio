import { Component, Input, ElementRef, AfterViewInit, ViewChild, OnInit, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ide-previewer',
  templateUrl: './previewer.component.html',
  styleUrls: ['./previewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewerComponent implements OnInit {

  	@Input()
	private src: string;

	@Input()
	private width: number;

	@Input()
	private height: number;

	@ViewChild('image')
	private image: ElementRef;

	private n: number = 2;		//像素倍数

	constructor() {
		
	}

	private loadImage() {
		if( this.src == '' ) {
			this.image && (this.image.nativeElement.src = 'about:blank');
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
		let n = this.n;	//用于适配retina屏幕

		if( this.width / this.height >= image.width / image.height ) {
			sh = this.height * n;
			sw = d * sh;
		} else {
			sw = this.width * n;
			sh = sw / d;
		}

		sx = ( this.width * n - sw ) / 2;
		sy = ( this.height * n - sh ) / 2;

		//抗锯齿绘制 两次插值
		oc.width = image.width / 2;
		oc.height = image.height / 2;
		ic.width = this.width * n;
		ic.height = this.height * n;
		ocx.drawImage(image, 0, 0, oc.width, oc.height);
		ocx.drawImage(oc, 0, 0, oc.width / 2, oc.height / 2);
		icx.drawImage( oc, 0, 0, oc.width / 2, oc.height / 2, Math.floor(sx), Math.floor(sy), Math.floor(sw), Math.floor(sh) );
		
		this.image.nativeElement.src = ic.toDataURL('image/png');

		ic = oc = icx = ocx = null;
	}


	ngAfterViewInit() {
		
	}
	ngOnInit() {

	}
	ngOnChanges(changes) {
		if(changes.hasOwnProperty('src')) {
			this.loadImage();
		}
	}

	
}
