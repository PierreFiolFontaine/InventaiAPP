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

  ngOnInit(): void {


  }

  productsFromInventoryLines = new BehaviorSubject<Product[]>([]); // observable with all the product comming from inserted inventory lines
  productsSearchResult = new BehaviorSubject<Product[]>([]) //observable with search result of products (for searchbar)
  scannableProductsObs = new BehaviorSubject<Product[]>([]) //observable with all the products scannable (from product table)
  scannableProducts: Product[] = []


  /* variable to store the Database */
  db: SQLiteObject;
  /* this statement will be always the same:
  note that WITHOUT ROWID is mandatory in sqlite to avoit creating default rowid column.
  we want to have a productId column and primary key. Note also that no need to use AUTO_INCREMENT */

  /* add foreign keys!!!!!!!!!!! */
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

  /* products available to be scanned 
  now filled with dummy data, but it will get the actual products when connecting*/
  /* scannableProducts: Product[] = [
    {
      id: 1,
      ean13: "9780201379624",
      description: "galletas"
    },
    {
      id: 2,
      ean13: "3146412174162",
      description: "pasta"
    },
    {
      id: 3,
      ean13: "3135423215643",
      description: "arroz"
    }, 

  ]*/

  constructor(private sqlite: SQLite) {
    this.createDB();
    //subscribe to observalbe
    this.scannableProductsObs.subscribe((res) => {
      console.log("entrant a subscriber", res)
      this.scannableProducts = res
    })
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
                    this.getScannableProductsFromProduct()
                  })
                  .catch(e => console.log(e));
              })
              .catch(e => console.log(e));
          })
          .catch(e => console.log(e));
        
        this.getProductsFromLines() //update obs //////////////////////////////////////////////////////////////////////////////


      })
      .catch(e => console.log(e))

  }



  insertLineBD(productId: number, quantity: number) {
    console.log("Inserting line...")
    console.log("quantity", quantity)
    let data = [productId, quantity];
    return this.db.executeSql('INSERT INTO stock_inventory_line (product, quantity) VALUES (?,?)', data)
      .then(() => {
        console.log("line inserted")
        this.getProductsFromLines() //actualitzar obs
      })
      .catch(e => console.log(e));
  }

  getScannableProductsFromProduct() {

    let selectItems: Product[] = []
    this.db.executeSql('SELECT * FROM product', []).then(res => {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          selectItems.push({
            id: res.rows.item(i).productId,
            ean13: res.rows.item(i).ean13,
            description: res.rows.item(i).description,
          })
        }
      }
    })
      .catch(e => console.log(e));
    console.log("Array que es passa a obs de scanableProducts", selectItems)
    this.scannableProductsObs.next(selectItems)
    console.log("obs dins metode get", this.scannableProductsObs)
  }

  getProductsFromLines() {
    let selectItems: Product[] = [];
    this.db.executeSql('SELECT * FROM stock_inventory_line', []).then(res => {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          //find product we are recieving on inventloryline
          let productLine: Product = this.scannableProducts.find(product => product.id == res.rows.item(i).product)
          selectItems.unshift({
            ean13: productLine.ean13,
            description: productLine.description,
            quantity: res.rows.item(i).quantity,
          });
        }
      }
    })
      .catch(e => console.log(e));
    console.log("getProductFromLines",selectItems)
    this.productsFromInventoryLines.next(selectItems)

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

  updateQuantityInventory(product: number, quantity: number) {
    let data = [product]
    this.db.executeSql('DELETE FROM stock_inventory_line WHERE product = ?', [data]).then(res => {
      console.log("delete done");
      this.insertLineBD(product, quantity);
    })
      .catch(e => console.log(e));
  }

  /* method to perform search in inventory lines and return products */

  searchProductsDB(value: string): Observable<any> {
    const searchValue: string = "%" + value + "%";
    console.log(searchValue)
    const data = [searchValue, searchValue]
    return from(this.db.executeSql("SELECT * FROM product WHERE ean13 LIKE ? OR description LIKE ?", data))
  }
}



