<?php

class Play extends Controller
{
	public function index()
	{

		if ((isset($_SESSION['username']) != '')) 
		{
			$highestlevel = $_SESSION['highestlevel'];
			$this->view('play/index', ['highestlevel'=>$highestlevel]);
		}
		else
		{
			header('location: /labyrinth-hero/public/login') ;
		}

	}

	public function level($level = 1)
	{
		if ((isset($_SESSION['username']) != '')) 
		{
			/*if(isset($_POST['level']))
			{
				$this->view('play/level', ['level' => $_POST['level']]) ;
			}*/
			if(($_SESSION['highestlevel']+1)<$level||$level<1||$level>20)
			{
				header('location: /labyrinth-hero/public/play') ;
				return;
			}
			$this->view('play/level', ['level' => $level]) ;

		}
		else
		{
			header('location: /labyrinth-hero/public/login') ;
			return;
		}

	}
}