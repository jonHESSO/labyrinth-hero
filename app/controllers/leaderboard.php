<?php

class Leaderboard extends Controller
{
	public function index()
	{
		global $db ;

		$scoreList = array() ;

		$query = "Select * from scores" ;

		$result = mysqli_query($db,$query) ;

		while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
		{
			$score = $this->model('Score') ;
			$score->totalscore = 0 ;
			foreach ($row as $key => $value) 
			{
				
				if($key == 'username')
				{
					$score->username = $value ;
				}
				elseif (!is_null($value))
				{
					$score->totalscore += $value ;
				}
			}
			array_push($scoreList, $score) ;
		}

		usort($scoreList, function($a, $b)
		{
			return  $b->totalscore - $a->totalscore;
		});

		$this->view('leaderboard/index',['scoreList' => $scoreList]) ;
	}
}