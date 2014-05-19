(function() {
  'use strict';
  init();
  function init() {
    $('#autoseed').click(seed);
  }
  var isOn = false;
  var timer;
  function seed() {
    isOn = !isOn;
    $('.autoseed').toggleClass('on');
    if (isOn) {
      start();
    } else {
      clearInterval(timer);
    }
  }
  function start() {
    timer = setInterval(seeding, 1000);
  }
  function seeding() {
    $('.alive:not(.beanstalk)').map((function(i, d) {
      return $(d).attr('data-id');
    })).each((function(i, v) {
      var tree = $((".tree[data-id=" + v + "]"));
      ajax(("/trees/" + v + "/seed"), 'put', null, (function(html) {
        tree.replaceWith(html);
      }));
    }));
  }
})();

//# sourceMappingURL=autoseed.map
