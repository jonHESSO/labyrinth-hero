<?php

class Api extends Controller
{
	public function index()
	{
		//$this->view('api/index') ;
		echo("api index");
	}

	public function savescore()
	{
		echo("test");
		$level=0;
		$score;
		$time;
		$coins;
		if(!empty($_POST))
		{
			$level = $_POST['lvl'];
			$time = $_POST['sec'];
			$coins = $_POST['coins'];

			$score = 100 - $time ;

			echo($score);

		}
		if($level == 0)
		{
			echo("no level specified");
			return;
		}
		
		if ((isset($_SESSION['username']) != '')) 
		{
			$username = $_SESSION['username'] ;

			global $db ;
			$bestScore ;
			$levelname ;

			if($level >= 10)
			{
				$levelname = 'level'.$level;
			}
			else
			{
				$levelname = 'level0'.$level;
			}

			$query = "Select * from scores where username = '$username'";



			$result = mysqli_query($db,$query) ;


			$row=mysqli_fetch_array($result,MYSQLI_ASSOC);



			if(mysqli_num_rows($result) == 1)
			{
				$bestScore = $row[$levelname];
				echo($levelname.' : best score : '.$bestScore.' current score : '.$score);
				if($score>$bestScore)
				{
					$sql = "Update scores set $levelname = $score where username = '$username'" ;
					$sqlresult = mysqli_query($db, $sql);
					if($sqlresult==true)
					{
						echo("score saved");
					}
					else
					{
						echo("error updating score : ".mysqli_error($db));
					}
				}
				else
				{
					echo('current score is lower than your best score on this level');
				}	
			}
			else
			{
				$sql1 = "Insert into scores (username, $levelname)".
				"values('$username',$score)";
				$sql2 = "Update users set highestlevel = highestlevel+1 where username = '$username'";
				$sqlresult1 = mysqli_query($db, $sql1);
				$sqlresult2 = mysqli_query($db, $sql2);
				if($sqlresult1==true&&$sqlresult2==true)
				{
					$_SESSION['highestlevel']=$level;
					echo("score saved");
				}
				else
				{
					echo("error inserting score".mysqli_error($db));
				}

			}

			$hlquery = "Select highestlevel from users where username = '$username'";
			$hlresult = mysqli_query($db, $hlquery);

			if(mysqli_num_rows($hlresult) == 1)
			{
				$highestlevel = 
			}
		}
		else
		{
			echo("user not logged in") ;
		}
		
	}

	public function getlevel($levelname = 1)
	{
		$level = $this->model('Level') ;
		global $db ;

		$query = "Select * from levels where level = '$levelname'";

		$result = mysqli_query($db,$query) ;


		$row=mysqli_fetch_array($result,MYSQLI_ASSOC);



		if(mysqli_num_rows($result) == 1)
		{
			$level->levelname = $row['level'];
			$level->width = $row['width'];
			$level->height = $row['height'];
			$level->pickaxe = $row['pickaxe'];
			$level->bomb = $row['bomb'] ;
		}
		else
		{
			$level->levelname = 0;
			$level->width = 0;
			$level->height = 0;
			$level->pickaxe = 0;
			$level->bomb = 0;
		}

		$myJSON = json_encode($level);
		echo $myJSON;	

		
	}
}