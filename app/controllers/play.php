<?php

class Play extends Controller
{
	public function index()
	{

		if ((isset($_SESSION['username']) != '')) 
		{
			$this->view('play/index');
		}
		else
		{
			header('location: /labyrinth-hero/public/login') ;
		}

	}

	public function level($level = 0)
	{
		if ((isset($_SESSION['username']) != '')) 
		{
			$this->view('play/level', ['level' => $level]) ;
		}
		else
		{
			header('location: /labyrinth-hero/public/login') ;
		}
	}
}