/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FontSetterService } from './font-setter.service';

describe('Service: FontSetter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FontSetterService]
    });
  });

  it('should ...', inject([FontSetterService], (service: FontSetterService) => {
    expect(service).toBeTruthy();
  }));
});
