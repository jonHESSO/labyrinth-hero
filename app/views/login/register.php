<!DOCTYPE html>
<html>
<head>
	<title>Register</title>
	<link rel="stylesheet" type="text/css" href="/labyrinth-hero/public/css/stylesheet.css"></link>
</head>
<body>
	<?php
	include '../app/views/header.php';
	?>
	<main>
		<div class="flex-form">
			<div>
				<h1>Create an account</h1>
				<div class="loginBox">
					<form method="post" action="">
						<label>Username:</label><br>
						<input type="text" name="username" placeholder="username" required/><br/>
						<label>Email:</label><br>
						<input type="email" name="email" placeholder="email" required/><br/>
						<label>Password:</label><br>
						<input type="password" name="password" placeholder="password" /><br/>
						<font size="4">Country: <div id="coutryCode">Unknown</div></font>
						<input type="hidden" name="country" id="country" value="00" /> <br/>
						<input type="submit" name="submit" value="Register" /> <br/>
					</form>
					<br/>
					<div class="error"><?php echo $data['error'];?></div>
				</div>
			</div>
		</div>
	</main>	
	<?php
	include '../app/views/footer.php';
	?>	
	<script
	src="https://code.jquery.com/jquery-3.3.1.min.js"
	integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
	crossorigin="anonymous">
</script>
<script>
	$(document).ready(function() {

		var codePays;

		if (navigator.geolocation) 
		{
			navigator.geolocation.getCurrentPosition(showPosition);
		} 
		else 
		{ 
			alert("La géolocalisation n'est pas compatible avec ce navigateur");
		}

		function showPosition(position) 
		{
			$.getJSON("https://freegeoip.net/json/", function(data) 
			{
				codePays = data.country_code;
				$("input[name='country']").val(codePays); 
				document.getElementById("coutryCode").innerHTML = codePays;
			});
		}
	});
</script>
</body>
</html>