/* routung module with children routes from tab */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { ScanProductHalfscreenPageModule } from '../scan-product-halfscreen/scan-product-halfscreen.module';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'scan-product',
        loadChildren: () => import('../scan-product/scan-product.module').then(m => m.ScanProductPageModule)
      },
      {
        path: 'show-inventory',
        loadChildren: () => import('../show-inventory/show-inventory.module').then(m => m.ShowInventoryPageModule )
      },
      {
        path: 'scan-product-halfscreen',
        loadChildren: () => import('../scan-product-halfscreen/scan-product-halfscreen.module').then(m => m.ScanProductHalfscreenPageModule )
      },
      {
        path: '',
        redirectTo: '/tabs/scan-product',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/scan-product',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
