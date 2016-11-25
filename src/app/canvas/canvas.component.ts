import { 
    Component, 
    OnInit, 
    OnChanges, 
    ViewChild, 
    ElementRef, 
    ViewContainerRef, 
    HostListener, 
    Input, 
    Output,
    ChangeDetectionStrategy,
    SimpleChange,
    EventEmitter,
} from '@angular/core';
import { MainService } from '../main.service';
import { MainModel, EditorState, ElementModel, ElementStateModel } from '../models';
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

    @Input()
    mode: EditorState;

    @Output()
    elementSelected: EventEmitter<{element: ElementModel, state: ElementStateModel}> = new EventEmitter();

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
                console.log(Developer.EVENTS.ELEMENT_SELECTED);
                target.changeMode(Developer.MODE.READ_MODE);
                target.addEventHandler(Developer.EVENTS.ELEMENT_SELECTED, ele => this.janvasSelectedHandler(ele));
                target.addEventHandler(Developer.EVENTS.ELEMENT_CHANGE, ele => this.janvasChangeHandler(ele));
            }
        );
    }

    private janvasSelectedHandler(ele) {
        let id: string = ele.id;
        let obj: { element: ElementModel, state: ElementStateModel } = this.service.getElementStateInActionFrameById(id);
        obj && this.elementSelected.emit(obj);
    }

    private janvasChangeHandler(ele) {
        console.log(ele);
    }

    ngOnInit() {
        setTimeout(() => {
            this.initJanvas();
            this.janvasResize();
        }, 100);
    }

    ngOnChanges(change) {
        if(change.data && change.data.currentValue) {
            console.log(change.data.currentValue);
            this.janvas && this.janvas.updateJanvasData(change.data.currentValue);
        }
        if(change.mode) {
            switch(change.mode.currentValue) {
                case EditorState.none:
                    this.janvas && this.janvas.changeMode(Developer.MODE.READ_MODE);
                    break;
                case EditorState.choose:
                    this.janvas && this.janvas.changeMode(Developer.MODE.EDIT_MODE);
                    break;
                case EditorState.text:
                    this.janvas && this.janvas.changeMode(Developer.MODE.TEXT_MODE);
                    break;
                case EditorState.zoom: 
                    
                    break;
                case EditorState.draw:
                    this.janvas && this.janvas.changeMode(Developer.MODE.DRAW_MODE);
                    break;
            }
        }
    }

}
