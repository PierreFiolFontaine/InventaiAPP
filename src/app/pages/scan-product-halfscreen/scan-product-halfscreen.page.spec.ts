import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScanProductHalfscreenPage } from './scan-product-halfscreen.page';

describe('ScanProductHalfscreenPage', () => {
  let component: ScanProductHalfscreenPage;
  let fixture: ComponentFixture<ScanProductHalfscreenPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanProductHalfscreenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScanProductHalfscreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
