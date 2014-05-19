'use strict';

// var items = global.nss.db.collection('items');

class Item{    //when you create a new item, it takes in the Item's type
  constructor(type){
    this.type = type;

    switch(type){
    case 'autogrow':
      this.cost = 50000;
      this.image = '/img/autogrow.png';
      break;
    case 'autoseed':
      this.cost = 75000;
      this.image = '/img/autoseed.png';
      break;
    case 'autoroot':
      this.cost = 85000;
      this.image = '/img/autoroot.png';
      break;
    }
  }
}

module.exports = Item;
