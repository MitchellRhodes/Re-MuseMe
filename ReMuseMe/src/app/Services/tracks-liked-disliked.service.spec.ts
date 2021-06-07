import { TestBed } from '@angular/core/testing';

import { TracksLikedDislikedService } from './tracks-liked-disliked.service';

describe('TracksLikedDislikedService', () => {
  let service: TracksLikedDislikedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TracksLikedDislikedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
