/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HotKeysComponent } from './hot-keys.component';

describe('HotKeysComponent', () => {
  let component: HotKeysComponent;
  let fixture: ComponentFixture<HotKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotKeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
