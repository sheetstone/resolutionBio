<?php
define('FPDF_FONTPATH','/home/httpd/exo/includes/fpdf16/font/');

	// PDF class changes
	class PDF extends FPDF  {
		function Header() {
			$this->Image('/home/httpd/exo/htdocs/images/exoLogoPDF.png',30,30,90,50,'PNG','http://www.exolabs.com');
			$this->Ln(15);
		}
		function AcceptPageBreak() {
			return true;
		}

		function Footer() {
			global $client_page;
			//Position at 1.5 cm from bottom
			$this->SetLineWidth(.3);
			$this->SetDrawColor(0,0,0);
			$this->Line(40,750,560,750);
			$this->SetFont('Arial','',8);
			$this->SetXY(40,-35);
			$this->MultiCell(532,12,"3131 Western Ave. Suite 325, Seattle WA 98121          sales@exolabs.com",0,C,0);
//			if($client_page == 0) {
//				$this->Ln(1);
//				//Page number
//				$this->SetFont('Arial','',7);
//				$this->Cell(0,10,'Page '.$this->PageNo().' of {nb}',0,0,'C');
//			}
		}
		function printTable($header,$q) {
			//Colors, line width and bold font
			$this->SetFillColor(255,255,255);
			$this->SetTextColor(0,0,0);
			$this->SetLineWidth(.3);
			$this->SetFont('Arial','',9);

			$h = array('Quote Valid Until','Sales Contact','Prepared By');
			$w=array(177,177,177);
                        for($i=0;$i<count($h);$i++) {
                                $this->Cell($w[$i],16,$h[$i],0,0,'C',1);
                        }
			$this->Ln();
			// 30 days
			$valid = date("F jS, Y",time()+2592000);
			$h = array($valid,'Website Sales  sales@exolabs.com','Website');
			for($i=0;$i<count($h);$i++) {
                                $this->Cell($w[$i],16,$h[$i],1,0,'C',1);
                        }
			$this->Ln(60);
			//Header
			$w=array(40,100,250,70,70);
			for($i=0;$i<count($header);$i++) {
				$this->Cell($w[$i],16,$header[$i],0,0,'C',1);
			}
			$this->Ln();
			//Color and font restoration
			$this->SetTextColor(0,0,0);
			$this->SetFont('Arial','',8);

			$i=0;
			$cart = unserialize($q['cart']);
			$this->SetDrawColor(0,0,0);
			foreach($cart as $sku=>$p) {
				if($i) { $this->SetFillColor(240,240,240); } else { $this->SetFillColor(255,255,255); }
				$this->Cell($w[0],14,$p['qty'],'1',0,'C',1);
				$this->Cell($w[1],14,$sku,'1',0,'C',1);
				$this->Cell($w[2],14,$p['name'],'1',0,'L',1);
				$this->Cell($w[3],14,'$'.number_format($p['price'],2),'1',0,'R',1);
				$this->Cell($w[4],14,'$'.number_format($p['price']*$p['qty'],2),'1',1,'R',1);
				$i = !$i;
			}
			//$this->Cell(array_sum($w),0,'','T');
			if($q['promoCode'] != '') {
				if($i) { $this->SetFillColor(240,240,240); } else { $this->SetFillColor(255,255,255); }
				$this->Cell(390,14,'','0',0,'C',0);
				$this->Cell($w[3],14,'Promotional Code ('.$q['promoCode'].')','0',0,'R',0);
				$this->Cell($w[4],14,'- $'.number_format($q['discountT'],2),'1',1,'R',1);
				$i = !$i;
			}
			if($i) { $this->SetFillColor(240,240,240); } else { $this->SetFillColor(255,255,255); }
			$this->Cell(390,14,'','0',0,'C',0);
			$this->Cell($w[3],14,'Shipping -- Free Domestic Shipping!','0',0,'R',0);
			$this->Cell($w[4],14,'$'.number_format($q['shipT'],2),'1',1,'R',1);
			$i = !$i;
			if($i) { $this->SetFillColor(240,240,240); } else { $this->SetFillColor(255,255,255); }
			$this->Cell(390,14,'','0',0,'C',0);
                        $this->Cell($w[3],14,'Sales Tax','0',0,'R',0);
                        $this->Cell($w[4],14,'$'.number_format($q['taxT'],2),'1',1,'R',1);
			$i = !$i;
			if($i) { $this->SetFillColor(240,240,240); } else { $this->SetFillColor(255,255,255); }
			$this->Cell(390,14,'','0',0,'C',0);
                        $this->Cell($w[3],14,'Total','0',0,'R',0);
                        $this->Cell($w[4],14,'$'.number_format($q['grandT'],2),'1',1,'R',1);
		}

	}

function generateQuote($quoteID) {
	global $client_page;
	global $db_conn;
	$db_conn = db_connect();
	$client_page = 0;

	$sql = 'select date_format(quotes.insertTime,"%M %e, %Y") as orderDate,date_format(quotes.insertTime,"%l:%i %p PST") as orderTime,UNIX_TIMESTAMP(quotes.insertTime) as unixtime,shipCo,shipFirstName,shipLastName,shipAddr1,shipAddr2,shipCity,shipState,shipZip,shipEmail,shipPhone,cart,promoCode,discountT,shipT,taxT,grandT from quotes,cart where quotes.id='.qs($quoteID).' AND quotes.id=cart.quoteID';
	$r = do_sql($sql,$db_conn);
	$q = $r->fetch_assoc();

	// start a new PDF file
	$pdf=new PDF('P','pt','Letter');
	$pdf->Open();
	$pdf->SetMargins(40,100,40);
	$pdf->SetAutoPageBreak(1,100);
	$pdf->AliasNbPages();
	// set the ouput to be 100% zoom
	$pdf->SetDisplayMode('real','default');
	$pdf->AddPage();
	$y = $pdf->GetY();
	// title
	$pdf->SetFont('Arial','',40);
	$pdf->SetTextColor(192,192,192);
	$pdf->Text(420,65,'Quote');

	$pdf->SetFont('Arial','',10);
	$pdf->SetTextColor(0,0,0);
	$pdf->SetXY(420,85);
	$now = date("F jS, Y");
	$pdf->MultiCell(200,12,"$now\nQuote #: ".$q['unixtime'].'-'.$quoteID."\n\n",0,L,0);

	// Exo Address
	$pdf->SetFont('Arial','',9);
	$pdf->SetXY(70,140);
	$pdf->MultiCell(205,12,"Exo Labs Inc.\n3131 Western Ave\nSuite 325\nSeattle, WA 98121\n(206) 319-9194",0,L,0);

	// Customer Address
	$pdf->Text(294,148,'Customer:');
	$pdf->SetXY(345,140);
	$addr = $q['shipFirstName'].' '.$q['shipLastName']."\n".$q['shipCo']."\n".$q['shipAddr1']."\n";
	if($q['shipAddr2'] != '') { $addr .= $q['shipAddr2']."\n"; }
	$addr .= $q['shipCity'].', '.$q['shipState'].' '.str_pad($q['shipZip'],5,"0",STR_PAD_LEFT)."\n".$q['shipPhone'];

	$pdf->MultiCell(200,12,$addr,0,L,0);

	// Draw the Order Details box
	$pdf->SetY(230);
	$pdf->SetDrawColor(0,0,0);

	$header = array('Qty','Item #','Description','Unit Price','Line Total');
	$pdf->printTable($header,$q);

	$pdf->SetFont('Arial','',9);
	$pdf->Ln(28);
	$pdf->Write(12,"If you would like to inquire about educational discounts or volume pricing, please fill out our ");
	$pdf->SetFont('Arial','U',9);
	$pdf->Write(12,"inquiry form","http://exolabs.com/buy/inquire.html");
	$pdf->SetFont('Arial','',9);
	$pdf->Write(12," or email ","");
	$pdf->SetFont('Arial','U',9);
	$pdf->Write(12,"sales@exolabs.com.","mailto:sales@exolabs.com");
	$pdf->SetFont('Arial','',9);
	$pdf->Ln();
	$pdf->Ln();
	$pdf->MultiCell(500,11,"Sales Tax will be added to all orders shipped within Washington State.\n\nPurchase Orders can be emailed to sales@exolabs.com or faxed to (206) 681-9891.");
	$pdf->Ln(38);
	$pdf->SetFont('Arial','',12);
	$pdf->MultiCell(500,11,"Thank you for your business!",'0','C');


	// T&Cs
	$pdf->SetFont('Arial','B',9);
	$pdf->AddPAge('P','Letter');
	$pdf->Ln();
	$pdf->SetFillColor(0,0,0);
	$pdf->SetTextColor(255,255,255);
	$pdf->Cell(500,13,"GENERAL NOTES",1,2,"C",true);
	$pdf->SetFont('Arial','',8);
	$pdf->SetFillColor(255,255,255);
	$pdf->SetTextColor(0,0,0);
	$pdf->MultiCell(500,11,"1. Please refer to product data sheet for additional details.\n2. iPads and microscopes are not included in this quote and shall be supplied by the customer.\n3. Exo Labs terms and conditions apply.\n4. Applicable sales tax will be added.\n5. All costs are FOB Seattle, WA.\n6. Applicable shipping charges will be added. Charges will depend upon selected method of shipment.\n7. Delivery to be confirmed at time of order.",1);
	$pdf->Ln(30);
	$pdf->SetFont('Arial','B',9);
	$pdf->SetFillColor(0,0,0);
	$pdf->SetTextColor(255,255,255);
	$pdf->Cell(500,13,"EXO LABS STANDARD TERMS AND CONDITIONS",1,2,"C",true);
	$pdf->SetFont('Arial','',8);
	$pdf->SetFillColor(255,255,255);
	$pdf->SetTextColor(0,0,0);
	$pdf->MultiCell(500,11,"These terms and conditions (\"Agreement\") apply to your purchase of products or services (\"Items\") from Exo Labs. This Agreement may not be altered, supplemented, or amended unless otherwise agreed in a written agreement signed by you and Exo Labs. By placing an order based on this Quotation, you accept and are bound to the terms and conditions of this Agreement.\n
1.	Purchase Orders. A hard copy purchase order referencing this quotation is required prior to order processing. You are responsible to ensure that all information provided in a quotation request or order is accurate and complete. Your order is subject to acceptance by Exo Labs in its sole discretion. Your order is subject to cancellation by Exo Labs, at Exo Labs’ sole discretion. You are responsible for any additional charges resulting from any change to an order, which is accepted by Exo Labs. You may terminate work described in this quote at any time by providing three days written notice. However you will pay Exo Labs for all charges, fees and expenses, as reasonably determined by Exo Labs, for restocking or other work performed up to the date of termination.\n
2.	Payment Terms; Interest. Unless documented otherwise, payment terms are net 30 days from date of invoice for customers in good standing with good credit. All orders over $10,000 require a 50% down payment. Payments may be made by credit card or purchase order. Exo Labs accepts Visa, MasterCard and American Express. International Orders are credit card only. Exo Labs may invoice part of an order separately. If any payment due hereunder is not made within the date stated on the invoice, late charges, computed at the lesser of one and one-half percent (1.5%) per month or the highest amount permitted by law, shall be due and payable.\n
3.	Shipping Charges; Title; Risk of Loss; Acceptance. Exo Labs will pre-pay and add delivery costs to your invoice as a courtesy. Shipments are sent FedEx Priority Overnight. We welcome the use of your shipping account with FedEx or UPS. Delivery terms for all shipments of Parts are 'Ex Works'; therefore delivery failures are not Exo Labs' responsibility. Quoted lead times reflect best estimation based on loading and capacity at time of quotation. Exo Labs reserves the right to inform you of lead- time changes. You must notify Exo Labs within five days of the date of shipment, in writing, if you believe any part of your order is missing, wrong or damaged. Unless you have so notified Exo Labs, specifying the nature of what is missing, wrong, or damaged within five days of shipment, the Items will be deemed accepted, non-returnable and non-refundable.\n
4.	Taxes. Unless you provide Exo Labs with a valid and correct tax exemption certificate applicable to your purchase of Items and the Items' ship-to location, Items sold by Exo Labs are subject to collection of sales tax by Exo Labs. You are responsible for any other sales, use or other taxes associated with the Order.\n
5.	Force Majeure. Neither party shall be responsible for any delay or failure in delivery or performance of any of its duties hereunder due to acts of God, acts or omissions or any other occurrence commonly known as force majeure, including war, riots, acts of terrorism, embargoes, strikes, or other concerted acts of workers, casualties or accidents, or any other causes or circumstances that prevent or hinder the manufacture or delivery of the Items. Such party may cancel or delay performance hereunder for so long as such performance is delayed by such occurrence and in such event the party shall have no liability to the other party.",1);


	// output PDF
//	$pdf->Footer2();
	$filename = $q['unixtime'].'-'.$quoteID.'.pdf';
	//put the files into a subdir by yyyy-mm

	$root = '/home/httpd/exo';
	if(!file_exists($root.'/htdocs/quotes/'.$row['pdf_dir'])) {
		mkdir($root.'/htdocs/quotes/'.$row['pdf_dir'],0777);
	}
	$pdf->Output($root.'/htdocs/quotes/'.$row['pdf_dir'].'/'.$filename);
	//Header('Location: /pdfs/'.$row['pdf_dir'].'/'.$filename);
	return $filename;
}
?>
