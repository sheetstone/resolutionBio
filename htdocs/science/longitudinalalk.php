<?php
include_once('../../includes/inc.php');
htmlHeader(array("title"=>"","metaDesc"=>"Dedicated to improve cancer outcomes via liquid biopsies.","preLoader"=>"0"));
?>
<div class="container-fluid">
	<div class="row">
		<div class="col-md-10 col-md-offset-1" id="lgtdGraph"></div>
	</div>
</div>
<?php
footer('
<script src="https://d3js.org/d3.v4.min.js" type="text/javascript"></script>
<script src="/js/alk.js"></script>
');

?>
