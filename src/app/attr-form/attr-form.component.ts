import {
	Component,
	Input,
	AfterViewInit,
	OnInit,
} from '@angular/core';

@Component({
	selector: 'ide-attr-form',
	templateUrl: './attr-form.component.html',
	styleUrls: ['./attr-form.component.css', '../../assets/modal.form.css']
})
export class AttrFormComponent implements OnInit {

	@Input()
	options: {
		key: string,
		controlType: string,
		value: any
	};

	@Input()
	inModal: boolean = false;

	constructor() {
		
	}

	ngOnInit() {
	}

}
