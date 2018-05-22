<header>
	<script
	src="https://code.jquery.com/jquery-3.3.1.min.js"
	integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
	crossorigin="anonymous">

</script>
<script type="text/javascript">

	$(document).ready(function()
	{
		var PrefBarColor =
		{
						// Colors for the main bar
						barColors: {
							'Dark gray': '#333',
							'Dark orange': 'darkorange',
							'Dark violet': 'darkviolet',
							'Teal': 'teal',
							'Dark blue': 'darkblue'
						},
						
						// Getting the prefered color from local storage
						get: function() {
							var color = localStorage.getItem( 'prefBarColor' );
							if ( !color ) color = '#333';
							return color;
						},
						
						// Setting the prefered color from local storage
						set: function( newColor ) {
							localStorage.setItem( 'prefBarColor', newColor+'' );
						},
						
						// Applying the preference (modifying the main bar's background color)
						apply: function() {
							$('header nav.menu').css({ background: this.get() });
						},
						
						// Populating a <select> element with the possible colors
						initBarColorSelect: function( selectSet ) {
							var prefBarColor = this.get();
							var barColors = this.barColors;
							
							for ( var colName in barColors )
							{
								var cssColor = barColors[colName];
								var option = document.createElement('option');
								
								// Adding value and style to the <option>
								option.style.background = cssColor;
								option.style.color = 'white';
								option.setAttribute('value', cssColor );
								
								// Auto-selecting the right <option>
								if ( barColors[colName] == prefBarColor )
									option.setAttribute('selected', 'selected');
								
								// Adding text to the <option>
								option.appendChild( document.createTextNode( colName ) );
								
								// Adding the <option> to all <select>
								selectSet.append( option );
							}
							
							// We keep a reference to the PrefBarColor object (closure)
							var colorPref = this;
							
							selectSet.on( 'change', function( e )
							{
								colorPref.set( $( e.target ).val() );
								colorPref.apply();
								
								// Changing the value on all <selects>
								selectSet.val( $(e.target).val() );
							});
						}
					};
					
					PrefBarColor.apply();
					PrefBarColor.initBarColorSelect( $('.prefBarColor') );
					
				});



			</script>
			<div id="container">
				<div id="center"><img src="/labyrinth-hero/public/image/logo_lab.png" alt="labyrinth-hero image"></div>
				<div id="right"><?php 
				if ((isset($_SESSION['username']) != '')) 
				{
					echo("Hello "."{$_SESSION['username']}"."<br/>") ;
					echo '<a href="/labyrinth-hero/public/login/logout">Logout</a>' ;
				}
				else
				{
					echo 'Not logged in<br/>' ;
					echo '<a href="/labyrinth-hero/public/login">Login</a>' ;
				}
				?></div>
			</div>

			<nav class = "menu">
				<a href="/labyrinth-hero/public/home">Home</a>	
				<a href="/labyrinth-hero/public/play">Play</a>
				<a href="/labyrinth-hero/public/leaderboard">Leaderboard</a>
				<a href="/labyrinth-hero/public/about">About</a>
				<select class="prefBarColor" style="float:right"></select>		
			</nav>


		</header>