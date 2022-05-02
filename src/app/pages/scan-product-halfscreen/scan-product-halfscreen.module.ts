import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanProductHalfscreenPageRoutingModule } from './scan-product-halfscreen-routing.module';

import { ScanProductHalfscreenPage } from './scan-product-halfscreen.page';
import { ShowInventoryPageModule } from '../show-inventory/show-inventory.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanProductHalfscreenPageRoutingModule,
    ShowInventoryPageModule
  ],
  declarations: [ScanProductHalfscreenPage]
})
export class ScanProductHalfscreenPageModule {}
