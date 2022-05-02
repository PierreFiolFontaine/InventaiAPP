import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowInventoryPageRoutingModule } from './show-inventory-routing.module';

import { ShowInventoryPage } from './show-inventory.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowInventoryPageRoutingModule
  ],
  declarations: [ShowInventoryPage]
})
export class ShowInventoryPageModule {}
