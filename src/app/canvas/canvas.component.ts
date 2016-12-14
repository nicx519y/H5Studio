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
import { MainModel, EditorState, ElementModel, ElementStateModel, FrameModel, TimelineModel } from '../models';
import { TimelineComponent } from '../timeline/timeline.component';
import Developer from '@JDB/janvas-developer/app/main/developer';

@Component({
    selector: 'ide-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent implements OnInit {
    private _mode: EditorState;
    private _page: string = '';
    private _frameIdx: number = 0;
    private _activeElements: string[] = [];
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
        private container: ViewContainerRef,
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
    public set activePage(p: string) {
        if(this._page != p) {
            this._page = p;
            this._frameIdx = 0;
            if(this.janvas) {
                this.timeline.setActionOptions({
                    start: -1,
                    duration: 0,
                    layers: []
                });
                this.janvas && this.janvasUpdate();
            }
        }
    }

    @Input()
    public set activeFrame(f: number) {
        if(this._frameIdx != f && f >= 0) {
            this._frameIdx = f;
            this.janvas && this.janvasUpdate();
        }
    }

    @Input()
    public set activeElements(elements: string[]) {
        let result: boolean = false;
        if(elements.length != this._activeElements.length) 
            result = true;
        else {
            for(let ele of elements) {
                if(this._activeElements.indexOf(ele) < 0) {
                    result = true;
                    break;
                }
            }
        }
        if(result) {
            this._activeElements = elements;
            this.janvas.selectElement(elements);
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
                target.addEventHandler(Developer.EVENTS.ELEMENT_CHANGED, ele => this.janvasChangedHandler(ele));
                target.addEventHandler(Developer.EVENTS.ELEMENT_ADDED, obj => this.janvasAddedHandler(obj));
                this.janvasResize(target);
            }
        );
        this.mode = this._mode;
        this.service.timelineChange.subscribe(() => this.timelineDateChange());
    }

    private janvasSelectedHandler(eleArr: any[]) {
        let data = this.filterJanvasData(eleArr);
        console.log('selected: ', data);
        this.timeline.setActionOptions({
            start: data.frameIndex,
            duration: 1,
            layers: data.elements.map(ele => { return ele.layerId })
        });
        this.elementsSelected.emit(data);
    }

    private janvasChangedHandler(eleArr: any[]) {
        let data = this.filterJanvasData(eleArr);
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
        this.timeline.changeKeyFramesState(this._frameIdx, changes);
        this.elementsChanged.emit(data);
    }

    private janvasAddedHandler(obj: any) {

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
 
    private janvasUpdate() {
        this.data = this.service.data.getValue();
        let page: string = this._page;
        let frame: number = Math.max(this._frameIdx, 0);
        console.log('update page: ', page, ', frame: ', frame);
        this.data && this.janvas.updateJanvasData(this.data, {
            page: page,
            frameIndex: frame,
        });
    }

    public timelineDateChange() {
        this.janvasUpdate();
    }

    

    ngOnInit() {
        setTimeout(this.initJanvas.bind(this), 100);
    }

    // ngOnChanges(change) {
    //     console.log(change);
    // }
}
