import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {
  contacts = [];
  contact = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.databaseprovider.getDatabaseState().subscribe(rdy =>{
      if (rdy) {
        this.loadContactData();
      }
    })
  }

  loadContactData(){
    this.databaseprovider.getAllContacts().then(data => {
      this.contacts = data;
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsPage');
  }

}
