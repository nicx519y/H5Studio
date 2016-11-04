/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AttrsService } from './attrs.service';

describe('Service: Attrs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttrsService]
    });
  });

  it('should ...', inject([AttrsService], (service: AttrsService) => {
    expect(service).toBeTruthy();
  }));
});
