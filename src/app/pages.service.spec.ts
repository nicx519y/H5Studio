/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PagesService } from './pages.service';

describe('Service: Pages', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PagesService]
    });
  });

  it('should ...', inject([PagesService], (service: PagesService) => {
    expect(service).toBeTruthy();
  }));
});
