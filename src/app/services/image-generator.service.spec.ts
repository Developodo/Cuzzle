import { TestBed } from '@angular/core/testing';

import { ImageGeneratorService } from './image-generator.service';

describe('ImageGeneratorService', () => {
  let service: ImageGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
