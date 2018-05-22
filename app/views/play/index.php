<!DOCTYPE html>
<html>
<head>
	<title>Select level</title>
	<link rel="stylesheet" type="text/css" href="/labyrinth-hero/public/css/stylesheet.css"></link>
	<style>
	main {
		margin-left: auto;
		margin-right: auto;
		max-width: 1400px;
		text-align: center;
	}
</style>
</head>
<body>
	<?php
	include '../app/views/header.php';
	?>
	<main>
		<p id="pLevel">Please choose the level you want to play</p>
		<?php for ($i=1; $i <= 20; $i++) {
			$disabled = '';
			if($i > $data['highestlevel']+1)
			{
				$disabled = ' disabled="true"';
			}
			
			$contentstring = '<form method="post" action="/labyrinth-hero/public/play/level" style="display:inline-block">'.
			'<input type="hidden" name="level" value="'.$i.'">'.
			'<button type="submit" name="submit_param" value="submit_value" class="levelbutton"'.$disabled.'>'.
			'Level<br/>'.$i.
			'</button>'.
			'</form>'."\n";
			echo ($contentstring);

		} ?>
	</main>	
	<?php
	include '../app/views/footer.php';
	?>

</body>
</html>