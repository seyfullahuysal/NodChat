var port = 3031; 
var ping_hizi = 1000; //node.js ile tarayıcı arasındaki bağlantı hızı ne kadar olsun 
var ping_gecikme = 10000; //kullanıcı ile sunucu arasındaki bağantı kesilirse kullanıcı geri dönüş için kaç saniye beklesin ms cinsinden

var app = require('express')(); // node.js çalıtırmak için temel kütüphane dahil ediyoruz.
var uzak_http = require('http'); // http kütüphanesi çağırdık port açmak için kullanacağımız kütüphane
var http = require('http').Server(app);

var bagli_kisi_sayisi = 0;

var io = require('socket.io').listen(http, {"pingTimeout":ping_gecikme, "pingInterval":ping_hizi});
require('events').EventEmitter.prototype._maxListeners = 0;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// MySQL
var mysql = require('mysql');
var db_ayar = 
{
	host: "localhost",
	user: "root",
	password: "3141",
	database: "nodejs"
};

var db = mysql.createConnection(db_ayar);// db_ayar kullanarak mysql bağlantısı oluştur
db.connect(function (err)
{
	if(err){ //işlem yapılamazsa err dündürür eğer err dönerse aşağıdaki işlemleri yap
		console.log("MySQL bağlantisi saglanamadi! - Hata: ", err);
	}else{
		console.log("MySQL baglantisi basariyla saglandi!");
	}
});



io.on("connection", function(socket)
{ // yeni bir kişi bağlandığı zaman yapılacaklar
	// Kullanıcının login olma fonksiyonu
	socket.on("katil", function(soket_veri)
	{
		var k_id = soket_veri.k_id;
		var soket_id = socket.id;
		socket.kullanici_id = k_id;

		if(typeof(k_id) != "undefined" && k_id != 0)
		{
			db.query("INSERT INTO user (user_id, socket_id) VALUES ('"+ k_id +"', '"+ soket_id +"')", 				function(err, data, fields)
			{
				if(err)
				{
					console.log("Bir MySQL hatasi olustu! - Hata: ", err);
				}
		

				else
				{
					bagli_kisi_sayisi++;
					console.log("Bagli kisi sayisi: ", bagli_kisi_sayisi);

					console.log(k_id + " id'li kullanici baglandi! - Soket ID: " + soket_id);
				}
			});
		}
	});

	// Mesaj alma fonksiyonu
	socket.on("mesaj_gonder", function(mesaj_veri)
	{
		var gkisi = mesaj_veri.kime;
		var mesaj = mesaj_veri.mesaj;

		if(gkisi != socket.kullanici_id)
		{
			db.query("SELECT socket_id FROM user WHERE user_id = '"+ gkisi +"' ORDER BY id DESC LIMIT 1", 				function (err, data, fields)
			{
				if(!err)
				{
					if(data.length > 0)
					{
						var gonderilecek_soket = data[0].socket_id;
						io.sockets.connected[gonderilecek_soket].emit("yeni_mesaj", {kimden: 							socket.kullanici_id, mesaj: mesaj});
					}
				}
			});
		}		
	});

	// Kullanıcı ayrıldığında
	socket.on("disconnect", function ()
	{
		if(typeof(socket.kullanici_id) != "undefined")
		{
			if(bagli_kisi_sayisi > 0)
			{
				bagli_kisi_sayisi--;
				console.log("Bagli kisi sayisi: ", bagli_kisi_sayisi);
			}

			db.query("DELETE FROM user WHERE user_id = '"+ socket.kullanici_id +"'", function (err, p1, p2)
			{
				if(!err)
				{
					console.log(socket.kullanici_id + " id'li kullanici ayrildi!");
				}
			});
		}
	});
});


http.listen(port, function ()
{ ///http dinlemek için
	console.log(port + " portu acildi ve kullanima hazir!"); 
});






