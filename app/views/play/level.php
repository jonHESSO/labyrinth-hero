<!DOCTYPE html>
<html>
<head>
	<title>Play level <?php echo("{$data['level']}"); ?></title>
	<link rel="stylesheet" type="text/css" href="/labyrinth-hero/public/css/stylesheet.css"></link>
</head>
<body>
	<script type="text/javascript">var currentLevel = <?php echo($data['level']) ?> </script>
	<?php
	include '../app/views/header.php';
	?>
	<main>
		<p>Try to beat this complex level : <?php echo($data['level']); ?></p>
		<div id="canvas-container" ondrop="drop(event)" ondragover="allowDrop(event)">
			<canvas></canvas>
		</div>

		<ul></ul>


		<!--  CLASSES UTILISÉES : bar, chrono, infobox  -->
		<div class="bar">

			<div style="float: right">

				<div class="coin" id="coin">
					<img src="/labyrinth-hero/public/image/objects/coin/coin1.png"> × <span id="nb">0</span>
				</div>


				<div class="chrono" id="chrono">
					00:00.000
				</div>

			</div>

			<ul class="bonus" id="bonus">
			</ul>


		</div>
		<input type="button" id="btnToggleMusic" src="/labyrinth-hero/public/image/audio.png"/>

		<audio id="gameMusic">
			<source src="/labyrinth-hero/public/audio/music.ogg" type="audio/ogg; codecs=vorbis"/>
			<source src="/labyrinth-hero/public/audio/music.mp3" type="audio/mpeg"/>
		</audio>
		<audio id="gameSound_coin">
			<source src="/labyrinth-hero/public/audio/coin.ogg" type="audio/ogg; codecs=vorbis"/>
			<source src="/labyrinth-hero/public/audio/coin.mp3" type="audio/mpeg"/>
		</audio>
		<audio id="gameSound_bomb">
			<source src="/labyrinth-hero/public/audio/bomb.ogg" type="audio/ogg; codecs=vorbis"/>
			<source src="/labyrinth-hero/public/audio/bomb.mp3" type="audio/mpeg"/>
		</audio>
		<audio id="gameSound_pickaxe">
			<source src="/labyrinth-hero/public/audio/pickaxe.ogg" type="audio/ogg; codecs=vorbis"/>
			<source src="/labyrinth-hero/public/audio/pickaxe.mp3.mp3" type="audio/mpeg"/>
		</audio>

		<script  src="https://code.jquery.com/jquery-3.3.1.min.js"
		integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
		crossorigin="anonymous"></script>
		<link data-require="sweet-alert@*" data-semver="0.4.2" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" />
		<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
		<script src="/labyrinth-hero/public/js/main.js"></script>

	</main>	
	<?php
	include '../app/views/footer.php';
	?>

</body>
</html>