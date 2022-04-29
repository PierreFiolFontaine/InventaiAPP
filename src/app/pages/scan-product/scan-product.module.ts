import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanProductPageRoutingModule } from './scan-product-routing.module';

import { ScanProductPage } from './scan-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanProductPageRoutingModule
  ],
  declarations: [ScanProductPage]
})
export class ScanProductPageModule {}
