import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OtherLocksPage } from './other-locks.page';

describe('OtherLocksPage', () => {
  let component: OtherLocksPage;
  let fixture: ComponentFixture<OtherLocksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherLocksPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OtherLocksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
