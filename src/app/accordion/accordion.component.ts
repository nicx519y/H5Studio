import {
    Component,
    ElementRef,
    ViewChild,
    ContentChildren,
    AfterContentInit,
    AfterViewInit,
    QueryList,
    OnInit,
    HostListener,
} from '@angular/core';

import { PanelComponent } from '../panel/panel.component';

@Component({
    selector: 'ide-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.css']
})
export class AccordionComponent implements OnInit {

    @ContentChildren(PanelComponent)
    panels: QueryList<PanelComponent>;

    @ViewChild('container')
    container: ElementRef;

    constructor() {

    }

    /**
     * @desc 重新计算每个panel的高度
     */
    @HostListener('window:resize')
    updateSize() {
        let containerHeight = this.container.nativeElement.clientHeight;
        let tempHeight = 0;
        let lastOpenIdx = -1;
        this.panels.forEach((v: PanelComponent, i: number) => {
            v.resetHeight();
            tempHeight += v.height;
            if (v.isOpen) {
                lastOpenIdx = i;
            }
        });


        if (lastOpenIdx < 0) return;
        let lastOpenPanel = this.panels.toArray()[lastOpenIdx];
        lastOpenPanel.height = containerHeight - (tempHeight - lastOpenPanel.height) - 1;
    }

    ngAfterViewInit() {
        this.updateSize();
        this.panels.forEach(panel => {
            panel.stateChange.subscribe(() => {
                this.updateSize();
            });
        });
    }

    ngOnInit() {
    }

}
