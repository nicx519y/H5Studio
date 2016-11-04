/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HotKeysService } from './hot-keys.service';

describe('Service: HotKeys', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HotKeysService]
    });
  });

  it('should ...', inject([HotKeysService], (service: HotKeysService) => {
    expect(service).toBeTruthy();
  }));
});
