import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyLoginPageComponent } from './spotify-login-page.component';

describe('SpotifyLoginPageComponent', () => {
  let component: SpotifyLoginPageComponent;
  let fixture: ComponentFixture<SpotifyLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotifyLoginPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifyLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
