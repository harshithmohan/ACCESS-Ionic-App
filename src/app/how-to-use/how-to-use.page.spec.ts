import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HowToUsePage } from './how-to-use.page';

describe('HowToUsePage', () => {
  let component: HowToUsePage;
  let fixture: ComponentFixture<HowToUsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowToUsePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HowToUsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
