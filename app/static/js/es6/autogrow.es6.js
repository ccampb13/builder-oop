/*jshint unused: false*/
/* global ajax, audioBeanStalk */

(function(){
  'use strict';

  init();

  function init(){
    $('#autogrow').click(grow);
    slideBar();

  }

  var isOn = false;
  var timer;

  function slideBar(){
    $('#items').noUiSlider({
  	   start: [ 40 ],
  	    range: {
  		          'min': [  0 ],
  		          'max': [ 100 ]
  	    },

        serialization: {
                lower: [
                      $.Link({
                            target: $('#items')
                                })
                        ],
                        format: {
                            thousand: ','
                        }
                  }
  });
}

  function grow(){
    isOn = !isOn;
    $('#autogrow').toggleClass('on');
    if(isOn){
      start();
    } else {
      clearInterval(timer);
    }
  }

  function start(){
    clearInterval(timer);
    timer = setInterval(growing, 1000);
  }

  function growing(){
    $('.alive:not(.beanstalk)').map((i, d)=>$(d).attr('data-id')).each((i,v)=>{

    var tree = $(`.tree[data-id=${v}]`);
      ajax(`/trees/${v}/grow`, 'put', null, html=>{
        tree.replaceWith(html);
        if($(html).hasClass('beanstalk')){
          audioBeanStalk.play();
        }
      });
    });
  }

})();
