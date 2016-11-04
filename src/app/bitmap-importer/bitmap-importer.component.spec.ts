/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BitmapImporterComponent } from './bitmap-importer.component';

describe('BitmapImporterComponent', () => {
  let component: BitmapImporterComponent;
  let fixture: ComponentFixture<BitmapImporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BitmapImporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BitmapImporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
