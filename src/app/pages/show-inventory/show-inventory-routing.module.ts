import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowInventoryPage } from './show-inventory.page';

const routes: Routes = [
  {
    path: '',
    component: ShowInventoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowInventoryPageRoutingModule {}
