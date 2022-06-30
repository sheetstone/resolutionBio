<?php
// connects to a mysql db
function db_connect() {
	$mysqli = new mysqli("localhost", "exolabs", "jkil873di", "exo");

	// check connection
	if($mysqli->connect_errno) {
		return false;
	}
/*
	$result = mysql_connect("localhost", "exolabs", "jkil873di") or die ("Couldn't connect to server.");
	if (!$result) return false;
	if (!mysql_select_db("exo", $result)) return false;
	return $result;
*/
	return $mysqli;
}

function do_sql($sql,$mysqli) {
	$result = $mysqli->query($sql);
	return $result;

/*
        $result = mysql_query($sql,$db_conn);
        if (!$result) {
                echo "<font color=red>Error: $sql<br>" . mysql_error() . "</font>";
        }
        return $result;
*/
}

// Quote variable to make safe
function qs($value) {
	global $db_conn;
	// Stripslashes
	if (get_magic_quotes_gpc()) { $value = stripslashes($value); }
	// Quote if not a number or a numeric string
	if (!is_numeric($value)) { $value = "'" . $db_conn->real_escape_string(trim($value)) . "'"; }
	return $value;
}

function processURI($uri) {
         $array = explode("/",$uri);
         $num = count($array);
         $url_array = array();
                
         for ($i = 1 ; $i < $num ; $i++) {
                if($array[$i] == '') { continue; }
                $url_array["arg".$i] = $array[$i];  
         }
        return $url_array;  // return our new shiny array
}

// function to write an entry into a logfile
// all entries are prepended with ip number, date, time, and users's email
// $logfile: the filename of the logfile to write to
// $string: the data to write to the logfile
function writeLog ($logfile,$string) {
	$now = date("d/M/Y:G:i:s");
	$logdir = '/home/httpd/resolution/rLogs';
	$logfile = fopen("$logdir/$logfile","a+");
	$outstring = $_SERVER['REMOTE_ADDR']. ' - ['.$now.'] - '.$string."\n";
	fwrite($logfile, $outstring);
	fclose($logfile);

}
function print_r_html($r) {
	foreach ($r as $key => $val) {
		if (is_array($val)) {
			echo "[$key] = An Array:<BLOCKQUOTE>";
			print_r_html($val);
			echo "</BLOCKQUOTE></P>";
		} else {
			echo "[$key] = '$val'<BR>";
		} #end if stmt
	}
	echo '<p clear=all>';
} # end function print_r_html

function weekdays( $startTime, $endTime ) {
	$weekdays = 0;
	while( $startTime <= $endTime ) {
		if( date('w', $startTime ) != 6 && date( 'w', $startTime) != 0 ) { $weekdays++ ; }
		$startTime += 86400;
	}
	return $weekdays;
}

function sanitizeFilename($filename) {
	$special_chars = array("?", "[", "]", "/", "\\", "=", "<", ">", ":", ";", ",", "'", "\"", "&", "$", "#", "*", "(", ")", "|", "~", "`", "!", "{", "}", chr(0));
	//$special_chars = apply_filters('sanitize_file_name_chars', $special_chars, $filename_raw);
	$filename = str_replace($special_chars, '', $filename);
	$filename = preg_replace('/[\s-]+/', '-', $filename);
	$filename = trim($filename, '.-_');
	return $filename;
}
?>
