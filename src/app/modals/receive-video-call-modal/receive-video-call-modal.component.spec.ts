import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveVideoCallModalComponent } from './receive-video-call-modal.component';

describe('ReceiveVideoCallModalComponent', () => {
  let component: ReceiveVideoCallModalComponent;
  let fixture: ComponentFixture<ReceiveVideoCallModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveVideoCallModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveVideoCallModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
