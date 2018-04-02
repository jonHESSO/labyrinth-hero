<?php

class Login extends Controller
{
	public function index()
	{
		$this->view('login/index') ;
	}

	public function register()
	{
		$this->view('login/register') ;
	}
}