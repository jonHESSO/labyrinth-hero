<?php

class Login extends Controller
{
	public function index($error = '')
	{
		global $db ;
		//redirects to play page if user is logged in
		if ((isset($_SESSION['username']) != '')) 
		{
			header('Location: /labyrinth-hero/public/play');
		}

		//if data has been posted to the login form	
		if(!empty($_POST))
		{
			if(!empty($_POST['username']) && !empty($_POST['password']))
			{
				// Define $username and $password
				$username=$_POST['username'];
				$password=$_POST['password'];

				// To protect from MySQL injection
				$username = stripslashes($username);
				$password = stripslashes($password);
				$username = mysqli_real_escape_string($db, $username);
				$password = mysqli_real_escape_string($db, $password); 

				$query = "Select * from users ".
				"where username = '$username' and password = '$password'";

				$result = mysqli_query($db,$query);

				$row=mysqli_fetch_array($result,MYSQLI_ASSOC);

				//If username and password exist in our database then create a session.
				//Otherwise echo error.

				if(mysqli_num_rows($result) == 1)
				{
					$login_user = $row['username'];
					$highestlevel = $row['highestlevel'];
					$_SESSION['username'] = $login_user; // Initializing Session
					$_SESSION['highestlevel'] = $highestlevel;
					header('Location: /labyrinth-hero/public/play');
				}
				else
				{
					$error = "Incorrect username or password.";
				}
			}			
			else
			{
				$error = "Both fields are required.";
			}
		}			

		//if the user didn't log in, return the login view
		$this->view('login/index', ['error' => $error]) ;
	}


	public function register($error = '')
	{
		global $db ;
		//redirects to play page if user is logged in
		if ((isset($_SESSION['username']) != '')) 
		{
			header('Location: /labyrinth-hero/public/play');
		}

		//if data has been posted in the registration form
		if(!empty($_POST))
		{
			if(!empty($_POST["username"]) && !empty($_POST["password"]))
			{
				// Define $username and $password
				$username=$_POST['username'];
				$password=$_POST['password'];
				$country =$_POST['country'];

				// To protect from MySQL injection
				$username = stripslashes($username);
				$password = stripslashes($password);
				$username = mysqli_real_escape_string($db, $username);
				$password = mysqli_real_escape_string($db, $password); 
				$country = mysqli_real_escape_string($db, $country);

				$highestlevel = 0;

				$query = "Insert into users (username, password, country, highestlevel)".
				"values('$username','$password','$country', '$highestlevel')";

				$result = mysqli_query($db, $query);

				if($result==true)
				{
					$_SESSION['username'] = $username ;
					header('Location: /labyrinth-hero/public/play');
				}
				else
				{
					$error = "Username already used" ;
				}
			}
			else
			{
				$error = "Both fields are required";
			}
		}

		$this->view('login/register', ['error'=> $error]) ;
	}

	public function logout()
	{
		session_destroy();
		header('Location: /labyrinth-hero/public') ;
	}
}