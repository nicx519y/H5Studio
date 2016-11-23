import { 
    Component, 
    OnInit, 
    OnChanges, 
    ViewChild, 
    ElementRef, 
    ViewContainerRef, 
    HostListener, 
    Input, 
    ChangeDetectionStrategy,
    SimpleChange,
} from '@angular/core';
import { MainService } from '../main.service';
import { MainModel } from '../models';
import Developer from '@JDB/janvas-developer/app/main/developer';

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent implements OnInit {

    @ViewChild('dev')
    devCanvas: ElementRef;

    @ViewChild('box')
    box: ElementRef;

    @Input()
    data: MainModel;

    private janvas: any;

    constructor(
        private service: MainService,
        private container: ViewContainerRef
    ) {
    }

    @HostListener('window:resize')
    private janvasResize() {
        let w: number = this.container.element.nativeElement.offsetWidth;
        let h: number = this.container.element.nativeElement.offsetHeight;
        this.box.nativeElement.style.width = w + 'px';
        this.box.nativeElement.style.height = h + 'px';
        this.janvas.resizeJanvasDev(w, h);
    }

    private initJanvas() {
        this.janvas = new Developer(
            'dev',
            {
                canvasWidth: 10, //canvas width
                canvasHeight: 10, //canvas height
                data: new MainModel() //janvas data
            },
            (target) => {
                target.changeMode(Developer.MODE.READ_MODE);
            }
        );
    }

    ngOnInit() {
        setTimeout(() => {
            this.initJanvas();
            this.janvasResize();
        }, 100);
    }

    ngOnChanges(change: { data: SimpleChange }) {
        if(change.data && change.data.currentValue) {
            console.log(change);
            this.janvas && this.janvas.updateJanvasData(change.data.currentValue);
        }
    }

}
