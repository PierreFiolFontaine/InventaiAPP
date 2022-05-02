import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanProductHalfscreenPage } from './scan-product-halfscreen.page';

const routes: Routes = [
  {
    path: '',
    component: ScanProductHalfscreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanProductHalfscreenPageRoutingModule {}
