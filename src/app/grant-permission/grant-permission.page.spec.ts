import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GrantPermissionPage } from './grant-permission.page';

describe('GrantPermissionPage', () => {
  let component: GrantPermissionPage;
  let fixture: ComponentFixture<GrantPermissionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrantPermissionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GrantPermissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
