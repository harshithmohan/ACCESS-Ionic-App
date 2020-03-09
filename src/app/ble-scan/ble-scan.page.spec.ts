import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BleScanPage } from './ble-scan.page';

describe('BleScanPage', () => {
  let component: BleScanPage;
  let fixture: ComponentFixture<BleScanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BleScanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BleScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
