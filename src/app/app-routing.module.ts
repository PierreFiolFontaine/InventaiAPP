import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'scan-product',
    loadChildren: () => import('./pages/scan-product/scan-product.module').then( m => m.ScanProductPageModule)
  },
  {
    path: 'show-inventory',
    loadChildren: () => import('./pages/show-inventory/show-inventory.module').then( m => m.ShowInventoryPageModule)
  },
  {
    path: 'scan-product-halfscreen',
    loadChildren: () => import('./pages/scan-product-halfscreen/scan-product-halfscreen.module').then( m => m.ScanProductHalfscreenPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
