import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanProductPage } from './scan-product.page';

const routes: Routes = [
  {
    path: '',
    component: ScanProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanProductPageRoutingModule {}
