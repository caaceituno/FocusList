import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotfoundPage } from './not-found.page';

describe('NotfoundPage', () => {
  let component: NotfoundPage;
  let fixture: ComponentFixture<NotfoundPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotfoundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})