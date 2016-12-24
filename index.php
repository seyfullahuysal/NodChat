<?php
	$k_id = $_GET["k_id"];
?>

<html>
	<head>
		<meta charset="UTF-8" />
		<title>NodeJS Mesajlaşma</title>
	
		<script src="http://localhost:3031/socket.io/socket.io.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
		<script type="text/javascript">
			var soket = io.connect("http://localhost:3031"); //bağlanacağımız soket 

			soket.on("connect", function ()
			{  

			});

			soket.on("disconnect", function ()
			{
				$("body").html("Soket bağlantısı koptu, lütfen sayfayı yenileyip tekrar bağlanmayı deneyin!");
			});

			soket.on("yeni_mesaj", function(mesaj_verisi)
			{
				$("#mesaj_listesi").append('<font color="red"><li> Gonderen ID:</font> '+ mesaj_verisi.kimden + '<br><font color="blue">' + mesaj_verisi.mesaj +'</font></li>');

			});

			soket.emit("katil", {k_id: <?php echo $k_id; ?>}); //node.js e json formatında veri gönderdik yani kullanıcı idmizi gönderdik
		</script>

		<style>
			#g_kisi{
				margin-top: 10px;
				margin-bottom: 15px;
			}

			#mesaj{
				width: 900px;
				height: 200px;
				margin-bottom: 20px;
			}

		</style>
	</head>

	<body>
		<form>
			<center><b>Mevcut kullanıcı id'niz: </b> <?php echo $k_id; ?> <br />

			<select id="g_kisi">
				<option value="1">Kullanıcı 1</option>
				<option value="2">Kullanıcı 2</option>
			</select>

			<br />

			<textarea id="mesaj"></textarea>

			<br />
		
			<button id="mgonder" type="button">GÖNDER</button>

			<br />
			<hr></center>

			<ul id="mesaj_listesi"></ul>
		</form>
	</body>

	<script type="text/javascript">
		$("#mgonder").click(function (){
			var kime = $("#g_kisi").val();
			var mesaj = $("#mesaj").val();
			$("#mesaj_listesi").append('<font color="red"><li> BEN:</font> '+ '<br><font color="blue">' +mesaj+'</font></li>');
			soket.emit("mesaj_gonder", {kime:kime, mesaj:mesaj});
			$("#mesaj").val("");
		});
	</script>


</html>
