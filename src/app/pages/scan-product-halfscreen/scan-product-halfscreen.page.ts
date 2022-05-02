import { Component, OnInit } from '@angular/core';
import Quagga from 'quagga'; // ES6
import { InventoryLine, Product } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-scan-product-halfscreen',
  templateUrl: './scan-product-halfscreen.page.html',
  styleUrls: ['./scan-product-halfscreen.page.scss'],
})
export class ScanProductHalfscreenPage implements OnInit {


  products : Product[] = [] // to store the product list we will subscribe and show

  constructor(private dbService: DataService) { }

  ngOnInit() {

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
          console.log("code:",res.codeResult.code)
          this.onBarcodeScanned(res.codeResult.code)
        })
      }
    });

    //subscribe to list changes
    this.dbService.products.subscribe((res) =>{
      console.log(res)
      this.products = res
    })

  }


  onBarcodeScanned(scannedText: string) {


    
    //only accept items from scannableProducts

    const ean13: number = parseInt(scannedText);
    const product: Product = this.dbService.scannableProducts.find(product => product.ean13 == ean13) //find the product with the requested ean13 
    console.log(product)
    let result: InventoryLine[] | void;
    this.dbService.getLineBD(product.id)
      .then((res) => {
        console.log(res)
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
}
