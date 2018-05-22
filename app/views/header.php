<header>
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
	</nav>
</header>