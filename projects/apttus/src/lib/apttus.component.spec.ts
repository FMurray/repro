import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApttusComponent } from './apttus.component';

describe('ApttusComponent', () => {
  let component: ApttusComponent;
  let fixture: ComponentFixture<ApttusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApttusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApttusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
