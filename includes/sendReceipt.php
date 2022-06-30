<?php
include_once("/home/httpd/exo/includes/inc.php");
include 'Mail.php';
include 'Mail/mime.php' ;

function sendReceipt($id) {
        global $db_conn;
	$db_conn = db_connect();
	$sql = 'select orders.id as id,date_format(orders.insertTime,"%M %e, %Y") as orderDate,date_format(orders.insertTime,"%l:%i %p PST") as orderTime,UNIX_TIMESTAMP(orders.insertTime) as unixtime,shipFirstName,shipLastName,qty,shipEmail,shipPhone,shipCo,shipAddr1,shipAddr2,shipCity,shipState,shipZip,specialInstructions,billCo,billAddr1,billAddr2,billCity,billState,billZip,grandT,taxT,subT,camT,shipT,discountT,ccFee,taxRate,taxLocalRate,zipPlus4,promoCode,orders.ccAuth,card,hasPromo,cart from orders,stripe,cart where orders.id='.qs($id).' AND orders.id=stripe.id AND orders.cartID = cart.id';
	$r = do_sql($sql,$db_conn);
	if($r->num_rows > 0) {
		$o = $r->fetch_assoc();
		$card = unserialize($o['card']);
		// Success Email
$text = '
Dear '.$o['shipFirstName'].' '.$o['shipLastName'].',

Thank you for your order! You will receive an email with tracking information as soon as your order ships, usually within five business days.

If you have any questions, please contact sales@exolabs.com.

-------------------------------------------------
ORDER SUMMARY

Order #: '.$o['unixtime'].'-'.$o['id'].'
Order Placed: '.$o['orderDate'].' '.$o['orderTime'].'

Ship To:
'.$o['shipFirstName'].' '.$o['shipLastName']."\n";
if($o['shipCo'] != '') { $text .= $o['shipCo']."\n"; }
$text .= $o['shipAddr1']."\n";
if($o['shipAddr2'] != '') { $text .= $o['shipAddr2']."\n"; }
$text .= $o['shipCity'].', '.$o['shipState'].' '.str_pad($o['shipZip'],5,"0",STR_PAD_LEFT)."\n\n";
$text .= 'Phone: '.$o['shipPhone']."\nEmail: ".$o['shipEmail']."\n\n";

$text .= 'Payment Information:
'.$card->type.': **** **** **** '.$card->last4."\nExp: ".$card->exp_month.'/'.$card->exp_year."\n";
$text .= 'Amount: $'.number_format($o['grandT'],2).' (USD)

-------------------------------------------------
';
$html = '
	<!-- Copyright (C) EXO Labs, Inc., All Rights Reserved. -->
	<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="description" content="Exo Labs">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="http://exolabs.com/css/bootstrap.min.css?v=2">
	<!--	<link rel="stylesheet" href="http://exolabs.com/css/default.css?v=1.1"> -->
	<!--	<link rel="stylesheet" href="http://exolabs.com/css/fonts/opensans.css"> -->
	<!--	<link rel="stylesheet" href="http://exolabs.com/css/exo.css?v=1"> -->
		<link rel="shortcut icon" href="http://exolabs.com/images/favicon.png">
		<title>Exo Labs: Ignite Curiosity: Thank You</title>
	</head>
	<body>
	
	<div class="container-fluid">
		<div class="row-fluid">
			<div class="span12">
				<div class="headerTitle2">
					<a href="http://exolabs.com"><img src="http://exolabs.com/images/exoLogo75x75.png" width=75 height=75 style="position: absolute; left: 0px; margin-left: 10px;"></a>
					<h1 style="margin-left: 120px;" class="blockTitle"><span class="exoOrange">Thank you!</span></h1><br>
				</div>
			</div>
		</div>
	<div class="row-fluid">
		<div class="span10 offset1">
			Thank you for your order! You will receive an email with tracking information as soon as your order ships, usually within five business days.<p>
			If you have any questions, please contact <a href="mailto: sales@exolabs.com">sales@exolabs.com</a><br>
		</div>
	</div>
	<div class="row-fluid">
        <div class="well2 span10 offset1" style="padding-top: 15px;">
                <div class="span6 no_margin_left">
                        <span class="bold">Order #: '.$o['unixtime'].'-'.$o['id'].'</span><br>
                        <span class="bold">Order Placed: </span>'.$o['orderDate'].' '.$o['orderTime'].'
                        <p></p>
                        <span class="bold">Ship To:</span><br><div style="margin-left: 15px;">
			'.$o['shipFirstName'].' '.$o['shipLastName'].'<br>';

                        if($o['shipCo'] != '') { $html.= $o['shipCo'].'<br>'; };
			$html .= $o['shipAddr1'].'<br>';
			if($o['shipAddr2'] != '') { $html .= $o['shipAddr2'].'<br>'; }
			$html .= $o['shipCity'].', '.$o['shipState'].' '.str_pad($o['shipZip'],5,"0",STR_PAD_LEFT).'<p></p>';
			$html .= 'Phone: '.$o['shipPhone'].'<br>Email: '.$o['shipEmail'];
			if($o['specialInstructions'] != '') { $html .= '<br>Special Instructions: '.$o['specialInstructions'].'<br>'; }
			$html .= '<p></p></div>';

		$html .= '</div><div class="span6 no_margin_left"><span class="bold">Bill To:</span><br><div style="margin-left: 15px;">';
		$html .= $o['shipFirstName'].' '.$o['shipLastName'].'<br>';
		if($o['billCo'] != '') { $html .= $o['billCo'].'<br>';}
		$html .= $o['billAddr1'].'<br>';
		if($o['billAddr2'] != '') { $html .= $o['billAddr2'].'<br>'; }
		$html .= $o['billCity'].', '.$o['billState'].' '.$o['billZip'];
		$html .= '</div><br>';
		$html .= '<span class="bold">Payment Information</span>';
		$html .= '<div style="margin-left: 15px;">';
		$html .= $card->type.': **** **** **** '.$card->last4.'<br>Exp: '.$card->exp_month.'/'.$card->exp_year.'<p>
                </div> 
                </div> 
        </div>
	<div class="row-fluid">
        <div class="well2 span10 offset1">
	<table class="table table-condensed table-striped" id="orderTable" style="width:100%; margin: 10px 0px 20px 0px">
        <thead><tr><th colspan=2>Item</th><th style="text-align:center">Quantity</th><th style="width:140px; text-align:right;">Price</th><th style="width:130px; text-align:right;">Total</th></tr></thead>
        <tbody>';
	$cart = unserialize($o['cart']);
	foreach($cart as $p) {
		$html .= '<tr><td colspan=2><span class="bold">'.$p['name'].'</span></a></td><td style="text-align:center">'.$p['qty'].'</td><td class="tRight">$'.number_format($p['price'],2).'</td><td class="tRight" id="'.$p['sku'].'Total">$'.number_format(($p['qty']*$p['price']),2).'</td></tr>';
        }
	if($o['promoCode'] != ''){
		 $html .= '<tr id="promoRow" class="success"><td colspan=3>Promotional Code: <span class="bold">'.$o['promoCode'].'</span></td><td class="tRight">'.$o['discountF'].'</td><td class="tRight">-$'.number_format($o['discountT'],2).'</td></tr>';
	}
	$html .= '<tr><td colspan=3></td><td class="tRight">Shipping & Handling</td><td class="tRight">$'.number_format($o['shipT'],2).'</td></tr>';
	if(isset($o['taxRate']) == true) {
		$html .= '<tr><td colspan=3></td><td class="tRight">Tax ('.($o['taxRate']*100).'%)</td><td class="tRight">$'.number_format($o['taxT'],2).'</td></tr>';
	} else {
		$html .= '<tr><td colspan=3></td><td class="tRight">Tax</td><td class="tRight">$0.00</td></tr>';
        }
        $html .= '<tr class="bold"><td colspan=3></td><td class="tRight">Total</td><td class="tRight">$'.number_format($o['grandT'],2).'</td></tr></tbody></table>';

	$html .= '<div class="row-fluid"><div class="span10 offset1">Copyright &copy; 2012-2014 Exo Labs, Inc. All Rights reserved. Please read our <a style="color: #FF6633;" href="http://exolabs.com/docs/privacy.html">Privacy Policy</a></div></div>';
	$html .= '</body></html>';

	$crlf = "\n";
	$hdrs = array(
	      'From'    => '"Exo Labs Support" <support@exolabs.com>',
	      'Subject' => 'Your payment has been received'
	);

	$mime = new Mail_mime(array('eol' => $crlf));
	$mime->setTXTBody($text);
	$mime->setHTMLBody($html);
		$mime->addBcc('mark@exolabs.com,jstewart@exolabs.com,sales@exolabs.com,shipping@exolabs.com');
		$body = $mime->get();
		$hdrs = $mime->headers($hdrs);

		$mail =& Mail::factory('mail');
		//$mail->send('mark@mark.li', $hdrs, $body);
		$mail->send($o['shipEmail'], $hdrs, $body);
		echo 'ok';
	} else {
		$subject = 'Customer Receipt Email -- Broken';
		$headers = 'From: "Exo Labs Support" <support@exolabs.com>';
		mail('mark@exolabs.com',$subject,'Stripe Event ID: '.$event_id, $headers);
	}
}

?>
