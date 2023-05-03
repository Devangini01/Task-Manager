import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateTaskComponent } from './allocate-task.component';

describe('AllocateTaskComponent', () => {
  let component: AllocateTaskComponent;
  let fixture: ComponentFixture<AllocateTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocateTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
