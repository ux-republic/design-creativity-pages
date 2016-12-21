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

(function () {
	APP.modules = APP.modules || {};

	APP.modules.slider = {
		initSlider: function () {

      var last   = 0,
          opened = false;

			$('.c-slider__item--text').click( function(){

				$('body').addClass('is-opened');

				var article = '#article_'+$(this).data('article');

				$('#article').load('./content.html '+article).fadeIn();

        $('.c-close-article').fadeIn();

        opened = true;

			});

      $('.c-close-article').on( "click", function(){

				$('body').toggleClass('is-opened');

				$('#article').fadeOut();
        $(this).fadeOut();

        setTimeout(function() {
          $('#article').empty();
        }, 800);

        opened = false;

			});

			$('#slider_prev').on('click', throttle(function (event) {

				var item = $(this),
				    data = item.data('slide');

				setSlider(data, item);

			}, 1400));

			$('#slider_next').on("click", throttle(function (event) {

				var item = $(this),
				    data = item.data('slide');

				setSlider(data, item);

			}, 1400));

      $('.c-timeline__item').on("click", throttle(function (event) {

        var item = $(this),
				    data = item.data('pager');

				setSlider(data, item);

			}, 1400));

			function setSlider(data, item){

        var pagerItem = $('.c-slider__item'),
            dataNext = data + 1,
            dataPrev = data - 1;

        if (dataNext > 8){
          dataNext = 0
        }

        if (dataPrev < 0){
          dataPrev = 8
        }

        $('#current_slide').empty().html(data+1);

        $('#slider_prev').data('slide', dataPrev);
        $('#slider_next').data('slide', dataNext);

        $('.c-slider__item:not(.is-current)').hide();

        setTimeout(function() { $('.c-slider__item:not(.is-current)').show(); }, 800);

        $('.c-timeline--state').removeClass().addClass('c-timeline--state pager_'+data);

        for (var i = 0; i < pagerItem.length; i++) {

          if (i > data) {
            $(pagerItem[i]).removeClass('is-current is-prev').addClass('is-next');
          }else if ( i < data ){
            $(pagerItem[i]).removeClass('is-current is-next').addClass('is-prev');
          }

          if (last > data) {
            $(pagerItem[last]).removeClass('is-current is-prev').addClass('is-next');
          }else if ( last < data){
            $(pagerItem[last]).removeClass('is-current is-next').addClass('is-prev');
          }

          if ( data == 0 ) {

            $(pagerItem[8]).removeClass('is-current is-next').addClass('is-prev');

          }else if ( data == 8 ) {

            $(pagerItem[0]).removeClass('is-current is-prev').addClass('is-next');

          }

        }

        $(pagerItem[data]).show().removeClass('is-next is-prev').addClass('is-current');

        if (opened === true) {

          var article = '#article_'+data,
              articleHeight = $('#article').height();

          $('#article').css({'height': articleHeight+'px','opacity': '0'});

          setTimeout(function() {
            $('#article').empty().load('./content.html '+article);
          }, 400);

          setTimeout(function() {
            $('#article').fadeIn().css({'height': 'auto','opacity' : '1'});
          }, 800);



        }


        item.data('last',data);

        last = item.data('last');


      };




      document.addEventListener('touchstart', handleTouchStart, false);
      document.addEventListener('touchmove', handleTouchMove, false);

      var xDown = null;
      var yDown = null;

      function handleTouchStart(evt) {
          xDown = evt.touches[0].clientX;
          yDown = evt.touches[0].clientY;
      };

      function handleTouchMove(evt) {
          if ( ! xDown || ! yDown ) {
              return;
          }

          var xUp = evt.touches[0].clientX;
          var yUp = evt.touches[0].clientY;

          var xDiff = xDown - xUp;
          var yDiff = yDown - yUp;

          if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
              if ( xDiff > 0 ) {
                  /* left swipe */
                  $('#slider_next').click();
              } else {
                  /* right swipe */
                  $('#slider_prev').click();
              }
          } else {
              if ( yDiff > 0 ) {
                  /* up swipe */
              } else {
                  /* down swipe */
              }
          }
          /* reset values */
          xDown = null;
          yDown = null;
      };


			function throttle(func, milliseconds) {
			    var lastCall = 0;
			    return function () {
			        var now = Date.now();
			        if (lastCall + milliseconds < now) {
			            lastCall = now;
			            return func.apply(this, arguments);
			        }
			    };
			};


    }
  };
  var self = APP.modules.slider;
})();
