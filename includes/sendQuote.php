<?php
include_once("../../includes/inc.php");
// Set the live or test secret key
include 'Mail.php';
include 'Mail/mime.php' ;

function sendQuote($pdf,$o) {
	global $db_conn;

$text = '
Dear '.$o['shipFirstName'].' '.$o['shipLastName'].',

Please find your quote attached. Your quote number is '.$o['unixtime'].'-'.$o['id'].'
If you have any questions, please contact sales@exolabs.com.
';
$html = '
	<!-- Copyright (C) EXO Labs, Inc., All Rights Reserved. -->
	<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="description" content="Exo Labs">
		<link rel="stylesheet" href="http://exolabs.com/css/bootstrap.min.css?v=2">
		<link rel="stylesheet" href="http://exolabs.com/css/default.css?v=1.1">
		<link rel="stylesheet" href="http://exolabs.com/css/fonts/opensans.css">
		<link rel="stylesheet" href="http://exolabs.com/css/exo.css?v=1">
		<link rel="shortcut icon" href="http://exolabs.com/images/favicon.png">
		<title>Exo Labs: Ignite Curiosity: Thank You</title>
	</head>
	<body>
	
	<div class="block allClear overflowHidden" style="min-height: 100px;">
                <div class="headerTitle2">
			<a href="http://exolabs.com"><img src="http://exolabs.com/images/exoLogo75x75.png" width=75 height=75 style="position: absolute; left: 0px; margin-left: 10px;"></a>
                        <h1 style="margin-left: 120px;" class="blockTitle"><span class="exoOrange">Thank you!</span></h1><br>
                </div>
        </div>
<div class="exoWidth allClear" style="width: 890px; margin: 0 auto;">
	Please find your quote attached.<p>Your quote number is '.$o['unixtime'].'-'.$o['id'].'<p>
	If you have any questions, please contact <a href="mailto: sales@exolabs.com">sales@exolabs.com</a><p></p>
</div>';
$html .= '<div class="exoWidth allClear" style="width: 890px; margin: 0 auto; margin-bottom: 50px;">Copyright &copy; 2012-2014 Exo Labs, Inc. All Rights reserved. Please read our <a style="color: #FF6633;" href="http://exolabs.com/docs/privacy.html">Privacy Policy</a></div>';
$html .= '</body></html>';


$crlf = "\n";
$hdrs = array(
	'From'    => '"Exo Labs Sales" <sales@exolabs.com>',
	'Subject' => 'Your Exo Labs Quote #: '.$o['unixtime'].'-'.$o['id']
);

$mime = new Mail_mime(array('eol' => $crlf));
$mime->setTXTBody($text);
$mime->setHTMLBody($html);
if(preg_match('/exolabs.com/',$_SERVER['SERVER_NAME'])) {
	$mime->addBcc('mark@exolabs.com,jstewart@exolabs.com,sales@exolabs.com');
}
$mime->addAttachment('/home/httpd/exo/htdocs/quotes/'.$pdf,'application/pdf');

$body = $mime->get();
$hdrs = $mime->headers($hdrs);

$mail =& Mail::factory('mail');
$mail->send($o['shipEmail'], $hdrs, $body);
}
?>
