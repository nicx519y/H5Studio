/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AttrsComponent } from './attrs.component';

describe('AttrsComponent', () => {
  let component: AttrsComponent;
  let fixture: ComponentFixture<AttrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
