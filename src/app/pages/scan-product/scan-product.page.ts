import { Component, OnInit } from '@angular/core';

/* 3rd party plugins : THEY ALL MUST BE IMPORTED AND PROVIDED IN APPMODULE */
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Product } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';
import { InventoryLine } from '../../interfaces/interfaces';
/* import { IonRouterOutlet, Platform } from '@ionic/angular';
import { NavController } from '@ionic/angular'; */
import { ToastController } from '@ionic/angular';




@Component({
  selector: 'app-scan-product',
  templateUrl: './scan-product.page.html',
  styleUrls: ['./scan-product.page.scss'],
})




export class ScanProductPage {




  /* we inject the barcodeScanner */
  constructor(
    private barcodeScanner: BarcodeScanner,
    private dbService: DataService,
    public toastController: ToastController
    /* private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private navCtrl : NavController */) {
     /*  this.platform.backButton.subscribeWithPriority(-1, () => {
        console.log("backbutton")
        this.navCtrl.navigateForward("/tabs/show-inventory")
    }); */}


  activateScan() {
    /* check documentation: https://ionicframework.com/docs/native/barcode-scanner */
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if (!barcodeData.cancelled) {
        this.presentToast();
        //continue scanning until backbutton is pressed
        console.log("code read ok")
        //store the data
        //...
        console.log(barcodeData.text)
        this.onScannedProduct(barcodeData.text);
        //this.dbService.getProductsBD();

        this.activateScan();
        
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }

  onScannedProduct(scannedText: string) {
    /* will recieve the code and has to:
    1. check if there is a stock_inventory_line with this ean13
    if yes: must add a new row  
    if no: must ++ the quantity 

    to check: perform a select of stock_inventory_line where productId == product on stock.inventoryline
    if no result: add new line
    if result (should find only 1): update table SET quantity = quantity + 1
    */

    const ean13: number = parseInt(scannedText);
    const product: Product = this.dbService.scannableProducts.find(product => product.ean13 == ean13) //find the product with the requested ean13 


    //console.log(this.dbService.getLineBD(product.id))
    let result: InventoryLine[] | void;
    this.dbService.getLineBD(product.id)
      .then((res) => {
        result = res
        console.log("dins 2n then", result)
        if (result[0]) {
          //row must be updated TODO: update row
          this.dbService.updateQuantityInventory(product.id)
        } else {
          //insert new line:
          this.dbService.insertLineBD(product.id);
        }
      })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Producto escaneado',
      duration: 2000,
      position: "top"
    });
    toast.present();
  }

}
