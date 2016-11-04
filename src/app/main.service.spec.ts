/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MainService } from './main.service';

describe('Service: Main', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainService]
    });
  });

  it('should ...', inject([MainService], (service: MainService) => {
    expect(service).toBeTruthy();
  }));
});
