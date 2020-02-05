import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditLockComponent } from './edit-lock.component';

describe('EditLockComponent', () => {
  let component: EditLockComponent;
  let fixture: ComponentFixture<EditLockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLockComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
