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
    ChangeDetectorRef,
} from '@angular/core';
import { MainService } from '../main.service';
import { TimelineService } from '../timeline.service';
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
    private devCanvas: ElementRef;

    @ViewChild('box')
    private box: ElementRef;

    @Input()
    private mode: EditorState;

    @Output()
    public elementSelected: EventEmitter<{element: ElementModel, state: ElementStateModel}> = new EventEmitter();

    private data: any;
    private janvas: any;

    constructor(
        private service: MainService,
        private tlService: TimelineService,
        private container: ViewContainerRef,
        private cdRef: ChangeDetectorRef
    ) {
        
    }

    @HostListener('window:resize')
    private janvasResize(target=null) {
        let w: number = this.container.element.nativeElement.offsetWidth;
        let h: number = this.container.element.nativeElement.offsetHeight;
        this.box.nativeElement.style.width = w + 'px';
        this.box.nativeElement.style.height = h + 'px';
        (target || this.janvas).resizeJanvasDev(w, h);
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
                target.addEventHandler(Developer.EVENTS.ELEMENT_SELECTED, ele => this.janvasSelectedHandler(ele));
                target.addEventHandler(Developer.EVENTS.ELEMENT_CHANGE, ele => this.janvasChangeHandler(ele));
                this.service.timelineChange.subscribe((tlService: TimelineService) => this.timelineDateChange(tlService));
                this.janvasResize(target);
            }
        );
    }

    private janvasSelectedHandler(obj) {
        let id: string = obj.elementId;
        let result: { 
            element: ElementModel, 
            state: ElementStateModel,
        };
        result = this.service.getElementStateInActionFrameById(id);
        result && this.elementSelected.emit(result);
    }

    private janvasChangeHandler(ele) {
        let id: string = ele.id;
        let obj: { element: ElementModel, state: ElementStateModel } = this.service.getElementStateInActionFrameById(id);
        this.janvasUpdate(()=>this.elementSelected.emit(obj));
    }

    private janvasUpdate(callback: Function=null) {
        this.data = this.service.data.getValue();
        this.data && this.janvas.updateJanvasData(this.data, () => {
            this.janvas.gotoPage(this.tlService.stageId);
            this.janvas.gotoFrame(Math.max(this.tlService.timeline.actionOption.start, 0));
            callback && callback();
        });
    }

    public timelineDateChange(tlService: TimelineService) {
        this.janvasUpdate();
    }

    ngOnInit() {
        setTimeout(this.initJanvas.bind(this), 100);
    }

    ngOnChanges(change) {
        if(change.mode && this.janvas) {
            switch(change.mode.currentValue) {
                case EditorState.none:
                    this.janvas.changeMode(Developer.MODE.READ_MODE);
                    break;
                case EditorState.choose:
                    this.janvas.changeMode(Developer.MODE.EDIT_MODE);
                    break;
                case EditorState.text:
                    this.janvas.changeMode(Developer.MODE.TEXT_MODE);
                    break;
                case EditorState.zoom: 
                    
                    break;
                case EditorState.draw:
                    this.janvas.changeMode(Developer.MODE.DRAW_MODE);
                    break;
            }
        }
    }
}
