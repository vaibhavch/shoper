<?php
$response = $_POST['ResponseCode'];
$refno = $_POST['MerchantRefNo'];
$amount = $_POST['Amount'];
$hash = $_POST['SecureHash'];
$transactionid = $_POST['TransactionID'];
 ?>
<script>

function response() {
 return [<?php echo $response; ?>','<?php echo $transactionid; ?>','<?php echo $refno; ?>','<?php echo $hash; ?>','<?php echo $amount; ?>]

}
localStorage.setItem( "responsecode", <?php echo $response; ?> );
localStorage.setItem( "transactionid", <?php echo $transactionid; ?> );
localStorage.setItem( "refno", <?php echo $refno; ?> );
localStorage.setItem( "hash", <?php echo $hash; ?> );
localStorage.setItem( "amount", <?php echo $amount; ?> );
</script>

<div class="successmessage">
<h1>
  <p  style="text-align:center">Bill Payment</p></h1>

<p style="text-align:center">Your Bill Payment Have been<br>
done successfully</p>

</div>




<input type="submit" class="buttonfull btn btn-default btn-primary " value="OK">




<style>
.buttonfull{
  position:absolute;
   margin-top:25px;
  display: block;
  width: 100%;
  bottom:50px;
  min-height: 28px;
  .box-sizing(border-box);
}
.successmessage{
  margin-top:100px;
  text-align:center;
  align:center;

}
</style>
