<!DOCTYPE html>
<html>
<head>
	<title>Login</title>
	<link rel="stylesheet" type="text/css" href="/labyrinth-hero/public/css/stylesheet.css"></link>
</head>
<body>
	<?php
	include '../app/views/header.php';
	?>
	<main>
<div class="flex-form">
			<div>
		<h1>Please log in</h1>
		<div class="loginBox">
			<form method="post" action="">
				<label>Username:</label><br>
				<input type="text" name="username" placeholder="username" /><br/>
				<label>Password:</label><br>
				<input type="password" name="password" placeholder="password" /><br/>
				<input type="submit" name="submit" value="Login" /> <br/>
			</form>
			<div class="error"><?php echo $data['error'];?></div>
		</div>
		<br/>
		Don't have an account ?<br>
		<a href="/labyrinth-hero/public/login/register">Register now</a>
</div>
</div>
	</main>	
	<?php
	include '../app/views/footer.php';
	?>	
</body>
</html>