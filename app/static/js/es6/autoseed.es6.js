/*jshint unused: false*/
/* global ajax, audioBeanStalk */

(function(){
  'use strict';

  init();

  function init(){
    $('#autoseed').click(seed);


  }

  var isOn = false;
  var timer;


  function seed(){
    isOn = !isOn;
    $('.autoseed').toggleClass('on');
    if(isOn){
      start();
    } else {
      clearInterval(timer);
    }
  }

  function start(){
    timer = setInterval(seeding, 1000);
  }

  function seeding(){
    $('.alive:not(.beanstalk)').map((i, d)=>$(d).attr('data-id')).each((i,v)=>{
      var tree = $(`.tree[data-id=${v}]`);
      ajax(`/trees/${v}/seed`, 'put', null, html=>{
        tree.replaceWith(html);
      });
    });
  }

})();
