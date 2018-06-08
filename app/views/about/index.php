<!DOCTYPE html>
<html>
<head>
	<title>About</title>
	<link rel="stylesheet" type="text/css" href="/labyrinth-hero/public/css/stylesheet.css"></link>
	<style>
	.flex-container-about {
		display: flex;
		justify-content: center;
	}
	.flex-container-about > div {
		width: 600px;
		text-align: center;
		align-self: center;
		font-size: 24px;
	} 
	#pot{
		position:absolute;
		padding-bottom: 30px;
		-webkit-animation:linear infinite alternate;
		-webkit-animation-name: run;
		-webkit-animation-duration: 8s;
	}     
	@-webkit-keyframes run {
		0% { left: 0;}
		50%{ left : 91%;}
		100%{ left: 0;}
	}
</style>
</head>
<body>
	<?php
		include '../app/views/header.php';
	?>

	<main>
		<div class="flex-container-about">
			
			<div><p>This project was conducted as part of the 624-2 RIA course under the supervision of Mr. Alexandre Cotting.</p><p>Project description:</br><a href="https://docs.google.com/document/d/1FScoHWb6iz59EV6_a74nbqurO68IRy9tCPYESNEFrwY/edit#">Documentation</a></p></br><p>Bryan Spahr, Jonathan Schnyder, Fabien Terrani and Quentin Remion</p></div>
		</div>
		<div id = "pot">
			<img src = "/labyrinth-hero/public/image/rabbit_colored.png"width = "130px" height ="130px" >
		</div>
	</main>
	<?php
		include '../app/views/footer.php';
	?>

</body>
</html>