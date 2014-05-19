'use strict';

var users = global.nss.db.collection('users');  //indicates we are working with a database
var Mongo = require('mongodb');
var _ = require('lodash');

class User {
  constructor(username){
    this.username = username;  //it puts a username inside the object created
    this.wood = 0;
    this.cash = 0;
    this.items = [];
  }

  save(fn){
    users.save(this, ()=>fn());
  }

  purchase(item){
    if(item.cost <= this.cash){
      this.cash -= item.cost;
      this.items.push(item);
    }
  }

  sellWood(amount){
    amount = amount * 1;
    if(amount <= this.wood){
      this.wood -= amount;
      this.cash += amount / 5;
    }
  }
       static findItems(user){
    user = this.items;
     console.log('user');
  }

  get isAutoGrowAvailable(){
    var isPresent = _(this.items).any(i=>i.type === 'autogrow');
    return (this.cash >= 50000) && !isPresent;
  }

  get isAutoSeedAvailable(){
    var isPresent = _(this.items).any(i=>i.type === 'autoseed');
    return (this.cash >= 75000) && !isPresent;

  }

   get isAutoRootAvailable(){
    var isPresent = _(this.items).any(i=>i.type === 'autoroot');
    return this.cash >= 75000 && !isPresent;
  }


  static findByUserId(userId, fn){
    userId = Mongo.ObjectID(userId);
    users.findOne({_id:userId}, (e, user)=>{
      user = _.create(User.prototype, user);
      fn(user);
    });
  }

  static login(username, fn){    //class method = static function name.. properties mean i'm giving you a username call me back when you are ready.

    username = username.trim().toLowerCase();  //trim works on strings. if there is a array of strings you would have to loop through them in a functino.
    users.findOne({username:username}, (error, user)=>{
      if(user){
        user = _.create(User.prototype, user);
        fn(user);
      }else{
        user = new User(username);  //new User calls the constructor
        users.save(user, ()=>{   //
          fn(user);
        });
      }
    });
  }
}

module.exports = User;
