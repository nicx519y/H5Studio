/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OnionSkinComponent } from './onion-skin.component';

describe('OnionSkinComponent', () => {
  let component: OnionSkinComponent;
  let fixture: ComponentFixture<OnionSkinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnionSkinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnionSkinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
