<?php
// utilities for Parse REST API
// https://parse.com/docs/rest
// REST KEY: T6LKZTLJNiDIHNIUohq0pMpdzTTHclbJNUwh3QMh

function createObject($class,$data) {
	$headers = array("X-Parse-Application-Id: nVrcuqATJmad6VRFW6wv4s29OvOgnxSmght613IZ",
		"X-Parse-REST-API-Key: U6CfhKgMV3wK7UewA1EzDAW2pp5nCozjG7S3QVQ2",
		"Content-Type: application/json");

//	$d = array("serialNumber"=>"30PC1301234","email"=>"mark@mark.li","clientName"=>"Mark Li");

	$ch = curl_init('https://api.parse.com/1/classes/ProductRegistration');
	curl_setopt($ch,CURLOPT_POST,1);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
	curl_setopt($ch,CURLOPT_HTTPHEADER,$headers);
	curl_setopt($ch,CURLOPT_POSTFIELDS, json_encode($data));
	$xml = curl_exec($ch); // bounce to the bit bucket -- no need to redirect
	return $xml;
}

function fetchFAQs() {
	$headers = array(
		"X-Parse-Application-Id: D2dM1Zrw2wMqexSwHTr1xTzXDZkR3UYHqa59rqp3",
		"X-Parse-REST-API-Key: T6LKZTLJNiDIHNIUohq0pMpdzTTHclbJNUwh3QMh",
		"Content-Type: application/json"
	);

	$query = urlencode('where={"isVisibleOnSite":true}');

	$ch = curl_init('https://api.parse.com/1/classes/FAQ?'.$query);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch,CURLOPT_HTTPHEADER,$headers);
	$json = curl_exec($ch);
	return $json;
}

?>
