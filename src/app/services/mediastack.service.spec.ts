import { TestBed } from '@angular/core/testing';

import { MediastackService } from './mediastack.service';

describe('MediastackService', () => {
  let service: MediastackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediastackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
