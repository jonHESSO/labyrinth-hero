<?php
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'hes');
define('DB_PASSWORD', '12pelouze');
define('DB_DATABASE', 'labyrinth-hero');
$db = mysqli_connect(DB_SERVER,DB_USERNAME,DB_PASSWORD,DB_DATABASE);
if (mysqli_connect_errno())
{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}