import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsecategorydetailsComponent } from './browsecategorydetails.component';

describe('BrowsecategorydetailsComponent', () => {
  let component: BrowsecategorydetailsComponent;
  let fixture: ComponentFixture<BrowsecategorydetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowsecategorydetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsecategorydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
