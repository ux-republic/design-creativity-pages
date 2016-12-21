(function () {
	APP.modules = APP.modules || {};

	APP.modules.load = {
		initLoad: function () {

      $(window).on('load', function (e) {
        $('.c-splash').addClass('splash-loaded');
      });

      $('#launch_trends').click( function(){

        $('.c-splash').fadeOut();

        $('body').addClass('is-loaded'), setTimeout(function() {
            $('body').addClass('is-animated');
        }, 800);

        setTimeout(function() {
          $('.tutorial_touch').addClass('tutorial_touch--fade');
        }, 1400);

        setTimeout(function() {
          $('.tutorial_touch').fadeOut();
        }, 3000);

      });

    }
  };
  var self = APP.modules.load;
})();
