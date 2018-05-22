<!DOCTYPE html>
<html>
<head>
	<title>Play level <?php echo("{$data['level']}"); ?></title>
	<link rel="stylesheet" type="text/css" href="/labyrinth-hero/public/css/stylesheet.css"></link>
</head>
<body>
	<?php
		include '../app/views/header.php';
	?>
	<main>
		<p>Try to beat this complex level : <?php echo($data['level']); ?></p>
	</main>	
	<?php
		include '../app/views/footer.php';
	?>

</body>
</html>