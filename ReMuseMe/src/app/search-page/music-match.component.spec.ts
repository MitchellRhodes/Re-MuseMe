import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicMatchComponent } from './music-match.component';

describe('MusicMatchComponent', () => {
  let component: MusicMatchComponent;
  let fixture: ComponentFixture<MusicMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusicMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
