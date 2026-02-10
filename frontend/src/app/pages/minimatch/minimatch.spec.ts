import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Minimatch } from './minimatch';

describe('Minimatch', () => {
  let component: Minimatch;
  let fixture: ComponentFixture<Minimatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Minimatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Minimatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
