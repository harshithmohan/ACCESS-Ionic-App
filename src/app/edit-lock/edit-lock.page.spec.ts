import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditLockPage } from './edit-lock.page';

describe('EditLockPage', () => {
  let component: EditLockPage;
  let fixture: ComponentFixture<EditLockPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLockPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditLockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
