<?php

class Play extends Controller
{
	public function index()
	{
		$this->view('play/index');
	}

	public function level($level = 0)
	{
		$this->view('play/level', ['level' => $level]) ;
	}
}