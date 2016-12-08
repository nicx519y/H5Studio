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
import { MainModel, EditorState, ElementModel, ElementStateModel, FrameModel } from '../models';
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

    private _mode: EditorState;

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

    private data: any;
    private janvas: any;

    constructor(
        private service: MainService,
        private tlService: TimelineService,
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

    public get mode(): EditorState {
        return this._mode;
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
                this.mode = this._mode;
            }
        );
    }

    private janvasSelectedHandler(eleArr: any[]) {
        // console.log('selected: ', eleArr);
        let data = this.filterJanvasData(eleArr);
        this.tlService.actionOption = {
            start: data.frameIndex,
            duration: 1,
            layers: data.elements.map(ele => { return ele.layerId })
        };
        this.elementsSelected.emit(data);
    }

    private janvasChangeHandler(eleArr: any[]) {
        // console.log('change: ', eleArr);
        let data = this.filterJanvasData(eleArr);
        this.elementsChanged.emit(data);
        let layerIds: string[] = data.elements.map(ele => { return ele.layerId });
        this.tlService.changeToKeyFrames(data.frameIndex, data.frameIndex, layerIds);
        let changes = data.elements.map(ele => {
            return {
                layerId: ele.layerId,
                frame: {
                    elementState: ele.elementState
                },
            };
        });
        this.tlService.changeKeyFramesState(data.frameIndex, changes);
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
            this.janvas.gotoPage(this.tlService.stageId);
            this.janvas.gotoFrame(Math.max(this.tlService.actionOption.start, 0));
            callback && callback();
        });
    }

    public timelineDateChange(tlService: TimelineService) {
        this.janvasUpdate();
    }

    

    ngOnInit() {
        setTimeout(this.initJanvas.bind(this), 100);
    }

    // ngOnChanges(change) {
    // }
}
