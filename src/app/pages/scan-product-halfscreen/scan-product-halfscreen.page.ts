import { Component, OnInit } from '@angular/core';
import Quagga from 'quagga';
import { InventoryLine, Product } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';





@Component({
  selector: 'app-scan-product-halfscreen',
  templateUrl: './scan-product-halfscreen.page.html',
  styleUrls: ['./scan-product-halfscreen.page.scss'],
})
export class ScanProductHalfscreenPage implements OnInit {


  products: Product[] = [] // to store the product list we will subscribe and show

  isQUantityManual: boolean = false; // listens to checkbox in html via ngModel binding
  manualQuantity: number;



  constructor(
    private dbService: DataService,
    public toastController: ToastController,
    private alertCtrl: AlertController,
    private nativeAudio: NativeAudio) { }

  ngOnInit() {

    //subscribe to list changes
    this.dbService.productsFromInventoryLines.subscribe((res) => {
      this.products = res
    })

    //inicialize scan
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
            //window.alert(`code: ${res.codeResult.code}`);
            this.onBarcodeScanned(res.codeResult.code)
          })
        }
      });


  }


  onBarcodeScanned(scannedText: string) {
    console.log("obs dins metode onScanned()", this.dbService.scannableProductsObs)
    console.log(this.dbService.scannableProducts)


    //only accept items from scannableProducts

    if (!this.dbService.scannableProducts.find(scannableProduct => scannableProduct.ean13 == scannedText)) {
      //this.nativeAudio.play("id2")
      this.presentToast("Producto no encontrado", "danger")
      console.log("producto no encontrado")
      return;
    }
    //find the product with the requested ean13 
    console.log("mostra scanabbles abans de fer un insert a onBarcodeScanned()", this.dbService.scannableProducts)
    const product: Product = this.dbService.scannableProducts.find(scannableProduct => scannableProduct.ean13 == scannedText)

    let result: InventoryLine[] | void;

    if (!this.isQUantityManual) {
      console.log("check desactivat")
      //show toast and automatic quantity
      this.dbService.getLineBD(product.id)
        .then((res) => {
          result = res
          if (result[0]) {
            //row must be updated
            //search for quantity:
            console.log("updaterow",this.products)
            const quantity: number = this.products.find(storedProduct => storedProduct.ean13 == product.ean13).quantity
            this.dbService.updateQuantityInventory(product.id, quantity + 1)
          } else {
            //insert new line
            console.log("new inventory line")
            this.dbService.insertLineBD(product.id, 1);
          }

          //this.nativeAudio.play("id1");
          this.presentToast("Añadida 1 unidad de " + product.description, "success")
        })
    } else {
      console.log("check activat")
      //do not show modal but alert, and fill manual quantity
      this.presentAlertPrompt(product.ean13.toString(), product.description).then((response) => {
        console.log("despres de alert", this.manualQuantity)
        this.dbService.getLineBD(product.id)
          .then((res) => {
            result = res
            if (result[0]) {

              this.dbService.updateQuantityInventory(product.id, this.manualQuantity)
            } else {
              //insert new line:
              this.dbService.insertLineBD(product.id, this.manualQuantity);
            }
          })
        //this.nativeAudio.play("id1")
        this.presentToast("Añadida " + this.manualQuantity + " unidad de " + product.description, "success")
      })

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
