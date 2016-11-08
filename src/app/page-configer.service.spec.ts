/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PageConfigerService } from './page-configer.service';

describe('Service: PageConfiger', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageConfigerService]
    });
  });

  it('should ...', inject([PageConfigerService], (service: PageConfigerService) => {
    expect(service).toBeTruthy();
  }));
});
