import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { InventoryLine } from '../interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  /* add foreign keys!!!!!!!!!!! */
  private createStockInventoryLine: string = "create table if not exists stock_inventory_line(" +
    "lineId INTEGER PRIMARY KEY," +
    "inventory INTEGER," +
    "product INTEGER," +
    "expected_quantity INTEGER," +
    "quantity INTEGER) " +
    ";"

  private database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private platform:Platform, private sqlite:SQLite) {
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'todos.db',
        location: 'default'
      })
      .then((db:SQLiteObject)=>{
        this.database = db;

        this.createTables().then(()=>{     
          //communicate we are ready!
          this.dbReady.next(true);
        });
      })

    });
  }

  private createTables(){
    return this.database.executeSql(this.createStockInventoryLine,[] )
    /* .then(()=>{
      return this.database.executeSql(this.createStockInventoryLine,[] )
    }) */.catch((err)=>console.log("error detected creating tables", err));
  }
  private isReady(){
    return new Promise<void>((resolve, reject) =>{
      //if dbReady is true, resolve
      if(this.dbReady.getValue()){
        resolve();
      }
      //otherwise, wait to resolve until dbReady returns true
      else{
        this.dbReady.subscribe((ready)=>{
          if(ready){ 
            resolve(); 
          }
        });
      }  
    })
  }

  getInventoryLines(){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql("SELECT * from stock_inventory_line", [])
      .then((data)=>{
        let inventoryLines : InventoryLine[] = [];
        for(let i=0; i<data.rows.length; i++){
          inventoryLines.push(data.rows.item(i));
        }
        return inventoryLines;
      })
    })
  }

  addInventoryLine(productId : number){
    let data = [productId];
    return this.isReady()
    .then(()=>{
      this.database.executeSql('INSERT INTO stock_inventory_line (product) VALUES (?)', data).then((result)=>{
        if(result.insertId){
          return this.getInventoryLine(productId);
        }
      })
    });
   }

  getInventoryLine(product:number){
    let data = [product]
    return this.isReady()
    .then(()=>{
      return this.database.executeSql('SELECT * FROM stock_inventory_line WHERE product = ?',data)
      .then((data)=>{
        if(data.rows.length){
          return data.rows.item(0);
        }
        return null;
      })
    })    
  }
  deleteInventoryLine(id:number){ }

  /* getTodosFromList(listId:number){ }
  addTodo(description:string, isImportant:boolean, isDone:boolean, listId:number){ }
  modifyTodo(description:string, isImportant:boolean, isDone:boolean, id:number){ }
  removeTodo(id:number){ } */
}