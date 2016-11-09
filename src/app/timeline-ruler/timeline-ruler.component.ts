import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';



@Component({
	selector: 'ide-timeline-ruler',
	templateUrl: './timeline-ruler.component.html',
	styleUrls: ['./timeline-ruler.component.css']
})
export class TimelineRulerComponent implements OnInit {

	@ViewChild('canvas')
	canvas: ElementRef;

	@Input()
	scaleFrame: number;					//每帧的宽度

	constructor(
		private container: ElementRef
	) { }

	public render( scrollLeft: number = 0 ) {
		//用canvas绘制刻度及文字，将canvas绘制成两倍大小，解决retina设备下的模糊问题
		let containerWidth: number = this.container.nativeElement.offsetWidth * 2;
		let containerHeight: number = this.container.nativeElement.offsetHeight * 2;
		let el = this.canvas.nativeElement;
		let scaleFrame = this.scaleFrame * 2;
		let sl: number = scrollLeft * 2;
		el.width = containerWidth;
		el.height = containerHeight;
		el.style.width = containerWidth / 2 + 'px';
		el.style.height = containerHeight / 2 + 'px'

		let ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
		ctx.save();
		ctx.strokeStyle = '#666';
		ctx.lineWidth = 1;
		ctx.font = 'normal normal 400 18px Helvetica';
		ctx.fillStyle = '#666';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'bottom';

		let f = Math.ceil(sl / scaleFrame);		//当前帧
		let pf = f - sl / scaleFrame;

		while( pf * scaleFrame <= containerWidth ) {
			let x = Math.floor(pf * scaleFrame) - 0.5;
			let y;
			if(f % 5 == 0) {
				y = containerHeight - 12 - 0.5;
				ctx.fillText(f.toString(), x + 5, y - 5);
			} else {
				y = containerHeight - 8 - 0.5;
			}
			ctx.beginPath();
			ctx.moveTo(x, containerHeight);
			ctx.lineTo(x, y);
			ctx.closePath();
			ctx.stroke();
			f += 1;
			pf += 1;
		}
	}

	ngOnInit() {

	}

	ngAfterViewInit() {
		let interval = setInterval(() => {
			if(this.container.nativeElement.offsetWidth != 0) {
				clearInterval(interval);
				console.log('clear');
				this.render();
			}
		}, 10);
	}

	ngAfterContentInit() {
	}

}
