import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyLocksPage } from './my-locks.page';

describe('MyLocksPage', () => {
  let component: MyLocksPage;
  let fixture: ComponentFixture<MyLocksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyLocksPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyLocksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
