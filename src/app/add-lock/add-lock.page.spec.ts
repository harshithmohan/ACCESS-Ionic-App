import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddLockPage } from './add-lock.page';

describe('AddLockPage', () => {
  let component: AddLockPage;
  let fixture: ComponentFixture<AddLockPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLockPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddLockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
