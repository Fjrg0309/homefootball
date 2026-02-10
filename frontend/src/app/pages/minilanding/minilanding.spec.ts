import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Minilanding } from './minilanding';

describe('Minilanding', () => {
  let component: Minilanding;
  let fixture: ComponentFixture<Minilanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Minilanding]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Minilanding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
