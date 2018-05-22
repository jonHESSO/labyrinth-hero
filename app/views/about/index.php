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
	</main>
	<?php
		include '../app/views/footer.php';
	?>
</body>
</html>