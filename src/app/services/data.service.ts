/* full example of CRUD sqlite service:
https://www.positronx.io/ionic-sqlite-database-crud-app-example-tutorial/#tc_8652_03 */


import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

import { Product, InventoryLine } from '../interfaces/interfaces';





@Injectable({
  providedIn: 'root'
})
export class DataService {


  /* variable to store the Database */
  db: SQLiteObject;
  /* this statement will be always the same:
  note that WITHOUT ROWID is mandatory in sqlite to avoit creating default rowid column.
  we want to have a productId column and primary key. Note also that no need to use AUTO_INCREMENT */

  /* add foreign keys!!!!!!!!!!! */
  private createStockInventoryLine: string = "create table if not exists stock_inventory_line(" +
    "lineId INTEGER PRIMARY KEY," +
    "inventory INTEGER," +
    "product INTEGER," +
    "expected_quantity INTEGER," +
    "quantity INTEGER) " +
    ";"

  /* products available to be scanned 
  now filled with dummy data, but it will get the actual products when connecting*/
  scannableProducts: Product[] = [
    {
      id: 1,
      ean13: 9780201379624,
      description: "galletas"
    },
    {
      id: 2,
      ean13: 3146412174162,
      description: "pasta"
    },
    {
      id: 3,
      ean13: 3135423215643,
      description: "arroz"
    },

  ]

  constructor(private sqlite: SQLite) {
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
        this.db.executeSql(this.createStockInventoryLine, [])
          .then(() => console.log('Executed SQL', this.createStockInventoryLine))
          .catch(e => console.log(e));

      })
      .catch(e => console.log(e))

  }
  


  insertLineBD(productId: number) {
    console.log("Inserting line...")
    let data = [productId];
    /* const query : string = 'INSERT INTO stock_inventory_line (product) VALUES('+999+');'
    console.log(query); */
    return this.db.executeSql('INSERT INTO stock_inventory_line (product) VALUES (?)', data)
      //return this.db.executeSql(query)
      .then(() => {
        console.log("line inserted")
      })
      .catch(e => console.log(e));

  }



  getAllLinesBD() {
    let inventoryLines: InventoryLine[] = [];
    this.db.executeSql('SELECT * FROM stock_inventory_line', []).then(res => {
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
    })
    .catch(e => console.log(e));
    console.log("totes linies dins promesa", inventoryLines)
    return new Promise<InventoryLine[]>((resolve, reject) => {
      resolve(inventoryLines)
    });
  }

  getLineBD(product:number) {

    
    let data = [product]
    let inventoryLines: InventoryLine[] = [];
    return this.db.executeSql('SELECT * FROM stock_inventory_line WHERE product = ?',data).then( res => {
      
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
      // console.log('1', inventoryLines) // mostra array 
      return new Promise<InventoryLine[]>((resolve, reject) => {
        resolve(inventoryLines)
      });    
    })
    .catch(e => console.log(e));
    //console.log(inventoryLines)
  
  }

  /* getLineBD(product: number) : Promise<InventoryLine>{
    let data = [product]
    return this.db.executeSql('SELECT * FROM stock_inventory_line WHERE product = ?', data).then(res => {
      if(!res.rows.item(0)){
        return undefined
      }
      return {
        lineId: res.rows.item(0).lineId,
        inventory: res.rows.item(0).inventory,
        product: res.rows.item(0).product,
        expected_quantity: res.rows.item(0).expected_quantity,
        quantity: res.rows.item(0).quantity,
      }
    })
  } */

  /* getLineBD(product: number) : Promise<InventoryLine>{
    let data = [product]
    return this.db.executeSql('SELECT * FROM stock_inventory_line WHERE product = ?', data).then(res => {
      if(!res.rows.item(0)){
        return undefined
      }
      return {
        lineId: res.rows.item(0).lineId,
        inventory: res.rows.item(0).inventory,
        product: res.rows.item(0).product,
        expected_quantity: res.rows.item(0).expected_quantity,
        quantity: res.rows.item(0).quantity,
      }
    })
  } */
}



