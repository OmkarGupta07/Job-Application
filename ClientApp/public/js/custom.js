// JavaScript Document

$(window).on("load", function(){
	$(".loader").fadeOut(200);
});

if($('body').hasClass('menubar-visible')){
	$(this).addClass('change');
}

$('.dropdown .dropdown-menu').click(function(e) {
	e.stopPropagation();
});
// Add slideDown animation to Bootstrap dropdown when expanding.
$('.dropdown').on('show.bs.dropdown', function() {
	$(this).find('.dropdown-menu').first().stop(true, true).slideDown();
});

// Add slideUp animation to Bootstrap dropdown when collapsing.
$('.dropdown').on('hide.bs.dropdown', function() {
	$(this).find('.dropdown-menu').first().stop(true, true).slideUp();
});

$(document).ready(function() {
	$('#content').hover(function(){
		if($('#main-menu').find('.sub-menu').hasClass('expanded')){
			$('#main-menu').find('.sub-menu').removeClass('expanded');	
		}
	});
	
}); /* document.ready end */

/* MULTIPLE FILE SELECT */
;( function ( document, window, index )
{
	var inputs = document.querySelectorAll( '.inputfile' );
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e )
		{
			var fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();

			if( fileName )
				label.querySelector( 'span' ).innerHTML = fileName;
			else
				label.innerHTML = labelVal;
		});

		// Firefox bug fix
		input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
		input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
	});
}( document, window, 0 ));
/* END MULTIPLE FILE SELECT */



