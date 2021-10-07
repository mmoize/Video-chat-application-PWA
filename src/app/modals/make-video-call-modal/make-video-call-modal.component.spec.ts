import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeVideoCallModalComponent } from './make-video-call-modal.component';

describe('MakeVideoCallModalComponent', () => {
  let component: MakeVideoCallModalComponent;
  let fixture: ComponentFixture<MakeVideoCallModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeVideoCallModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeVideoCallModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
