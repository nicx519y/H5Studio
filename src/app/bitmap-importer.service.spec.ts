/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BitmapImporterService } from './bitmap-importer.service';

describe('Service: BitmapImporter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BitmapImporterService]
    });
  });

  it('should ...', inject([BitmapImporterService], (service: BitmapImporterService) => {
    expect(service).toBeTruthy();
  }));
});
