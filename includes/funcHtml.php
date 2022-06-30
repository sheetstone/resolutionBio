<?php
function htmlHeader($headerOpts = array("title"=>"")) {
?>
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Resolution Bioscience</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="/css/font-awesome.min.css" rel="stylesheet" type="text/css" media="all">
        <link href="/css/themify-icons.css" rel="stylesheet" type="text/css" media="all" />
        <link href="/css/bootstrap.css" rel="stylesheet" type="text/css" media="all" />
	    <link href="/css/flexslider.css" rel="stylesheet" type="text/css" media="all" />
        <link href="/css/validationEngine.jquery.css" rel="stylesheet" type="text/css">
        <link href="/css/theme.css" rel="stylesheet" type="text/css" media="all" />
        <link href="/css/custom.css" rel="stylesheet" type="text/css" media="all" />
        <link href='https://fonts.googleapis.com/css?family=Lato:300,400%7CRaleway:100,400,300,500,600,700%7COpen+Sans:400,500,600' rel='stylesheet' type='text/css'>
	<!-- <link href="http://fonts.googleapis.com/css?family=Oswald:300,400,600,700" rel="stylesheet" type="text/css"> -->
	<link href="https://fonts.googleapis.com/css?family=Montserrat:100,300,400,600,700" rel="stylesheet" type="text/css">
        <link href="/css/font-montserrat.css" rel="stylesheet" type="text/css">
        <!-- <link href="css/font-oswald.css" rel="stylesheet" type="text/css"> -->
        <!--<link href="/css/font-opensans.css" rel="stylesheet" type="text/css"> -->
    </head>
    <body>
                <div class="nav-container">
                    <nav class="bg-light">
                        <div class="nav-bar">
                            <div class="module left">
                                <a href="/">
                                    <img class="logo logo-light" alt="ResolutionBio" src="/img/ResBio_A-part-of-Agilent_RGB_RB-Web-Header.png">
                                    <img class="logo logo-dark" alt="ResolutionBio" src="/img/ResBio_A-part-of-Agilent_RGB_RB-Web-Header.png">
			            <img class=" logo-light" alt="ResolutionBio" src="/img/resbioswirl.png" style="max-height:54px; padding-bottom:1px;">
				</a>
                            </div>
                            <div class="module widget-handle mobile-toggle right visible-sm visible-xs">
                                <i class="ti-menu"></i>
                            </div>
                            <div class="module-group right">
                                <div class="module left">
                                    <ul class="menu">
                                        <li class="has-dropdown">
						<a href="#">About</a>
						<ul>
							<li><a href="/company/">Company</a></li>
							<li><a href="/company/team.html">Team</a></li>
							<li><a href="/company/press/">News</a></li>
                            <li><a href="/company/openings.html">Current Openings</a></li>
						</ul>

                                        </li>
					<li class="has-dropdown">
                                            <a href="#">Liquid Biopsy Assays</a>
                                            <ul>
                                                <li><a href="/assays/ctDx-Lung.html">Resolution ctDx Lung</a></li>
                                                <li><a href="/assays/custom.html">Custom</a></li>
                                                <li><a href="/assays/alk.html">ALK</a></li>
                                                <li><a href="/immuno/">Immuno-oncology</a></li>
                                            </ul>
                                        </li>
                                        <li class="has-dropdown">
                                            <a href="#">Science</a>
					    <ul>
						<li><a href="/science/">Overview</a></li>
                                                <li><a href="/science/comprehensive.html">Comprehensive</a></li>
						<li><a href="/casestudies/">Patient Case Studies</a></li>
                                                <li><a href="/casestudies/clinicaltrials.html">Clinical Trials</a></li>
						<li><a href="/publications/">Publications &amp; Presentations</a></li>
                                	    </ul>
                                        </li>
                                        <li><a href="/contact/">Contact</a></li>
                                    </ul>
                                </div>

                            </div>

                        </div>
                    </nav>
		</div>
<?php
}

function footer($scripts = '') {
?>
<footer class="footer-2 bg-dark pt32 pt-xs-32">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12 pb24 text-center">
                <img src="/img/resolution_definition_white.png" style="width:35%">
            </div>
        </div>
    </div>
    <div class="container footer">
      <div class="col-md-3 col-sm-4">
        <h4>COMPANY</h4>
        <ul>
	<li><a href="/"><h5 class="uppercase mb16 fade-on-hover">HOME</h5></a></li>
	<li><a href="/company/"><h5 class="uppercase mb16 fade-on-hover">about</h5></a></li>
		<li><a href="/company/team.html"><h5 class="uppercase mb16 fade-on-hover">Team</h5></a></li>
          <li><a href="/company/press/"><h5 class="uppercase mb16 fade-on-hover">Press</h5></a></li>
        </ul>
      </div>
      <div class="col-md-3 col-sm-4">
        <h4>ASSAYS</h4>
        <ul>
		<li><a href="/assays/ctDx-Lung.html"><h5 class="mb16 fade-on-hover">RESOLUTION ctDx LUNG</h5></a></li>
        <li><a href="/assays/custom.html"><h5 class="uppercase mb16 fade-on-hover">Custom assays</h5></a></li>
		<li><a href="/assays/alk.html"><h5 class="uppercase mb16 fade-on-hover">ALK assay</h5></a></li>
        </ul>
      </div>
      <div class="col-md-3 col-sm-4">
        <h4>SCIENCE</h4>
        <ul>
          <li><a href="/technology/"><h5 class="uppercase mb16 fade-on-hover">OVERVIEW</h5></a></li>
	  <li><a href="/science/comprehensive.html"><h5 class="uppercase mb16 fade-on-hover">Comprehensive</h5></a></li>
	  <li><a href="/casestudies/"><h5 class="uppercase mb16 fade-on-hover">Patient case studies</h5></a></li>
	  <li><a href="/casestudies/clinicaltrials.html"><h5 class="uppercase mb16 fade-on-hover">Clinical Trials</h5></a></li>
	  <li><a href="/publications/"><h5 class="uppercase mb16 fade-on-hover">Publications &amp; Presentations</h5></a></li>
        </ul>
      </div>
      <div class="col-md-3 col-sm-4">
        <h4>SUPPORT</h4>
        <ul>
          <li><a href="/contact/"><h5 class="uppercase mb16 fade-on-hover">CONTACT US</h5></a></li>
        </ul>
      </div>
  	</div>
	<div class="row divide">
  		<div class="col-sm-3 pull-right">
      	<a href="https://twitter.com/ResBioscience" target="twitter"><i class="fa fa-twitter social"></i></a>
      	<a href="https://www.linkedin.com/company/resolution-bioscience" target="linkedIn"><i class="fa fa-linkedin social"></i></a>
    	</div>
    </div>

    <div class="row fade-half">
        <div class="col-sm-12 text-center">
            <span>&copy; Copyright 2012-2021 Resolution Bioscience, Inc. All Rights Reserved.<br> <a href="/legal/">Legal and Privacy</a></span>
        </div>
    </div>
</div>
</footer>
</div>
<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script> 
<script src="/js/bootstrap.min.js"></script>
<script src="/js/flexslider.min.js"></script>
<script src="/js/parallax.js"></script>
<script src="/js/scripts.js"></script>
<?php if($scripts != '') { echo $scripts; } ?>
    </body>
</html>
<?php
}

function writeLog ($logfile,$string) {
        $now = date("d/M/Y:G:i:s");
        $logdir = '/var/www/www/rLogs';
        $logfile = fopen("$logdir/$logfile","a+");
        $outstring = $_SERVER['REMOTE_ADDR']. ' - ['.$now.'] - '.$string."\n";
        fwrite($logfile, $outstring);
        fclose($logfile);

}
?>
