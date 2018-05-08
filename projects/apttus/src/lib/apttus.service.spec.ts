import { TestBed, inject } from '@angular/core/testing';

import { ApttusService } from './apttus.service';

describe('ApttusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApttusService]
    });
  });

  it('should be created', inject([ApttusService], (service: ApttusService) => {
    expect(service).toBeTruthy();
  }));
});
