// Socket.IO Connection ( just for live statistics )
// http://localhost:3000/socket.io/socket.io.js ( linked in HTML ) 
var socket = io.connect('http://localhost:3000');

// jQuery v3.1.1
$( document ).ready(function() {
	
	/** Candidate Selection 
	*	
	* Selects a candidate by copying the candidate name into
	* the vote ballot input box.
	*
	**/ 
	$('.candidate').on('mousedown keydown', function (e) {
		console.log(e);	
		if (e.type == "mousedown" || e.keyCode == 32 || e.keyCode == 13 ) {
			 $('.vote').val( $(this).html() );
		}
	});

	// Tab Backwards to select a candidate when focused on the 'Vote' button 
	$('.button').on('keydown', function (e) {
		console.log(e);
		if (e.keyCode == 9) {
			$(this).blur();
			$('ul.candidates li:first-child').focus();
		}
	});


	// Get socket data when results are sent ( server triggered )
	socket.on('statistics', function (data) {

		// Update total votes & projected winner
		if (data.total) $('.total-votes').html(data.total + ' Votes');

		if (data.projectedWinner) {
			$('.projectedWinner').html(data.projectedWinner.name).attr('class', 'projectedWinner '+data.projectedWinner.color);
		}

		// For each candidate, generate a percentage bar.
		for (i = 0; i < data.candidates.length; i++) {
			
			var candidate = data.candidates[i];
			if ($('#'+candidate.id).length == 0) {
				
				// Result bar HTML
				var bar = 	'<li class="'+candidate.color+'" id="'+candidate.id+'" data-count="'+candidate.count+'">'+
								'<div class="name">'+candidate.name+'</div>'+
								'<div class="count">'+candidate.count+'</div>'+
							'</li>';

				// Append to template
				$('.statistics').append(bar);
			}

			// Adjust the count and width of result bars
			$('#'+candidate.id).css('width', candidate.percentage+'%').data('count', candidate.count).css("width", candidate.percentage+"%");
			$('#'+candidate.id+' .count').html(candidate.count);
		}
	});

// End of file
});