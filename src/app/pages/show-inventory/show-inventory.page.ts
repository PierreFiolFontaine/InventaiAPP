import { Component, OnInit } from '@angular/core';
import { InventoryLine, Product } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-show-inventory',
  templateUrl: './show-inventory.page.html',
  styleUrls: ['./show-inventory.page.scss'],
})
export class ShowInventoryPage {

  mostrableProducts: Product[] = [] // to show the products that have inventoryline
  foundProducts: Product[] = []
  searchText: string;

  constructor(private dbService: DataService) { }

  ngOnInit() {
    this.dbService.obsMostrableProducts.subscribe((res) => {
      console.log(res)
      this.mostrableProducts = res
    })
  }


  searchProduct(event) {
    const searchValue: string = event.detail.value;
    if (searchValue == "") {
      return this.foundProducts = []
    }
    console.log(this.mostrableProducts)
    this.dbService.searchProductsDB(searchValue)
      .subscribe((res) => {
        let internalFoundProducts : Product [] = []
        for (var i = 0; i < res.rows.length; i++) {
          //find what product on inventory line to fill quantity
          console.log(res.rows.item(i))
          internalFoundProducts.push({
            id: res.rows.item(i).id,
            ean13: res.rows.item(i).ean13,
            description: res.rows.item(i).description,
            quantity: this.mostrableProducts.find(product => product.id = res.rows.item(i)).quantity
          })
        }
        this.foundProducts = internalFoundProducts;
      })
  }
} 
