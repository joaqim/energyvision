$(document).ready(function($){

  $('.progress-button').progressInitialize();

});

(function($){

	// Creating a number of jQuery plugins that you can use to
	// initialize and control the progress meters.

	$.fn.progressInitialize = function(){

		// This function creates the necessary markup for the progress meter
		// and sets up a few event listeners.


		// Loop through all the buttons:

		return this.each(function(){

			var button = $(this),
				progress = 0;

			// Extract the data attributes into the options object.
			// If they are missing, they will receive default values.

			var options = $.extend({
				type:'background-horizontal',
				loading: 'Loading..',
				//finished: 'Done!'
			}, button.data());

			// Add the data attributes if they are missing from the element.
			// They are used by our CSS code to show the messages
			/*button.attr({'data-loading': options.loading, 'data-finished': options.finished});*/
      button.attr({'data-loading': options.loading});

			// Add the needed markup for the progress bar to the button
			var bar = $('<span class="loading-bar ' + options.type + '">').appendTo(button);


			// The progress event tells the button to update the progress bar
			button.on('progress', function(e, val, absolute, finish){

				if(!button.hasClass('in-progress')){

					// This is the first progress event for the button (or the
					// first after it has finished in a previous run). Re-initialize
					// the progress and remove some classes that may be left.

					bar.show();
					progress = 0;
					button.removeClass('finished').addClass('in-progress')
				}

				// val, absolute and finish are event data passed by the progressIncrement
				// and progressSet methods that you can see near the end of this file.

				if(absolute){
					progress = val;
				}
				else{
					progress += val;
				}

				if(progress >= 100){
					progress = 100;
				}

				if(finish){

					button.removeClass('in-progress').addClass('finished');

					bar.delay(500).fadeOut(function(){

						// Trigger the custom progress-finish event
						button.trigger('progress-finish');
						setProgress(0);
					});

				}

				setProgress(progress);
			});

			function setProgress(percentage){
				bar.filter('.background-horizontal,.background-bar').width(percentage+'%');
				bar.filter('.background-vertical').height(percentage+'%');
			}

		});

	};

	// progressStart simulates activity on the progress meter. Call it first,
	// if the progress is going to take a long time to finish.

	$.fn.progressStart = function(){

		var button = this.first(),
			last_progress = new Date().getTime();

		if(button.hasClass('in-progress')){
			// Don't start it a second time!
			return this;
		}

		button.on('progress', function(){
			last_progress = new Date().getTime();
		});

		// Every half a second check whether the progress
		// has been incremented in the last two seconds

		var interval = window.setInterval(function(){

			if( new Date().getTime() > 2000+last_progress){

				// There has been no activity for two seconds. Increment the progress
				// bar a little bit to show that something is happening

				button.progressIncrement(5);
			}

		}, 500);

		button.on('progress-finish',function(){
			window.clearInterval(interval);
		});

		return button.progressIncrement(10);
	};

	$.fn.progressFinish = function(){
		return this.first().progressSet(100);
	};

	$.fn.progressIncrement = function(val){

		val = val || 10;

		var button = this.first();

		button.trigger('progress',[val])

		return this;
	};

	$.fn.progressSet = function(val){
		val = val || 10;

		var finish = false;
		if(val >= 100){
			finish = true;
		}

		return this.first().trigger('progress',[val, true, finish]);
	};

	// This function creates a progress meter that
	// finishes in a specified amount of time.

	$.fn.progressTimed = function(seconds, cb){

		var button = this.first(),
			bar = button.find('.loading-bar');

		if(button.is('.in-progress')){
			return this;
		}

		// Set a transition declaration for the duration of the meter.
		// CSS will do the job of animating the progress bar for us.

		bar.css('transition', seconds+'s linear');
		button.progressSet(99);

		window.setTimeout(function(){
			bar.css('transition','');
			button.progressFinish();

			if($.isFunction(cb)){
				cb();
			}

		}, seconds*1000);
	};

})(jQuery);
