/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TimelineService } from './timeline.service';

describe('Service: Timeline', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimelineService]
    });
  });

  it('should ...', inject([TimelineService], (service: TimelineService) => {
    expect(service).toBeTruthy();
  }));
});
