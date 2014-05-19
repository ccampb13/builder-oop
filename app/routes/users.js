'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Item = traceur.require(__dirname + '/../models/item.js');


exports.login = (req, res)=>{
  User.login(req.body.username, user=> {   //the function in the user.js model file is this function
    res.render('users/dashboard', {user:user});
  });
};

exports.dashboard = (req, res)=>{
  User.findByUserId(req.params.userId, user=>res.render('users/dashboard', {user:user}));
};

exports.sellWood = (req, res)=>{
  User.findByUserId(req.params.userId, user=>{
    user.sellWood(req.body.amount);
    user.save(()=>res.render('users/dashboard', {user:user}));
  });
};

exports.purchase = (req, res)=>{  //
  User.findByUserId(req.params.userId, user=>{
    var item = new Item (req.params.item);
        user.purchase(item);
          user.save(()=>{
            res.render('users/dashboard', {user:user});
          });
      });
};

exports.items = (req, res)=>{
  User.findByUserId(req.query.userId, user=>res.render('users/items', {user:user}));
};
