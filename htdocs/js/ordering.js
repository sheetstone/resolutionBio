$(document).ready(function() {
	$("#orderForm").validationEngine('attach',{
                scroll: false,
                autoPositionUpdate: true
        });

	$("#orderFormButton").click(function(e) {
                e.preventDefault();
                if($("#orderForm").validationEngine('validate')) {
                    $.post("/ordering/thankyou.html", $("#orderForm").serialize(), function(data) {
                        if(data == 1) { $("#response").html('<h3 style="text-transform:none;">Thank you for your order</h3><br><a class="btn btn-lg" href="/">Back to Home</a>'); }
                    });
                }
        return false;
        });
});
