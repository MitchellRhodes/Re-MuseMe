import { TestBed } from '@angular/core/testing';

import { CategorySelectedService } from './category-selected.service';

describe('CategorySelectedService', () => {
  let service: CategorySelectedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorySelectedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
