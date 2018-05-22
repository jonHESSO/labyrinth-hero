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
		$level=0;
		$score;
		$time;
		$coins;
		if(!empty($_POST))
		{
			$level = $_POST['lvl'];
			$score = $_POST['score'];
			$time = $_POST['sec'];
			$coins = $_POST['coins'];

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
				$sql = "Insert into scores (username, $levelname)".
				"values('$username',$score)";
				$sqlresult = mysqli_query($db, $sql);
				if($sqlresult==true)
				{
					echo("score saved");
				}
				else
				{
					echo("error inserting score".mysqli_error($db));
				}

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

		$level->levelname = 1;
		$level->width = 8;
		$level->height = 5;
		$level->pickaxe = true ;
		$level->bomb = true ;

		$myJSON = json_encode($level);

		echo $myJSON;
	}
}