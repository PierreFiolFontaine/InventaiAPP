/* full example of CRUD sqlite service:
https://www.positronx.io/ionic-sqlite-database-crud-app-example-tutorial/#tc_8652_03 */


import { Injectable, OnInit } from '@angular/core';

import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, from, Observable } from 'rxjs';

import { Product, InventoryLine } from '../interfaces/interfaces';





@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {

  obsMostrableProducts: BehaviorSubject<Product[]> = new BehaviorSubject([])
  scannableProducts: Product[] = [] //Array with all the products that can be scanned


  ngOnInit(): void {

  }

  /* variable to store the Database */
  db: SQLiteObject;

  /* variables with create model commands */
  private createStockInventoryLineTable: string = "create table if not exists stock_inventory_line(" +
    "lineId INTEGER PRIMARY KEY," +
    "inventory INTEGER," +
    "product INTEGER," +
    "expected_quantity INTEGER," +
    "quantity INTEGER," +
    "FOREIGN KEY (product) REFERENCES product (productId)" +
    ");"

  private createProductTable: string = "create table if not exists product(" +
    "productId INTEGER PRIMARY KEY," +
    "ean13 TEXT," +
    "description TEXT" +
    ");"

  private populateProductTable: string = "INSERT INTO product (ean13, description) VALUES" +
    "('9780201379624', 'Galletas')," +
    "('3146412174162','Pasta')," +
    "('3135423215643','arroz')" +
    "EXCEPT SELECT ean13, description FROM product;"



  constructor(private sqlite: SQLite) {
    /* start subscribing to dbService.scannableProducts */


    this.createDB();
  }


  createDB(): void {
    /*check https://ionicframework.com/docs/v3/native/sqlite/ for sqlite ionic info*/
    /* creates the BD. If already exists it opens it */
    console.log("creating bd...")
    this.sqlite.create({
      name: "inventory.db",
      location: "default"
    })
      .then((db: SQLiteObject) => {
        this.db = db; //assing created db to global db variable to use it late
        this.db.executeSql(this.createProductTable, [])
          .then(() => {
            console.log('Executed SQL', this.createProductTable)
            this.db.executeSql(this.createStockInventoryLineTable, [])
              .then(() => {
                console.log('Executed SQL', this.createStockInventoryLineTable)
                this.db.executeSql(this.populateProductTable, [])
                  .then(() => {
                    console.log(console.log('Executed SQL', this.populateProductTable))
                  })
                  .catch(e => console.log(e));
              })
              .catch(e => console.log(e));
          })
          .catch(e => console.log(e));
        /* start subscribing to scannableProducts */
        this.getScannableProducts() // subscribe to list of scanableproducts once the table is created
          .subscribe((res) => {
            if (res.rows.length > 0) {
              for (var i = 0; i < res.rows.length; i++) {
                this.scannableProducts.push({
                  id: res.rows.item(i).productId,
                  ean13: res.rows.item(i).ean13,
                  description: res.rows.item(i).description,
                })
              }
            }
          })
        /* end subscribing to scannableProducts */
        this.getMostrableProducts() //update mostrableProduct Observable once table is created and once we are subscribed to scannalbe products
      })
      .catch(e => console.log(e))

  }


  getScannableProducts(): Observable<any> {
    return from(this.db.executeSql('SELECT * FROM product', []));
  }

  getLineBD(product: number) {
    let data = [product]
    let inventoryLines: InventoryLine[] = [];
    return this.db.executeSql('SELECT * FROM stock_inventory_line WHERE product = ?', data).then(res => {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          inventoryLines.push({
            lineId: res.rows.item(i).lineId,
            inventory: res.rows.item(i).inventory,
            product: res.rows.item(i).product,
            expected_quantity: res.rows.item(i).expected_quantity,
            quantity: res.rows.item(i).quantity,
          });
        }
      }
      return new Promise<InventoryLine[]>((resolve, reject) => {
        resolve(inventoryLines)
      });
    })
      .catch(e => console.log(e));
  }

  insertLineBD(productId: number, quantity: number) {
    console.log("Inserting line...")
    console.log("quantity", quantity)
    let data = [productId, quantity];
    return this.db.executeSql('INSERT INTO stock_inventory_line (product, quantity) VALUES (?,?)', data)
      .then(() => {
        console.log("line inserted")
        this.getMostrableProducts() //update mostrableProduct Observable
      })
      .catch(e => console.log(e));
  }

  updateQuantityInventory(product: number, quantity: number) {
    let data = [product]
    this.db.executeSql('DELETE FROM stock_inventory_line WHERE product = ?', [data]).then(res => {
      console.log("delete done");
      this.insertLineBD(product, quantity);
    })
      .catch(e => console.log(e));
  }

  getMostrableProducts() {
    return this.db.executeSql('SELECT * FROM stock_inventory_line', []).then((res) => {
      let internalMostrableProducts: Product[] = []
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          //find the scannable product
          console.log(internalMostrableProducts)
          const scannedProduct: Product = this.scannableProducts.find(scannableProduct => scannableProduct.id == res.rows.item(i).product)
          console.log(scannedProduct);
          internalMostrableProducts.unshift({
            description: scannedProduct.description,
            ean13: scannedProduct.ean13,
            expected_quantity: res.rows.item(i).expected_quantity,
            quantity: res.rows.item(i).quantity,
          })
        }
        console.log(internalMostrableProducts)
        this.obsMostrableProducts.next(internalMostrableProducts)
      }
    })
  }

  searchProductsDB(value: string): Observable<any> {
    const searchValue: string = "%" + value + "%";
    console.log(searchValue)
    const data = [searchValue, searchValue]
    return from(this.db.executeSql("SELECT * FROM product WHERE ean13 LIKE ? OR description LIKE ?", data))
  }
}




























