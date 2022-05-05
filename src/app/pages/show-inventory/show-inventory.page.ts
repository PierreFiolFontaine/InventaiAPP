import { Component, OnInit } from '@angular/core';
import { InventoryLine, Product } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-show-inventory',
  templateUrl: './show-inventory.page.html',
  styleUrls: ['./show-inventory.page.scss'],
})
export class ShowInventoryPage implements OnInit {

  products: Product[] = [] // to show the products that have inventoryline
  foundProducts: Product[] = []
  searchText: string;

  constructor(private dbService: DataService) { }

  ngOnInit() {
    this.dbService.productsFromInventoryLines.subscribe((res) => {
      console.log(res)
      this.products = res
    })
  }


  searchProduct(event) {
    const searchValue: string = event.detail.value;
    if (searchValue == "") {
      return;
    }
    console.log(this.products)
    this.dbService.searchProductsDB(searchValue)
      .subscribe((res) => {
        for (var i = 0; i < res.rows.length; i++) {
          //find what product on inventory line to fill quantity
          console.log(res.rows.item(i))
          this.foundProducts.push({
            id: res.rows.item(i).id,
            ean13: res.rows.item(i).ean13,
            description: res.rows.item(i).description,
            quantity: this.products.find(product => product.id = res.rows.item(i)).quantity
          })
        }
      })
  }
}
