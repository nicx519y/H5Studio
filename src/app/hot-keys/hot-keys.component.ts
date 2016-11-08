import { Component, ElementRef, Renderer, Input, OnInit } from '@angular/core';
import { HotKeysService } from '../hot-keys.service';
import { HotKeyModel } from '../models';

@Component({
    selector: 'ide-hot-keys',
    templateUrl: './hot-keys.component.html',
    styleUrls: ['./hot-keys.component.css'],
    providers: [HotKeysService]
})
export class HotKeysComponent implements OnInit {

    @Input()
    public targets: {};

    constructor(
        private service: HotKeysService
    ) {

    }

    private keyupHandler(evt: KeyboardEvent) {
        //如果焦点不在body（有可能在input或者是select上），则热键不生效
        if (document.activeElement.tagName.toLocaleLowerCase() != 'body')
            return;

        let config: Map<string, HotKeyModel> = this.service.config;
        let keyString: string = this.service.getKeyString(new HotKeyModel({
            shift: evt.shiftKey,
            ctrl: evt.ctrlKey,
            alt: evt.altKey,
            key: evt.key
        }));

        let model: HotKeyModel = config.get(keyString);

        if (!model) return;

        let target: any = this.targets[model.target];
        let api = model.api;

        if (target && api != '' && typeof target[api] == 'function') {
            target[api].apply(target, model.arguments);
        }
        evt.stopPropagation();
        evt.preventDefault();
    }

    ngAfterViewInit() {
        document.addEventListener('keyup', event => {
            this.keyupHandler(event);
        });
    }

    ngOnInit() {
    }

}
