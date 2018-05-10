<!DOCTYPE html>
<html>
<head>
	<title>Leaderboard</title>
	<link rel="stylesheet" type="text/css" href="/labyrinth-hero/public/css/stylesheet.css"></link>
</head>
<body>
	<?php
	include '../app/views/header.php';
	?>
	<main>
		<p>Welcome to the leaderboard</p>
		<table>
			<tr>
				<th>Rank</th>
				<th>Username</th>
				<th>Highscore</th>
			</tr>
			<?php
			$position = 1 ; 
			foreach ($data['scoreList'] as $score) {
				echo("<tr>") ;
				echo("<td>".$position."</td>") ;
				echo("<td>".$score->username."</td>") ;
				echo("<td>".$score->totalscore."</td>") ;
				echo("</tr>") ;
				$position++ ;
			}
			?>

		</table>		
	</main>	
	<?php
	include '../app/views/footer.php';
	?>

</body>
</html>