export enum ControlType {
	Textbox = 0,
	Number = 1,
	Range = 2,
	Color = 3,
	Dropdown = 4,
	StateButton = 5,
	SingleSelectionButton = 6,
}

export class PropertyBasicModel<T> {
	value: T;
	key: string;
	label: string;
	controlType: ControlType;

	constructor(options: {
		value?: T,
		key?: string,
		label?: string,
		controlType?: ControlType
	}) {
		this.value = options.value;
		this.key = options.key || '';
		this.label = options.label || '';
		this.controlType = options.controlType || ControlType.Textbox;
	}
}

export class PropertyColorpickerModel extends PropertyBasicModel<number> {
	controlType = ControlType.Color;
	constructor(options: {} = {}) {
		super(options);
	}
}

export class PropertyDropdownModel extends PropertyBasicModel<string> {
	controlType = ControlType.Dropdown;
	options: { key: string, value: string }[] = [];

	constructor(options: {} = {}) {
		super(options);
		Object.assign(this, options);
	}
}


export class PropertyNumberModel extends PropertyBasicModel<number> {
	controlType = ControlType.Number;
	min: number;
	max: number;
	step: number;
	constructor(options: {} = {}) {
		super(options);
		Object.assign(this, options);
	}
}


export class PropertyRangeModel extends PropertyBasicModel<number> {
	controlType: ControlType = ControlType.Range;
	min: number;
	max: number;
	step: number;
	constructor(options: {} = {}) {
		super(options);
		Object.assign(this, options);
	}
}


export class PropertyTextboxModel extends PropertyBasicModel<string> {
	controlType: ControlType = ControlType.Textbox;
	constructor(options: {} = {}) {
		super(options);
	}
}

export class PropertyBooleanModel extends PropertyBasicModel<boolean> {
	controlType: ControlType = ControlType.StateButton;
	iconClass: string;
	constructor(options: {} = {}) {
		super(options);
		Object.assign(this, options);
	}

	toggleValue() {
		this.value = !(this.value);
	}
}

export class PropertySingleSelectionModel extends PropertyBasicModel<number> {
	controlType: ControlType = ControlType.SingleSelectionButton;
	options: { class: string, value: string }[] = [];
	
	constructor(options: {} = {}) {
		super( options );
		Object.assign(this, options);
	}
}