'use strict';

var trees = global.nss.db.collection('trees');  //indicates we are working with a database
// var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');

class Tree {
  constructor(userId){
    this.userId = userId;
    this.height= 0;
    this.isHealthy = true;
    this.isChopped = false;
  }

  save(fn){
    trees.save(this, ()=>fn());
  }

  grow(){
    if(!this.isAdult){                                    //my way for height
    this.height += _.random(0,2,true);
    }else{
    this.height += _.random(0,this.height/10, true);
    }
    var min = this.isAdult ? 200 - ((this.height/12)*0.10) : 200;   //child's way for health
    min = min < 10 ? 10 : min;
    this.isHealthy = _.random(0, min, true) > 1;
  }

   chop(user){
    user.wood += this.height / 2;
    this.height = 0;
    this.isHealthy = false;
    this.isChopped = true;
  }



  get isAdult(){
    return this.height >= 48;
  }

  get isChoppable(){
    return this.isAdult && this.isHealthy && !this.isBeanStalk;
  }

  get isGrowable(){
    return this.isHealthy && !this.isBeanStalk;
  }

  get isBeanStalk(){
    return (this.height / 12) >= 10000;
  }


  get classes(){              //this is an instance method. only ran on this instance. as oppossed to a static/class method
    var classes = [];
    if(this.height === 0){
      classes.push('seed');
    }else if(this.height < 24){
      classes.push('sapling');
    }else if(!this.isAdult){
      classes.push('treenager');
    }else{
      classes.push('adult');
    }

    if(!this.isHealthy){
      classes.push('dead');
    }else{
      classes.push('alive');
    }

    if(this.isChopped){
      classes.push('stump');
    }

    if(this.isBeanStalk){
      classes.push('beanstalk');
    }
    return classes.join(' ');   // .join() takes an array and turns them into a string
    }

  static findByTreeId (treeId, fn){
    treeId = Mongo.ObjectID(treeId);
    trees.findOne({_id:treeId}, (error, tree)=>{
      tree = _.create(Tree.prototype, tree);
      fn(tree);
    });
  }

  static plant(userId, fn){
      userId = Mongo.ObjectID(userId);
      var tree = new Tree(userId);
      trees.save(tree, ()=>fn(tree));
  }

  static findAllByUserId (userId, fn){
      userId = Mongo.ObjectID(userId);
      trees.find({userId:userId}).toArray((error, objects)=>{
        var forest = objects.map(o=>_.create(Tree.prototype, o));
        fn(forest);
      });
  }
}

module.exports = Tree;
