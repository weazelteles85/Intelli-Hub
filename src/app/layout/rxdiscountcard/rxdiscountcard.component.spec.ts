import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RxdiscountcardComponent } from './rxdiscountcard.component';

describe('RxdiscountcardComponent', () => {
  let component: RxdiscountcardComponent;
  let fixture: ComponentFixture<RxdiscountcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RxdiscountcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RxdiscountcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
