import {
	Component,
	Input,
	AfterViewInit,
	OnDestroy,
	OnInit,
	Output,
	EventEmitter,
	ViewChildren,
	QueryList,
	ElementRef,
} from '@angular/core';

@Component({
	selector: 'ide-attr-form',
	templateUrl: './attr-form.component.html',
	styleUrls: ['./attr-form.component.css', '../../assets/modal.form.css']
})
export class AttrFormComponent implements OnInit {

	@ViewChildren('input')
	private inputs: QueryList<ElementRef>;

	@ViewChildren('select')
	private selects: QueryList<ElementRef>;
	
	@Input()
	private options: {
		key?: string,
		controlType?: string,
		value?: any,
		max?: number,
		min?: number,
		step?: number,
		disabled?: boolean,
	};

	@Input()
	private isFocus: boolean;

	private oldValue: any;
	private changeTimer: any;

	@Output()
	changeEvent: EventEmitter<{
		preValue: any,
		curValue: any,
		options: {
			key?: string,
			controlType?: string,
			value?: any,
			max?: number,
			min?: number,
			step?: number,
			disabled?: boolean,
		},
	}> = new EventEmitter;

	@Output()
	focusEvent: EventEmitter<string> = new EventEmitter;

	@Output()
	blurEvent: EventEmitter<string> = new EventEmitter;

	constructor() {
		
	}

	private changeHandler(evt) {
		let result = {
			preValue: this.oldValue,
			curValue: this.options.value,
			options: this.options,
		};
		this.changeEvent.emit(result);
		this.oldValue = this.options.value;
	}

	private focusHandler() {
		this.focusEvent.emit(this.options.key);
	}

	private blurHandler() {
		this.blurEvent.emit(this.options.key);
	}

	public focus() {
		if(this.inputs.length > 0) {
			this.inputs.last.nativeElement.focus();
		}
	}

	ngOnInit() {

	}

	ngAfterViewInit() {
		this.inputs.forEach(input => input.nativeElement.addEventListener('input', this.changeHandler.bind(this)));
		this.selects.forEach(input => input.nativeElement.addEventListener('input', this.changeHandler.bind(this)));
		this.inputs.forEach(input => input.nativeElement.addEventListener('focus', this.focusHandler.bind(this)));
		this.selects.forEach(select => select.nativeElement.addEventListener('focus', this.focusHandler.bind(this)));
		this.inputs.forEach(input => input.nativeElement.addEventListener('blur', this.blurHandler.bind(this)));
		this.selects.forEach(select => select.nativeElement.addEventListener('blur', this.blurHandler.bind(this)));
		this.oldValue = this.options.value;

		if(this.isFocus) {
			this.focus();
		}
	}

	ngOnDestroy() {
		this.inputs.forEach(input => input.nativeElement.removeEventListener('input', this.changeHandler.bind(this)));
		this.selects.forEach(input => input.nativeElement.removeEventListener('input', this.changeHandler.bind(this)));
		this.inputs.forEach(input => input.nativeElement.removeEventListener('focus', this.focusHandler.bind(this)));
		this.selects.forEach(select => select.nativeElement.removeEventListener('focus', this.changeHandler.bind(this)));
		this.inputs.forEach(input => input.nativeElement.removeEventListener('blur', this.blurHandler.bind(this)));
		this.selects.forEach(select => select.nativeElement.removeEventListener('blur', this.blurHandler.bind(this)));
	}

}
