import { Component, OnInit } from '@angular/core';
import { PropertyBasicModel } from '../properties';
import { AttrsService, AttrMode } from '../attrs.service';
import { AttrFormComponent } from '../attr-form/attr-form.component';

@Component({
  selector: 'ide-attrs',
  templateUrl: './attrs.component.html',
  styleUrls: ['./attrs.component.css']
})
export class AttrsComponent implements OnInit {

  options: PropertyBasicModel<string>[];

  constructor(
    private service: AttrsService
  ) {
    
  }

  ngOnInit() {
    this.service.mode = AttrMode.fontSetter;
    this.options = this.service.attrs;

  }

}
