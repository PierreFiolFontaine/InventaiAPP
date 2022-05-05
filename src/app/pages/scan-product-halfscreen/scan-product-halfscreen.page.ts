import { Component, OnInit } from '@angular/core';
import Quagga from 'quagga';
import { InventoryLine, Product } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';








@Component({
  selector: 'app-scan-product-halfscreen',
  templateUrl: './scan-product-halfscreen.page.html',
  styleUrls: ['./scan-product-halfscreen.page.scss'],
})
export class ScanProductHalfscreenPage implements OnInit {


  isQUantityManual: boolean = false; // listens to checkbox in html via ngModel binding
  manualQuantity: number;
  mostrableProducts: Product[] = [] //Array with all the products that will be displayed


  constructor(
    private dbService: DataService,
    public toastController: ToastController,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {


    /* start subscribing to mostrableProducts */
    this.dbService.obsMostrableProducts.subscribe((res) => {
      this.mostrableProducts = res;
    })
    /* end subscribing to mostrableProducts */




    /* start inicializing scan */
    Quagga.init({
      inputStream: {
        constraints: {
          facingMode: 'environment' // restrict camera type
        },
        area: { // defines rectangle of the detection
          top: '40%',    // top offset
          right: '0%',  // right offset
          left: '0%',   // left offset
          bottom: '40%'  // bottom offset
        },
      },
      decoder: {
        readers: ['ean_reader'], // restrict code types
        multiple: false
      },
      locate: false,
      frequency: 0.5
    },
      (err) => {
        if (err) {
          console.log(err)
        } else {
          Quagga.start();
          Quagga.onDetected((res) => {
            this.onBarcodeScanned(res.codeResult.code)
          })
        }
      });
    /* end inicializing scan */

  }

  onBarcodeScanned(scannedText: string) {

    //only accept items from scannableProducts
    if (!this.dbService.scannableProducts.find(scannableProduct => scannableProduct.ean13 == scannedText)) {
      this.presentToast("Producto no encontrado", "danger")
      return;
    } else {
      //find what product we are scanning
      const scannedProduct: Product = this.dbService.scannableProducts.find(scannableProduct => scannableProduct.ean13 == scannedText)

      if (!this.isQUantityManual) {
        console.log("check desactivat")
        //show toast and automatic quantity
        this.dbService.getLineBD(scannedProduct.id)
          .then((result) => {
            if (result[0]) {
              console.log(result[0])
              //row must be updated
              //search for quantity:
              const quantity: number = result[0].quantity
              console.log("updated quantity")
              this.dbService.updateQuantityInventory(scannedProduct.id, quantity + 1);

            } else {
              //insert new line
              console.log("new inventory line")
              this.dbService.insertLineBD(scannedProduct.id, 1);
            }
            this.presentToast("Añadida 1 unidad de " + scannedProduct.description, "success")
          })
      } else {
        console.log("check activat")
        //do not show modal but alert, and fill manual quantity
        this.presentAlertPrompt(scannedProduct.ean13.toString(), scannedProduct.description).then((response) => {
          console.log("despres de alert", this.manualQuantity)
          this.dbService.getLineBD(scannedProduct.id)
            .then((result) => {
              if (result[0]) {
                this.dbService.updateQuantityInventory(scannedProduct.id, this.manualQuantity)
              } else {
                //insert new line:
                this.dbService.insertLineBD(scannedProduct.id, this.manualQuantity);
              }
            })
          this.presentToast("Registrado: " + this.manualQuantity + " unidad de " + scannedProduct.description, "success")
        })
      }
    }


  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: "top",
      color: color
    });
    toast.present();
  }

  async presentAlertPrompt(ean13: string, description: string) {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        backdropDismiss: false,
        subHeader: 'Introduce la cantidad total',
        header: description + " -- " + ean13,
        inputs: [
          {
            name: 'cantidad',
            type: 'number',
            min: 1,
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
              alert.dismiss();
            }
          }, {
            text: 'Ok',
            handler: (value) => {
              resolve(this.manualQuantity = value.cantidad)
              console.log("number 1", this.manualQuantity)
            }
          }
        ]
      });
      await alert.present();
    })
  }

}



























