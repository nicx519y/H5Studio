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
import { TimelineService } from '../timeline.service';
import { AttrsService, AttrMode } from '../attrs.service';
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

    constructor(
        private service: MainService,
        private timelineService: TimelineService,
        private attrsService: AttrsService,
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
                this.timelineService.setActionOptions({
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
    private mainData: MainModel;

    // @Input()
    // public set activeElements(elements: string[]) {
    //     let result: boolean = false;
    //     if(elements.length != this._activeElements.length) 
    //         result = true;
    //     else {
    //         for(let ele of elements) {
    //             if(this._activeElements.indexOf(ele) < 0) {
    //                 result = true;
    //                 break;
    //             }
    //         }
    //     }
    //     if(result) {
    //         this._activeElements = elements;
    //         this.janvas.selectElement(elements);
    //     }
    // }

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
        this.service.timelineChange.subscribe(() => this.janvasUpdate());
    }

    private janvasSelectedHandler(eleArr: any[]) {
        this.timelineService.setElementsSelected(eleArr);
    }

    private janvasChangedHandler(eleArr: any[]) {
        if(!eleArr || eleArr.length <= 0) return;
        let frameIndex: number = eleArr[0].frameIndex;
        let layerIds: string[] = eleArr.map(ele => { return ele.layerId });
        this.timelineService.changeToKeyFrames([frameIndex], layerIds);
        let changes = eleArr.map(ele => {
            return {
                layerId: ele.layerId,
                frame: {
                    elementState: ele.state
                },
            };
        });
        this.timelineService.changeKeyFramesState(this._frameIdx, changes);
    }

    private janvasAddedHandler(obj: any) {

    }

    private janvasUpdate() {
        this.data = this.service.data.getValue();
        let page: string = this._page;
        let frame: number = Math.max(this._frameIdx, 0);
        this.data && this.janvas.updateJanvasData(this.data, {
            page: page,
            frameIndex: frame,
        });
    }

    private timelineActionInput() {
        this.janvas.selectElement(this.timelineService.elementsWithActionLayer);
    }

    private attrsChange(options: {
        key: string,
        value: any,
    }[]) {
        let mode: AttrMode = this.attrsService.mode;
        switch(mode) {
            case AttrMode.property:
                this.propertiesChange(options);
                break;
            case AttrMode.fontSetter:
                break;
            case AttrMode.multipleProperties:
                break;
            default:
                break;
        }
    }

    private propertiesChange(options: any) {
        let frameIndex: number = this.timelineService.actionFrame;
        let layerId: string = this.timelineService.actionOption.layers[0];
        this.timelineService.changeToKeyFrames(frameIndex, frameIndex, [layerId]);
        let changes = [{
            layerId: layerId,
            frame: {
                elementState: options
            },
        }];
        this.timelineService.changeKeyFramesState(this._frameIdx, changes);
    }

    ngOnInit() {
        setTimeout(this.initJanvas.bind(this), 100);
        this.timelineService.actionInputEvent.subscribe(() => this.timelineActionInput());
        this.attrsService.attrsChangeEvent.subscribe((options) => this.attrsChange(options));
    }

    ngOnChanges(change) {
        console.log(change);
        if(change.mainData) {
            console.log(this.mainData);
        }
    }
}
