import { Component, OnInit, Input } from '@angular/core';
import { MainService } from '../main.service';
import { TimelineService } from '../timeline.service';

@Component({
	selector: 'ide-onion-skin',
	templateUrl: './onion-skin.component.html',
	styleUrls: ['./onion-skin.component.css']
})
export class OnionSkinComponent implements OnInit {

	@Input()
	stageName: string;

	constructor(
		private timelineService: TimelineService,
	) {

	}


	ngOnInit() {

	}

}
