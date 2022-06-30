<?php
// Dozuki Functions

function fetchGuides(){ 
	$json = file_get_contents('https://exolabs.dozuki.com/api/2.0/guides');
	//echo $json;
	$guides = json_decode($json,TRUE);
//	print_r_html($guides);
//	var_dump($guides);
	foreach($guides as $g) {
		print_r_html($g);
	}
}

function readGuides($refresh = FALSE) {
	$guidesFile = '/home/httpd/exo/labs/guides.json';
	if(file_exists($guidesFile) && $refresh == FALSE) {
		// Labs is downloaded so return that file
		return json_decode(file_get_contents($guidesFile),TRUE);
	} else {
		$json = file_get_contents('https://exolabs.dozuki.com/api/2.0/guides');
		$guide = json_decode($json,TRUE);
		file_put_contents($guidesFile,$json);
		return $guide;
	}
}


function fetchGuide($guideID) {
	$guideFile = '/home/httpd/exo/labs/'.guide.$guideID;
	$json = file_get_contents('https://exolabs.dozuki.com/api/2.0/guides/'.$guideID);
	$guide = json_decode($json,TRUE);
	$fp = fopen($guideFile,'w');
	fwrite($fp,$json);
	fclose($fp);
	
	//file_put_contents($guideFile,$json);
	return $guide;
}

function readGuide($guideID) {
	$guideFile = '/home/httpd/exo/labs/'.guide.$guideID;
	if(file_exists($guideFile)) {
		// Labs is downloaded so return that file
		return json_decode(file_get_contents($guideFile),TRUE);
	} else {
		$json = file_get_contents('https://exolabs.dozuki.com/api/2.0/guides/'.$guideID);
		$guide = json_decode($json,TRUE);
		file_put_contents($guideFile,$json);
		return $guide;
	}
}

function fetchCategories($requireGuides = FALSE) {
	if($requireGuides) {
		$json = file_get_contents('https://exolabs.dozuki.com/api/2.0/categories?requireGuides=TRUE');
	} else {
		$json = file_get_contents('https://exolabs.dozuki.com/api/2.0/categories');
	}
	$categories = json_decode($json,TRUE);
	return $categories;
}

function fetchCategory($category) {
	$json = file_get_contents('https://exolabs.dozuki.com/api/2.0/categories/'.urlencode($category));
	$category = json_decode($json,TRUE);
	return $category;
}

function readCategories() {
	$json = file_get_contents('/home/httpd/exo/labs/categories.json');
	return json_decode($json,TRUE);
}
?>
