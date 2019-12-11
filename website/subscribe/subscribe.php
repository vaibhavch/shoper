<?php
// Note: filter_var() requires PHP >= 5.2.0
if ( isset($_POST['email']) && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) ) {
      
      $e_mail = $_POST['email'] . "," . "\n";
	  file_put_contents('email-list.txt', $e_mail, FILE_APPEND | LOCK_EX);

}
?>