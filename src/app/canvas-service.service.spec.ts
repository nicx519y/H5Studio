/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CanvasServiceService } from './canvas-service.service';

describe('Service: CanvasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanvasServiceService]
    });
  });

  it('should ...', inject([CanvasServiceService], (service: CanvasServiceService) => {
    expect(service).toBeTruthy();
  }));
});
