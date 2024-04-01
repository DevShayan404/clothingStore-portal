import { TestBed } from '@angular/core/testing';

import { CategoryItemsService } from './category-items.service';

describe('CategoryItemsService', () => {
  let service: CategoryItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
