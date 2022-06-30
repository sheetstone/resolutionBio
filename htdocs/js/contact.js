$(document).ready(function() {
	$("#regards").focus();
	$("#contactForm").validationEngine('attach',{
                scroll: false,
                autoPositionUpdate: true
        });

	$("#contactFormButton").click(function(e) {
                e.preventDefault();
                if($("#contactForm").validationEngine('validate')) {
                        $.post("/contact/thankyou.html", $("#contactForm").serialize(), function(data) {
                                if(data == 1) {
                                        $("#response").html('<h3 style="text-transform:none;">Thank you for the inquiry!</h3>');
                                }
                        }
                        );
                } else {
                        $("#formErrors").html('<div class="alert alert-warning"><span class="bold"><i class="fa fa-exclamation-triangle"></i> Error: </span>There is missing or incorrect information above. Please confirm your entries.</div>');
                }
        return false;
        });
});
