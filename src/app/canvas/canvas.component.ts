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
import { MainModel, EditorState, ElementModel, ElementStateModel, FrameModel } from '../models';
import { TimelineComponent } from '../timeline/timeline.component';
import Developer from '@JDB/janvas-developer/app/main/developer';

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent implements OnInit {
    private _mode: EditorState;
    private _page: string = 'stage';
    private _frameIdx: number = 0;
    private data: any;
    private janvas: any;

    @ViewChild('dev')
    private devCanvas: ElementRef;

    @ViewChild('box')
    private box: ElementRef;

    @Output()
    public elementsSelected: EventEmitter<{
        frameIndex: number, 
        elements: {
            elementId: string,
            layerId: string,
            elementState: any,
            bounds: any
        }[]
    }> = new EventEmitter();

    @Output()
    public elementsChanged: EventEmitter<any> = new EventEmitter();

    @Input()
    private timeline: TimelineComponent;

    constructor(
        private service: MainService,
        // private tlService: TimelineService,
        private container: ViewContainerRef,
        private cdRef: ChangeDetectorRef
    ) {
        
    }

    @Input()
    public set mode(mode: EditorState) {
        this._mode = mode;

        if(this.janvas) {
            switch(mode) {
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

    @Input()
    public set page(p: string) {
        if(this._page != p) {
            this._page = p;
            this.janvas && this.janvas.gotoPage(p);
        }
    }

    @Input()
    public set frame(f: number) {
        if(this._frameIdx != f) {
            this._frameIdx = f;
            this.janvas && this.janvas.gotoFrame(f);
        }
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
                this.timeline.dataChange.subscribe(() => this.timelineDateChange());
                this.janvasResize(target);
            }
        );
    }

    private janvasSelectedHandler(eleArr: any[]) {
        // console.log('selected: ', eleArr);
        let data = this.filterJanvasData(eleArr);
        this.timeline.setActionOptions({
            start: data.frameIndex,
            duration: 1,
            layers: data.elements.map(ele => { return ele.layerId })
        });
        this.elementsSelected.emit(data);
    }

    private janvasChangeHandler(eleArr: any[]) {
        // console.log('change: ', eleArr);
        let data = this.filterJanvasData(eleArr);
        this.elementsChanged.emit(data);
        let layerIds: string[] = data.elements.map(ele => { return ele.layerId });
        this.timeline.changeToKeyFrames(data.frameIndex, data.frameIndex, layerIds);
        let changes = data.elements.map(ele => {
            return {
                layerId: ele.layerId,
                frame: {
                    elementState: ele.elementState
                },
            };
        });
        this.timeline.changeKeyFramesState(data.frameIndex, changes);
    }

    private filterJanvasData(eleArr: any[]): {
        frameIndex: number, 
        elements: {
            elementId: string,
            layerId: string,
            elementState: any,
            bounds: any
        }[]
    } {
        if(!eleArr || eleArr.length <= 0)
            return null;

        let elements: {
            elementId: string,
            layerId: string,
            elementState: any,
            bounds: any,
        }[] = eleArr.map(ele => {
            let result = {
                elementId: ele.elementId,
                layerId: ele.layerId,
                elementState: ele.state,
                bounds: ele.transformedBounds
            };
            return result;
        });
        let result = {
            frameIndex: eleArr[0].frameIndex,
            elements: elements
        };
        return result;
    }
 
    private janvasUpdate(callback: Function=null) {
        this.data = this.service.data.getValue();
        console.log(this.data);
        this.data && this.janvas.updateJanvasData(this.data, () => {
            this.janvas.gotoPage(this._page);
            this.janvas.gotoFrame(this._frameIdx);
            callback && callback();
        });
    }

    public timelineDateChange() {
        this.janvasUpdate();
    }

    

    ngOnInit() {
        setTimeout(this.initJanvas.bind(this), 100);
    }

    // ngOnChanges(change) {
    // }
}
