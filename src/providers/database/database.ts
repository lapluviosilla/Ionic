import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import { Storage} from "@ionic/storage";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import { Platform} from 'ionic-angular';


@Injectable()
export class DatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public http: Http, private sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'contacts.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val){
              this.databaseReady.next(true);
            }else{
              this.fillDatabase();
            }
          })
        });
    });
  }

  fillDatabase(){
    this.http.get('assets/dummyDump.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.log(e));
      });
  }

  addContact( fName, lName, pNumber, address, location ) {
    let data = [fName, lName, pNumber, address, location];
    return this.database.executeSql("INSERT INTO contacts (fName, lName, pNumber, address, location) VALUES (?, ?, ?, ?)", data).then( res => {
      return res;
    });
}

  getAllContacts(){
    return this.database.executeSql("SELECT * FROM contact", []).then(data => {
      let contacts = [];
      for (var i = 0; i < data.rows.length; i++) {
        contacts.push({
          fName: data.rows.item(i).fName,
          lName: data.rows.item(i).lName,
          pNumber: data.rows.item(i).pNumber,
          address: data.rows.item(i).address,
          location: data.rows.item(i).location
        })
      }
      return contacts;
    }, err => {
      console.log('Error: ', err);
      return[];
    })

  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}
