var APP = {};

(function() {
    APP = {
      initPage: function() {
        self.modules.load.initLoad();
        self.modules.slider.initSlider();
      }
    };
    var self = APP;
})();
