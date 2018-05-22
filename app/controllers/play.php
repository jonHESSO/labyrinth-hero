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

	public function level()
	{
		if ((isset($_SESSION['username']) != '')) 
		{
			if(isset($_POST['level']))
			{
				$this->view('play/level', ['level' => $_POST['level']]) ;
			}

		}
		else
		{
			header('location: /labyrinth-hero/public/login') ;
			return;
		}
		if(isset($_POST['level']))
		{

		}

	}
}