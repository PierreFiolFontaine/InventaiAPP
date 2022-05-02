import { Component, OnInit } from '@angular/core';
import { InventoryLine, Product } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-show-inventory',
  templateUrl: './show-inventory.page.html',
  styleUrls: ['./show-inventory.page.scss'],
})
export class ShowInventoryPage implements OnInit {

  products : Product[] = []

  constructor(private dbService: DataService) { }

  ngOnInit() {
    this.dbService.products.subscribe((res) =>{
      console.log(res)
      this.products = res
    })
  }
}
