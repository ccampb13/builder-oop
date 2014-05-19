/* jshint unused:false */

var audioChop, audioBeanStalk;

function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){   //default parameters go last
  'use strict';
  $.ajax({url:url, type: type, dataType:dataType, data:data, success:success});
}


(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#dashboard').on('click', '#plant', plant);
    $('#dashboard').on('click', '#getforest', forest);
    $('#forest').on('click', '.grow', grow);
    $('#forest').on('click', '.chop', chop);
    $('#dashboard').on('click', '#sell-wood', sellWood);
    $('#dashboard').on('click', '#autogrow', purchaseAutoGrow);
    $('#dashboard').on('click', '#autoseed', purchaseAutoSeed);
    preloadAssets();
  }


    function purchaseAutoSeed(){
      var userId = $('#user').attr('data-id');
      ajax(`/users/${userId}/purchase/autoseed`, 'put', null, html=>{
        items();
        $('#dashboard').empty().append(html);
      });
    }

    function purchaseAutoGrow(){
      var userId = $('#user').attr('data-id');
      ajax(`/users/${userId}/purchase/autogrow`, 'put', null, html=>{
        items();
        $('#dashboard').empty().append(html);

    });
  }

    function preloadAssets(){
      audioChop = $('<audio>')[0];
      audioChop.src = '/audios/chainsaw.mp3';
      audioBeanStalk = $('<audio>')[0];
      audioBeanStalk.src = '/audios/heavenly.mp3';
    }

    function sellWood(){
    var userId = $('#user').attr('data-id');
    var amount = $('#wood-amt').val();
    ajax(`/users/${userId}/sellwood`, 'put', {amount:amount}, h=>{
      $('#dashboard').empty().append(h);
    });
  }

   function chop(){
    audioChop.play();
    var tree = $(this).closest('.tree');
    var treeId = tree.attr('data-id');
    var userId = $('#user').attr('data-id');
    ajax(`/trees/${treeId}/chop/${userId}`, 'put', null, html=>{
      tree.replaceWith(html);
      dashboard();
    });
  }

  function dashboard(){
    var userId = $('#user').attr('data-id');
    ajax(`/users/${userId}`, 'get', null, html=>{
      $('#dashboard').empty().append(html);
    });
  }



  function grow(){
    var tree = $(this).parent().parent();
    console.log(tree);
    var treeId = tree.attr('data-id');
    ajax(`/trees/${treeId}/grow`, 'put', null, html=>{
      tree.replaceWith(html);
      if($(html).hasClass('beanstalk')){
        audioBeanStalk.play();
      }
    });
  }

  function login(){
    var username = $('#username').val();
    ajax('/login', 'post', {username:username}, html =>{
      $('#dashboard').empty().append(html);
      forest();
      items();
    });
  }

  function forest(){
    var userId = $('#user').attr('data-id');
    ajax(`/trees?userId=${userId}`, 'get', null, html=>{
      $('#forest').empty().append(html);
    });
  }

  function items(){
    var userId = $('#user').attr('data-id');
    ajax(`/items?userId=${userId}`, 'get', null, html=>{
      console.log(html);
      $('#equipment').empty().append(html);
    });
  }

  function plant(){
    var userId = $('#user').attr('data-id'); //mongo isn't used here, but rather in the node file
    ajax('/trees/plant', 'post', {userId:userId}, html=>{
      $('#forest').append(html);
    });
  }


})();
