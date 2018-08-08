import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-add-contacts',
  templateUrl: 'add-contacts.html',
})
export class AddContactsPage {
  contacts = [];
  contact = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.databaseProvider.getDatabaseState().subscribe(rdy =>{
      if (rdy) {
        this.loadContactData();
      }
    })
  }

  loadContactData(){
    this.databaseProvider.getAllContacts().then(data => {
      this.contacts = data;
    });
  }

  addContact() {
    this.databaseProvider.addContact(this.contact['fName'], this.contact['lName'], this.contact['pNumber'], this.contact['address'], this.contact['location'])
      .then(data => {
        this.loadContactData();
      });
    this.contact = {};
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddContactsPage');

  }

}
