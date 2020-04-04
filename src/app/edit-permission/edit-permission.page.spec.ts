import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPermissionPage } from './edit-permission.page';

describe('EditPermissionPage', () => {
  let component: EditPermissionPage;
  let fixture: ComponentFixture<EditPermissionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPermissionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPermissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
