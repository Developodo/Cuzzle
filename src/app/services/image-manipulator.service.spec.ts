import { TestBed } from '@angular/core/testing';

import { ImageManipulatorService } from './image-manipulator.service';

describe('ImageManipulatorService', () => {
  let service: ImageManipulatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageManipulatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
