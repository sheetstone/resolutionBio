<?php
if($_SESSION['admin'] != 1) {
	header('Location: /');
}
checkSSL();
?>
