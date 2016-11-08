/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PageConfigerComponent } from './page-configer.component';

describe('PageConfigerComponent', () => {
  let component: PageConfigerComponent;
  let fixture: ComponentFixture<PageConfigerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageConfigerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageConfigerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
