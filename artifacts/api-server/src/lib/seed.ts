import pool from "./db";

const wisataData = [
  { name: "Gunung Papandayan", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Cisurupan, Garut", description: "Gunung api aktif dengan pemandangan kawah yang indah, padang edelweis, dan hutan mati yang eksotis.", partner: false, active: true, opening_hours: "06.00 - 17.00", facilities: "Parkir,Toilet,Warung Makan,Jalur Hiking,Area Camping", google_maps_url: "https://www.google.com/maps/search/Gunung+Papandayan+Cisurupan,+Garut+Garut" },
  { name: "Kawah Darajat", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Pasirwangi, Garut", description: "Kawasan wisata pemandian air panas alami dengan pemandangan perbukitan yang hijau dan udara sejuk.", partner: false, active: true, opening_hours: "08.00 - 17.00", facilities: "Parkir,Toilet,Warung Makan,Jalur Hiking,Area Camping", google_maps_url: "https://www.google.com/maps/search/Kawah+Darajat+Pasirwangi,+Garut+Garut" },
  { name: "Situ Bagendit", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Banyuresmi, Garut", description: "Danau indah dengan latar belakang pegunungan, cocok untuk rekreasi keluarga menggunakan perahu atau rakit.", partner: false, active: true, opening_hours: "07.00 - 17.00", facilities: "Parkir,Toilet,Warung Makan,Jalur Hiking,Area Camping", google_maps_url: "https://www.google.com/maps/search/Situ+Bagendit+Banyuresmi,+Garut+Garut" },
  { name: "Candi Cangkuang", category: "Sejarah", rating: 0, entry_fee: 0, image: "", location: "Leles, Garut", description: "Candi Hindu peninggalan abad ke-8 peninggalan Kerajaan Galuh yang terletak di sebuah pulau kecil di tengah danau.", partner: false, active: true, opening_hours: "08.00 - 17.00", facilities: "Parkir,Toilet,Pemandu Wisata,Area Foto", google_maps_url: "https://www.google.com/maps/search/Candi+Cangkuang+Leles,+Garut+Garut" },
  { name: "Kampung Naga", category: "Budaya", rating: 0, entry_fee: 0, image: "", location: "Neglasari, Salawu", description: "Perkampungan adat Sunda yang masih memegang teguh tradisi leluhur, tanpa aliran listrik dan bangunan modern.", partner: false, active: true, opening_hours: "08.00 - 16.00", facilities: "Parkir,Toilet,Pemandu Wisata,Pertunjukan Seni,Oleh-oleh", google_maps_url: "https://www.google.com/maps/search/Kampung+Naga+Neglasari,+Salawu+Garut" },
  { name: "Taman Satwa Cikembulan", category: "Buatan", rating: 0, entry_fee: 0, image: "", location: "Kadungora, Garut", description: "Taman konservasi satwa yang menampilkan berbagai jenis hewan langka dan dilindungi, cocok untuk edukasi anak.", partner: false, active: true, opening_hours: "08.00 - 17.00", facilities: "Parkir,Toilet,Warung Makan,Wahana,Toko Souvenir", google_maps_url: "https://www.google.com/maps/search/Taman+Satwa+Cikembulan+Kadungora,+Garut+Garut" },
  { name: "Pantai Rancabuaya", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Caringin, Garut", description: "Pantai selatan Garut dengan tebing karang dan ombak besar, menjadi daya tarik bagi para pecinta alam dan fotografer.", partner: false, active: true, opening_hours: "07.00 - 18.00", facilities: "Parkir,Toilet,Warung Makan,Jalur Hiking,Area Camping", google_maps_url: "https://www.google.com/maps/search/Pantai+Rancabuaya+Caringin,+Garut+Garut" },
  { name: "Curug Orok", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Cibalong, Garut", description: "Air terjun tersembunyi di tengah hutan tropis dengan aliran air segar yang menyejukkan.", partner: false, active: true, opening_hours: "08.00 - 16.00", facilities: "Parkir,Toilet,Warung Makan,Jalur Hiking,Area Camping", google_maps_url: "https://www.google.com/maps/search/Curug+Orok+Cibalong,+Garut+Garut" },
  { name: "Pantai Santolo", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Pameungpeuk, Garut", description: "Pantai selatan Garut dengan pasir putih bersih, ombak bergulung, dan panorama laut Hindia yang memukau. Terdapat perkampungan nelayan tradisional dan jembatan gantung yang ikonik.", partner: false, active: true, opening_hours: "06.00 - 18.00", facilities: "Parkir,Toilet,Warung Makan,Penyewaan Perahu,Area Foto,Penginapan", google_maps_url: "https://www.google.com/maps/search/Pantai+Santolo+Pameungpeuk+Garut" },
  { name: "Pantai Sayang Heulang", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Pameungpeuk, Garut", description: "Pantai berpasir putih dengan laguna alami yang tenang, cocok untuk bermain air. Terkenal dengan pemandangan matahari terbenam yang indah dan hamparan pasir yang luas.", partner: false, active: true, opening_hours: "06.00 - 18.00", facilities: "Parkir,Toilet,Warung Makan,Area Foto,Camping Ground", google_maps_url: "https://www.google.com/maps/search/Pantai+Sayang+Heulang+Pameungpeuk+Garut" },
  { name: "Kawah Kamojang", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Ibun, Garut", description: "Kawasan geothermal dengan kawah belerang aktif, kolam lumpur mendidih, dan sumber air panas alami. Suasana mistis dengan kepulan asap putih yang terus mengepul dari perut bumi.", partner: false, active: true, opening_hours: "08.00 - 16.00", facilities: "Parkir,Toilet,Pemandu Wisata,Warung Makan,Area Foto", google_maps_url: "https://www.google.com/maps/search/Kawah+Kamojang+Garut" },
  { name: "Gunung Guntur", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Tarogong Kaler, Garut", description: "Gunung berapi aktif dengan ketinggian 2.249 mdpl yang populer untuk pendakian. Menawarkan padang savana luas, kawah aktif, dan pemandangan spektakuler Kota Garut dari puncaknya.", partner: false, active: true, opening_hours: "05.00 - 14.00", facilities: "Parkir,Toilet,Warung Makan,Jalur Hiking,Pos Pendakian", google_maps_url: "https://www.google.com/maps/search/Gunung+Guntur+Garut" },
  { name: "Pemandian Air Panas Cipanas", category: "Buatan", rating: 0, entry_fee: 0, image: "", location: "Tarogong Kidul, Garut", description: "Kawasan pemandian air panas alami kaki Gunung Guntur yang sudah terkenal sejak zaman Belanda. Airnya mengandung belerang alami yang dipercaya berkhasiat untuk kesehatan kulit.", partner: false, active: true, opening_hours: "07.00 - 21.00", facilities: "Parkir,Toilet,Kolam Renang,Warung Makan,Hotel,Spa", google_maps_url: "https://www.google.com/maps/search/Cipanas+Garut+Tarogong" },
  { name: "Curug Sanghyang Taraje", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Pakenjeng, Garut", description: "Air terjun bertingkat dengan aliran air jernih yang jatuh dari ketinggian sekitar 75 meter. Dikelilingi hutan tropis lebat, menjadi salah satu curug terindah dan tertinggi di Garut.", partner: false, active: true, opening_hours: "07.00 - 17.00", facilities: "Parkir,Toilet,Warung Makan,Jalur Hiking,Area Foto", google_maps_url: "https://www.google.com/maps/search/Curug+Sanghyang+Taraje+Garut" },
  { name: "Gunung Cikurai", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Bayongbong, Garut", description: "Gunung tertinggi ketiga di Jawa Barat dengan ketinggian 2.821 mdpl. Terkenal dengan keindahan laut awan di pagi hari, padang edelweis, dan jalur pendakian yang menantang.", partner: false, active: true, opening_hours: "05.00 - 14.00", facilities: "Parkir,Toilet,Warung Makan,Jalur Hiking,Pos Pendakian,Area Camping", google_maps_url: "https://www.google.com/maps/search/Gunung+Cikurai+Bayongbong+Garut" },
  { name: "Pantai Karang Paranje", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Pameungpeuk, Garut", description: "Pantai dengan formasi batuan karang unik dan kolam alami yang terbentuk di antara karang. Air laut jernih kebiruan membuat pantai ini menjadi spot snorkeling dan fotografi yang populer.", partner: false, active: true, opening_hours: "06.00 - 18.00", facilities: "Parkir,Toilet,Warung Makan,Area Foto,Snorkeling", google_maps_url: "https://www.google.com/maps/search/Pantai+Karang+Paranje+Pameungpeuk+Garut" },
  { name: "Kampung Dukuh", category: "Budaya", rating: 0, entry_fee: 0, image: "", location: "Cikelet, Garut", description: "Perkampungan adat Sunda terpencil yang masih memegang teguh tradisi leluhur. Warganya hidup tanpa listrik, kendaraan bermotor, dan menolak modernitas demi menjaga kelestarian adat.", partner: false, active: true, opening_hours: "08.00 - 16.00", facilities: "Parkir,Toilet,Pemandu Wisata,Penginapan Tradisional", google_maps_url: "https://www.google.com/maps/search/Kampung+Dukuh+Cikelet+Garut" },
  { name: "Leuweung Sancang", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Cibalong, Garut", description: "Cagar alam hutan hujan tropis pesisir selatan Garut seluas 2.157 hektar. Habitat banteng Jawa, macan tutul, dan berbagai flora fauna endemik yang dilindungi.", partner: false, active: true, opening_hours: "07.00 - 17.00", facilities: "Parkir,Toilet,Pemandu Wisata,Jalur Trekking", google_maps_url: "https://www.google.com/maps/search/Leuweung+Sancang+Cibalong+Garut" },
  { name: "Kampung Pulo Leles", category: "Budaya", rating: 0, entry_fee: 0, image: "", location: "Leles, Garut", description: "Perkampungan bersejarah di atas pulau kecil di Situ Cangkuang, terdiri dari 6 rumah adat yang tidak boleh bertambah. Komunitas keturunan Prabu Siliwangi yang masih menjaga tradisi.", partner: false, active: true, opening_hours: "08.00 - 17.00", facilities: "Parkir,Toilet,Pemandu Wisata,Perahu Wisata,Area Foto", google_maps_url: "https://www.google.com/maps/search/Kampung+Pulo+Leles+Garut" },
  { name: "Curug Neglasari", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Samarang, Garut", description: "Air terjun bertingkat dengan kolam pemandian alami di bawahnya. Dikelilingi perkebunan teh yang hijau dan hutan pinus, menciptakan suasana sejuk dan segar khas dataran tinggi Garut.", partner: false, active: true, opening_hours: "07.00 - 17.00", facilities: "Parkir,Toilet,Warung Makan,Jalur Hiking,Area Foto", google_maps_url: "https://www.google.com/maps/search/Curug+Neglasari+Samarang+Garut" },
  { name: "Talaga Bodas", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Wanaraja, Garut", description: "Danau kawah vulkanik dengan air berwarna putih kekuningan akibat kandungan belerang tinggi. Pemandangan dramatis dengan tebing-tebing curam di sekeliling danau yang sunyi.", partner: false, active: true, opening_hours: "07.00 - 16.00", facilities: "Parkir,Toilet,Warung Makan,Jalur Trekking,Area Foto", google_maps_url: "https://www.google.com/maps/search/Talaga+Bodas+Wanaraja+Garut" },
  { name: "Perkebunan Teh Cikajang", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Cikajang, Garut", description: "Hamparan perkebunan teh PTPN VIII yang luas di dataran tinggi Garut. Udara sejuk, jalur trekking di antara pohon teh, dan pemandangan pegunungan yang menghijau.", partner: false, active: true, opening_hours: "07.00 - 17.00", facilities: "Parkir,Toilet,Warung Makan,Jalur Trekking,Area Foto,Toko Oleh-oleh", google_maps_url: "https://www.google.com/maps/search/Perkebunan+Teh+Cikajang+Garut" },
  { name: "Pantai Cijayana", category: "Alam", rating: 0, entry_fee: 0, image: "", location: "Mekarmukti, Garut", description: "Pantai terpencil di selatan Garut dengan hamparan pasir hitam vulkanik dan deburan ombak besar. Masih sangat alami, jarang dikunjungi wisatawan, cocok untuk yang mencari ketenangan.", partner: false, active: true, opening_hours: "06.00 - 18.00", facilities: "Parkir,Toilet,Warung Makan,Area Foto,Camping Ground", google_maps_url: "https://www.google.com/maps/search/Pantai+Cijayana+Garut" },
  { name: "Masjid Agung Garut", category: "Religi", rating: 0, entry_fee: 0, image: "", location: "Garut Kota, Garut", description: "Masjid bersejarah di pusat Kota Garut yang telah berdiri sejak abad ke-19. Arsitektur khas perpaduan gaya tradisional Sunda dan Islam dengan kubah hijau yang megah.", partner: false, active: true, opening_hours: "04.00 - 21.00", facilities: "Parkir,Toilet,Area Wudu,Perpustakaan,Area Foto", google_maps_url: "https://www.google.com/maps/search/Masjid+Agung+Garut" },
  { name: "Makam Godog", category: "Religi", rating: 0, entry_fee: 0, image: "", location: "Karangpawitan, Garut", description: "Situs makam keramat Prabu Kian Santang, putra Prabu Siliwangi, yang diyakini sebagai penyebar Islam pertama di Garut. Ramai dikunjungi peziarah dari berbagai daerah.", partner: false, active: true, opening_hours: "06.00 - 20.00", facilities: "Parkir,Toilet,Warung Makan,Area Ziarah", google_maps_url: "https://www.google.com/maps/search/Makam+Godog+Karangpawitan+Garut" },
];

const kulinerData = [
  { name: "Sate Maranggi Pak Nur", category: "Makanan Berat", rating: 0, image: "", location: "Jl. Otto Iskandardinata", description: "Sate maranggi khas Garut dengan bumbu kacang rahasia turun-temurun yang lezat dan menggugah selera.", featured: true, hours: "10.00–21.00", active: true, price_range: "Rp 15.000 – Rp 50.000" },
  { name: "Soto Ayam Garut Asli", category: "Makanan Berat", rating: 0, image: "", location: "Jl. Ciledug", description: "Soto ayam dengan kuah bening segar dan rempah pilihan, disajikan dengan nasi putih hangat.", featured: true, hours: "07.00–15.00", active: true, price_range: "Rp 15.000 – Rp 50.000" },
  { name: "Dodol Picnic", category: "Snack", rating: 0, image: "", location: "Jl. Pasundan", description: "Dodol Garut paling terkenal dengan berbagai varian rasa, cocok sebagai oleh-oleh khas Garut.", featured: true, hours: "08.00–20.00", active: true, price_range: "Rp 5.000 – Rp 30.000" },
  { name: "Chocodot Garut", category: "Snack", rating: 0, image: "", location: "Jl. Siliwangi", description: "Coklat dodol inovatif perpaduan dodol Garut dan coklat premium, oleh-oleh paling hits di Garut.", featured: true, hours: "09.00–21.00", active: true, price_range: "Rp 5.000 – Rp 30.000" },
  { name: "Es Goyobod Mang Dadang", category: "Minuman", rating: 0, image: "", location: "Alun-Alun Garut", description: "Minuman segar khas Garut berisi goyobod, alpukat, dan kelapa muda yang menyegarkan.", featured: true, hours: "09.00–17.00", active: true, price_range: "Rp 5.000 – Rp 25.000" },
  { name: "Surabi Garut", category: "Dessert", rating: 0, image: "", location: "Jl. Cimanuk", description: "Serabi tradisional dengan berbagai topping manis, dimasak di atas tungku tanah liat.", featured: false, hours: "07.00–13.00", active: true, price_range: "Rp 8.000 – Rp 35.000" },
  { name: "Nasi Liwet Bancakan", category: "Makanan Berat", rating: 0, image: "", location: "Jl. Ahmad Yani", description: "Nasi liwet khas Sunda dengan lauk pauk tradisional, disajikan di atas daun pisang.", featured: false, hours: "11.00–21.00", active: true, price_range: "Rp 15.000 – Rp 50.000" },
  { name: "Mie Kocok Garut", category: "Makanan Berat", rating: 0, image: "", location: "Jl. Pramuka", description: "Mie kocok khas Garut dengan kuah sumsum sapi gurih dan taburan bawang goreng melimpah.", featured: false, hours: "09.00–20.00", active: true, price_range: "Rp 15.000 – Rp 50.000" },
  { name: "Kopi Papandayan", category: "Minuman", rating: 0, image: "", location: "Jl. Mandalagiri", description: "Kopi single origin dari kebun Papandayan dengan cita rasa khas pegunungan Garut.", featured: false, hours: "07.00–22.00", active: true, price_range: "Rp 5.000 – Rp 25.000" },
  { name: "Peuyeum Garut", category: "Snack", rating: 0, image: "", location: "Pasar Ceplak", description: "Tape singkong fermentasi khas Garut dengan rasa manis asam yang khas dan unik.", featured: false, hours: "06.00–16.00", active: true, price_range: "Rp 5.000 – Rp 30.000" },
  { name: "Cuanki Garut", category: "Makanan Berat", rating: 0, image: "", location: "Garut Kota, Garut", description: "Sajian bakso aci khas Garut dengan kuah bening gurih yang kaya rempah. Isian lengkap: aci goreng, siomay, tahu, dan cilok.", featured: true, hours: "07.00 - 22.00", active: true, google_maps_url: "https://www.google.com/maps/search/Cuanki+Garut", price_range: "Rp 10.000 – Rp 20.000" },
  { name: "Bakso Akbar Garut", category: "Makanan Berat", rating: 0, image: "", location: "Tarogong, Garut", description: "Bakso jumbo dengan kuah kaldu sapi pekat yang menggiurkan. Porsi besar dengan isian pentol daging sapi pilihan.", featured: true, hours: "09.00 - 21.00", active: true, google_maps_url: "https://www.google.com/maps/search/Bakso+Akbar+Garut", price_range: "Rp 15.000 – Rp 35.000" },
  { name: "Bubur Ayam Garut", category: "Makanan Berat", rating: 0, image: "", location: "Garut Kota, Garut", description: "Bubur ayam gurih dengan topping ayam suwir, cakue, kerupuk, kacang goreng, dan kuah kaldu bening khas Garut.", featured: false, hours: "05.00 - 11.00", active: true, google_maps_url: "https://www.google.com/maps/search/Bubur+Ayam+Garut", price_range: "Rp 10.000 – Rp 20.000" },
  { name: "Nasi Timbel Garut", category: "Makanan Berat", rating: 0, image: "", location: "Bayongbong, Garut", description: "Nasi dibungkus daun pisang dengan lauk pauk khas Sunda: ayam goreng, ikan asin, tahu, tempe, lalap segar, dan sambal terasi.", featured: true, hours: "08.00 - 20.00", active: true, google_maps_url: "https://www.google.com/maps/search/Nasi+Timbel+Garut", price_range: "Rp 20.000 – Rp 40.000" },
  { name: "Siomay Garut", category: "Makanan Berat", rating: 0, image: "", location: "Garut Kota, Garut", description: "Siomay ikan tenggiri dengan bumbu kacang manis gurih khas Garut. Disajikan dengan kentang, tahu, kol, dan telur.", featured: false, hours: "09.00 - 17.00", active: true, google_maps_url: "https://www.google.com/maps/search/Siomay+Garut", price_range: "Rp 10.000 – Rp 25.000" },
  { name: "Gepuk Garut", category: "Makanan Berat", rating: 0, image: "", location: "Garut Kota, Garut", description: "Daging sapi yang dipukul, dimasak dengan bumbu rempah manis-gurih khas Sunda. Teksturnya lembut, cocok sebagai lauk atau oleh-oleh.", featured: false, hours: "08.00 - 20.00", active: true, google_maps_url: "https://www.google.com/maps/search/Gepuk+Garut", price_range: "Rp 25.000 – Rp 60.000" },
  { name: "Galendo Garut", category: "Snack", rating: 0, image: "", location: "Garut Kota, Garut", description: "Ampas minyak kelapa yang dipadatkan menjadi snack tradisional khas Garut. Rasa gurih manis dengan aroma kelapa yang khas.", featured: false, hours: "08.00 - 17.00", active: true, google_maps_url: "https://www.google.com/maps/search/Galendo+Garut", price_range: "Rp 5.000 – Rp 15.000" },
  { name: "Wajit Garut", category: "Snack", rating: 0, image: "", location: "Garut Kota, Garut", description: "Kue tradisional dari beras ketan, gula merah, dan kelapa parut yang dibungkus daun jagung kering. Manis legit khas oleh-oleh Garut.", featured: false, hours: "07.00 - 17.00", active: true, google_maps_url: "https://www.google.com/maps/search/Wajit+Garut", price_range: "Rp 5.000 – Rp 20.000" },
  { name: "Opak Garut", category: "Snack", rating: 0, image: "", location: "Sukawening, Garut", description: "Kerupuk tradisional dari beras ketan yang dipanggang dengan motif khas. Ada varian original, bawang, wijen, dan pedas.", featured: false, hours: "07.00 - 17.00", active: true, google_maps_url: "https://www.google.com/maps/search/Opak+Garut", price_range: "Rp 10.000 – Rp 30.000" },
  { name: "Kerupuk Kulit Garut", category: "Snack", rating: 0, image: "", location: "Garut Kota, Garut", description: "Kerupuk berbahan dasar kulit sapi yang renyah dengan rasa gurih asin khas. Salah satu oleh-oleh paling dicari dari Garut.", featured: false, hours: "08.00 - 17.00", active: true, google_maps_url: "https://www.google.com/maps/search/Kerupuk+Kulit+Garut", price_range: "Rp 15.000 – Rp 45.000" },
  { name: "Ranginang Garut", category: "Snack", rating: 0, image: "", location: "Garut Kota, Garut", description: "Penganan tradisional dari beras ketan yang dibumbui dan digoreng kering. Teksturnya renyah dengan cita rasa gurih yang khas.", featured: false, hours: "08.00 - 17.00", active: true, google_maps_url: "https://www.google.com/maps/search/Ranginang+Garut", price_range: "Rp 5.000 – Rp 25.000" },
  { name: "Cendol Dawet Garut", category: "Minuman", rating: 0, image: "", location: "Garut Kota, Garut", description: "Minuman segar khas Sunda dari cendol tepung beras hijau dengan santan segar dan gula merah cair. Menyegarkan di hari panas.", featured: false, hours: "08.00 - 17.00", active: true, google_maps_url: "https://www.google.com/maps/search/Cendol+Garut", price_range: "Rp 5.000 – Rp 15.000" },
  { name: "Bandrek Garut", category: "Minuman", rating: 0, image: "", location: "Garut Kota, Garut", description: "Minuman hangat rempah khas Sunda dari jahe, serai, kayu manis, cengkeh, dan gula merah. Cocok diminum di udara sejuk Garut.", featured: false, hours: "16.00 - 22.00", active: true, google_maps_url: "https://www.google.com/maps/search/Bandrek+Garut", price_range: "Rp 5.000 – Rp 15.000" },
  { name: "Es Cincau Garut", category: "Minuman", rating: 0, image: "", location: "Garut Kota, Garut", description: "Minuman segar cincau hitam dengan santan, gula merah, dan es batu. Menyegarkan dan dipercaya baik untuk pencernaan.", featured: false, hours: "09.00 - 18.00", active: true, google_maps_url: "https://www.google.com/maps/search/Es+Cincau+Garut", price_range: "Rp 5.000 – Rp 10.000" },
  { name: "Kolontong Garut", category: "Dessert", rating: 0, image: "", location: "Garut Kota, Garut", description: "Kue kering tradisional Sunda berbahan dasar tepung beras dengan gula putih. Rasa manis lembut dan sangat renyah.", featured: false, hours: "08.00 - 17.00", active: true, google_maps_url: "https://www.google.com/maps/search/Kolontong+Garut", price_range: "Rp 10.000 – Rp 30.000" },
  { name: "Lapis Susu Garut", category: "Dessert", rating: 0, image: "", location: "Garut Kota, Garut", description: "Kue lapis lembut berbahan susu segar dengan lapisan berwarna-warni. Teksturnya kenyal legit dengan aroma susu yang khas.", featured: false, hours: "08.00 - 17.00", active: true, google_maps_url: "https://www.google.com/maps/search/Lapis+Susu+Garut", price_range: "Rp 15.000 – Rp 40.000" },
  { name: "Dodol Karamel Garut", category: "Oleh-oleh", rating: 0, image: "", location: "Garut Kota, Garut", description: "Varian dodol Garut dengan rasa karamel manis yang unik. Dibuat dari bahan pilihan dengan proses tradisional yang menjaga kualitas.", featured: false, hours: "08.00 - 17.00", active: true, google_maps_url: "https://www.google.com/maps/search/Dodol+Karamel+Garut", price_range: "Rp 20.000 – Rp 60.000" },
  { name: "Kopi Arabika Cikajang", category: "Minuman", rating: 0, image: "", location: "Cikajang, Garut", description: "Kopi arabika premium dari perkebunan dataran tinggi Cikajang. Aroma harum khas dengan rasa fruity ringan dan keasaman yang menyenangkan.", featured: true, hours: "07.00 - 22.00", active: true, google_maps_url: "https://www.google.com/maps/search/Kopi+Cikajang+Garut", price_range: "Rp 15.000 – Rp 35.000" },
  { name: "Kopi Panglay Garut", category: "Cafe", rating: 0, image: "", location: "Garut Kota, Garut", description: "Kedai kopi legendaris khas Garut yang telah berdiri puluhan tahun. Menyajikan kopi robusta dan arabika lokal Garut dengan metode seduh tradisional yang mempertahankan cita rasa asli.", featured: true, hours: "07.00 – 22.00", active: true, google_maps_url: "https://www.google.com/maps/search/Kopi+Panglay+Garut", price_range: "Rp 10.000 – Rp 35.000" },
  { name: "Upnormal Coffee Roasters Garut", category: "Cafe", rating: 0, image: "", location: "Tarogong, Garut", description: "Franchise kopi modern dengan konsep co-working space. Menu beragam mulai kopi manual brew, susu, hingga makanan berat. Spot favorit mahasiswa dan profesional muda Garut.", featured: true, hours: "10.00 – 23.00", active: true, google_maps_url: "https://www.google.com/maps/search/Upnormal+Coffee+Garut", price_range: "Rp 20.000 – Rp 60.000" },
  { name: "Garage Coffee Garut", category: "Cafe", rating: 0, image: "", location: "Garut Kota, Garut", description: "Cafe bertema industrial dengan interior unik dari perpaduan kayu dan besi. Kopi single origin Garut menjadi andalan, lengkap dengan ragam pilihan pastri dan dessert.", featured: true, hours: "09.00 – 22.00", active: true, google_maps_url: "https://www.google.com/maps/search/Garage+Coffee+Garut", price_range: "Rp 18.000 – Rp 50.000" },
  { name: "Satu Atap Cafe Garut", category: "Cafe", rating: 0, image: "", location: "Tarogong Kidul, Garut", description: "Cafe outdoor dengan pemandangan Gunung Guntur dan hamparan sawah yang memukau. Suasana santai di bawah langit terbuka dengan menu kopi Garut pilihan dan camilan tradisional.", featured: true, hours: "08.00 – 21.00", active: true, google_maps_url: "https://www.google.com/maps/search/Satu+Atap+Cafe+Garut", price_range: "Rp 15.000 – Rp 45.000" },
  { name: "Roemah Kopi Garut", category: "Cafe", rating: 0, image: "", location: "Garut Kota, Garut", description: "Cafe berkonsep rumah Sunda klasik dengan ornamen kayu dan bambu. Menyajikan kopi Garut pilihan, teh herbal, dan makanan ringan tradisional Sunda dalam nuansa yang tenang.", featured: false, hours: "08.00 – 21.00", active: true, google_maps_url: "https://www.google.com/maps/search/Roemah+Kopi+Garut", price_range: "Rp 12.000 – Rp 40.000" },
  { name: "Kopi Lumbung Garut", category: "Cafe", rating: 0, image: "", location: "Bayongbong, Garut", description: "Cafe bergaya lumbung padi dengan pemandangan ladang dan pegunungan. Menyajikan kopi Arabika Cikajang yang ditanam sendiri dengan pemandangan Gunung Cikurai yang memesona.", featured: false, hours: "07.00 – 20.00", active: true, google_maps_url: "https://www.google.com/maps/search/Kopi+Lumbung+Garut", price_range: "Rp 12.000 – Rp 35.000" },
  { name: "The Papandayan Cafe", category: "Cafe", rating: 0, image: "", location: "Tarogong Kidul, Garut", description: "Cafe mewah di dalam Hotel The Papandayan dengan pemandangan kota Garut dan pegunungan. Suasana elegan dengan menu coffee premium, high tea, dan kue artisan berkualitas tinggi.", featured: false, hours: "07.00 – 22.00", active: true, google_maps_url: "https://www.google.com/maps/search/The+Papandayan+Hotel+Garut", price_range: "Rp 40.000 – Rp 120.000" },
  { name: "Kopicha Garut", category: "Cafe", rating: 0, image: "", location: "Garut Kota, Garut", description: "Kedai kopi minimalis yang khusus menyajikan kopi racikan barista terlatih. Menu andalannya es kopi susu Garut dengan biji kopi pilihan dari perkebunan lokal Cikajang.", featured: false, hours: "09.00 – 22.00", active: true, google_maps_url: "https://www.google.com/maps/search/Kopicha+Garut", price_range: "Rp 15.000 – Rp 40.000" },
  { name: "Cafe Nusa Garut", category: "Cafe", rating: 0, image: "", location: "Garut Kota, Garut", description: "Cafe yang mengedepankan kopi nusantara dari berbagai daerah Indonesia. Setiap bulan menghadirkan kopi rotating origin, dilengkapi menu fusion makanan Sunda modern.", featured: false, hours: "10.00 – 22.00", active: true, google_maps_url: "https://www.google.com/maps/search/Cafe+Nusa+Garut", price_range: "Rp 20.000 – Rp 55.000" },
  { name: "Darajat Pass Cafe", category: "Cafe", rating: 0, image: "", location: "Pasirwangi, Garut", description: "Cafe di kawasan wisata Darajat Pass dengan pemandangan kawah dan pegunungan yang spektakuler. Udara sangat sejuk di ketinggian dengan menu kopi dan makanan hangat.", featured: false, hours: "08.00 – 18.00", active: true, google_maps_url: "https://www.google.com/maps/search/Darajat+Pass+Garut", price_range: "Rp 15.000 – Rp 45.000" },
  { name: "Toko Oleh-oleh Dodol Garut Asli", category: "Oleh-oleh", rating: 0, image: "", location: "Jl. Ciledug, Garut", description: "Toko oleh-oleh terlengkap dengan berbagai varian dodol Garut asli. Tersedia dalam berbagai ukuran kemasan untuk dibawa pulang sebagai buah tangan khas Garut.", featured: false, hours: "08.00 – 20.00", active: true, google_maps_url: "https://www.google.com/maps/search/Toko+Dodol+Garut", price_range: "Rp 10.000 – Rp 100.000" },
  { name: "Pusat Oleh-oleh Garut", category: "Oleh-oleh", rating: 0, image: "", location: "Jl. Otto Iskandar Dinata, Garut", description: "Pusat perbelanjaan oleh-oleh terpusat yang menjual berbagai produk khas Garut: dodol, chocodot, kulit, kerajinan, dan berbagai makanan tradisional.", featured: false, hours: "08.00 – 21.00", active: true, google_maps_url: "https://www.google.com/maps/search/Pusat+Oleh-oleh+Garut", price_range: "Rp 5.000 – Rp 200.000" },
];

const bannerData = [
  { title: "Temukan", subtitle: "Keindahan Garut", description: "Jelajahi pesona alam, budaya, dan kuliner khas Kabupaten Garut — Swiss van Java.", category: "Alam", btn_text: "Jelajahi Sekarang", link: "/wisata", image: "/images/hero/papandayan.jpg", accent: "#0194f3", sort_order: 1, active: true },
  { title: "Rasakan", subtitle: "Cita Rasa Autentik", description: "Dari dodol legendaris hingga sate maranggi, nikmati kuliner khas Garut yang tak terlupakan.", category: "Kuliner", btn_text: "Lihat Kuliner", link: "/kuliner", image: "/images/hero/sate-maranggi.jpg", accent: "#f97316", sort_order: 2, active: true },
  { title: "Dengarkan", subtitle: "Harmoni Budaya Sunda", description: "Festival seni, wayang golek, dan pagelaran budaya yang menjaga warisan leluhur Garut.", category: "Budaya", btn_text: "Lihat Event", link: "/event", image: "/images/hero/karnaval.jpg", accent: "#8b5cf6", sort_order: 3, active: true },
  { title: "Taklukkan", subtitle: "Petualangan Alam Garut", description: "Daki gunung, susuri sungai, dan rasakan adrenalin di alam bebas Garut yang menakjubkan.", category: "Petualangan", btn_text: "Mulai Petualangan", link: "/wisata", image: "/images/hero/gunung-guntur.jpg", accent: "#10b981", sort_order: 4, active: true },
  { title: "Nginap", subtitle: "Penginapan Terbaik", description: "Pilihan hotel, villa, dan homestay nyaman di jantung Garut dengan pemandangan pegunungan.", category: "Penginapan", btn_text: "Cari Penginapan", link: "/penginapan", image: "/images/hero/sampireun.jpg", accent: "#0172B1", sort_order: 5, active: true },
  { title: "Bikin Event", subtitle: "Event di Venue Pilihan", description: "Rancang momen spesial di cafe atau tempat wisata pilihanmu.", category: "Event", btn_text: "Cari Venue", link: "/event", image: "/images/hero/dpakar.jpg", accent: "#ec4899", sort_order: 6, active: true },
  { title: "Kolaborasi Nempo.id", subtitle: "Event untuk Tempatmu", description: "Nempo.id siap berkolaborasi membuat event di cafe atau tempat wisatamu untuk meningkatkan insight dan awareness.", category: "Kolaborasi", btn_text: "Ajak Kolaborasi", link: "/event", image: "/images/hero/kolaborasi.jpg", accent: "#ef4444", sort_order: 7, active: true },
];

const perlombaanData = [
  { name: "Garut Photography Contest 2025", category: "Fotografi", date: "2025-05-30", location: "Garut, Jawa Barat", image: "", description: "Lomba fotografi dengan tema pesona alam dan budaya Garut. Terbuka untuk semua fotografer Indonesia.", prize: 15000000, organizer: "Dinas Pariwisata Garut", fee: 75000, max_peserta: 500, featured: true, active: true },
  { name: "Kompetisi Masak Kuliner Sunda", category: "Kuliner", date: "2025-06-15", location: "GOR Garut", image: "", description: "Adu kreasi masakan Sunda modern. Pemenang akan mendapat mentoring dari chef berbintang nasional.", prize: 10000000, organizer: "Dinas Ketahanan Pangan Garut", fee: 50000, max_peserta: 200, featured: true, active: true },
  { name: "Garut Trail Run Championship", category: "Olahraga", date: "2025-06-28", location: "Gunung Cikuray", image: "", description: "Lomba lari trail internasional di jalur pegunungan Garut sepanjang 42km.", prize: 25000000, organizer: "Garut Adventure Sport", fee: 150000, max_peserta: 300, featured: true, active: true },
  { name: "Festival Tari Tradisional Garut", category: "Seni Budaya", date: "2025-07-05", location: "Alun-Alun Garut", image: "", description: "Kompetisi tari tradisional Sunda untuk pelajar SD, SMP, dan SMA se-Kabupaten Garut.", prize: 5000000, organizer: "Dinas Pendidikan Garut", fee: 30000, max_peserta: 150, featured: false, active: true },
  { name: "Lomba Desain Batik Digital", category: "Desain", date: "2025-07-20", location: "Online", image: "", description: "Ekspresikan motif batik khas Garut dalam karya desain digital. Pemenang akan diproduksi massal.", prize: 8000000, organizer: "Dekranasda Garut", fee: 25000, max_peserta: 400, featured: false, active: true },
];

const digitalServicesData = [
  { title: "Pembuatan Website",            description: "Pembuatan website profesional untuk bisnis, UMKM, dan wisata Garut. Tampilan modern, responsif, dan SEO-friendly.",                             price: 0, category: "Website",       image: "", whatsapp: "6281385840306", featured: true,  active: true },
  { title: "Desain",                        description: "Jasa desain grafis profesional: logo, banner, brosur, poster, dan identitas visual untuk brand bisnis Anda.",                                   price: 0, category: "Desain",         image: "", whatsapp: "6281385840306", featured: false, active: true },
  { title: "Manajemen Sosial Media",        description: "Kelola akun media sosial bisnis Anda secara profesional — konten kreatif, jadwal posting, dan pertumbuhan organik.",                            price: 0, category: "Media Sosial",   image: "", whatsapp: "6281385840306", featured: true,  active: true },
  { title: "Kasir Digital",                 description: "Sistem kasir digital berbasis cloud untuk UMKM. Catat transaksi, kelola stok, dan pantau laporan penjualan real-time.",                         price: 0, category: "Kasir Digital",  image: "", whatsapp: "6281385840306", featured: true,  active: true },
  { title: "Menu Digital",                  description: "Menu digital berbasis QR Code untuk restoran, cafe, dan warung. Mudah diperbarui, tampil modern, tanpa biaya cetak ulang.",                     price: 0, category: "Aplikasi",       image: "", whatsapp: "6281385840306", featured: false, active: true },
  { title: "Undangan Digital",              description: "Undangan pernikahan dan acara digital berbasis web. Elegan, interaktif, dan mudah dibagikan lewat WhatsApp.",                                   price: 0, category: "Desain",         image: "", whatsapp: "6281385840306", featured: false, active: true },
  { title: "Pemesanan Tiket Event",         description: "Sistem pemesanan tiket event online. Kelola penjualan, validasi tiket, dan laporan peserta dengan mudah dan akurat.",                           price: 0, category: "Reservasi",      image: "", whatsapp: "6281385840306", featured: false, active: true },
  { title: "Booking Hotel/Penginapan",      description: "Sistem booking penginapan online untuk hotel, villa, dan homestay. Kalender ketersediaan dan konfirmasi otomatis.",                             price: 0, category: "Reservasi",      image: "", whatsapp: "6281385840306", featured: false, active: true },
  { title: "CRM/Sistem Perusahaan Digital", description: "Sistem CRM dan manajemen bisnis digital. Kelola pelanggan, tim, transaksi, dan laporan dalam satu platform terintegrasi.",                      price: 0, category: "Aplikasi",       image: "", whatsapp: "6281385840306", featured: false, active: true },
];

const priceListData = [
  { item: "Tiket Masuk Cipanas", price: 15000, category: "Wisata Alam", description: "Tiket masuk kawasan wisata pemandian air panas Cipanas per orang", sort_order: 1, active: true },
  { item: "Tiket Masuk Papandayan", price: 25000, category: "Wisata Alam", description: "Tiket masuk Gunung Papandayan per orang, sudah termasuk asuransi", sort_order: 2, active: true },
  { item: "Tiket Masuk Candi Cangkuang", price: 10000, category: "Wisata Sejarah", description: "Tiket masuk Candi Cangkuang termasuk perahu tradisional", sort_order: 3, active: true },
  { item: "Parkir Motor", price: 5000, category: "Parkir", description: "Tarif parkir sepeda motor per kunjungan", sort_order: 4, active: true },
  { item: "Parkir Mobil", price: 10000, category: "Parkir", description: "Tarif parkir kendaraan roda empat per kunjungan", sort_order: 5, active: true },
  { item: "Parkir Bus/Minibus", price: 25000, category: "Parkir", description: "Tarif parkir bus dan minibus per kunjungan", sort_order: 6, active: true },
  { item: "Sewa Perahu Situ Bagendit", price: 20000, category: "Aktivitas", description: "Sewa perahu untuk mengelilingi Situ Bagendit per perahu (maks 4 orang)", sort_order: 7, active: true },
  { item: "Sewa ATV Papandayan", price: 100000, category: "Aktivitas", description: "Sewa ATV di kawasan wisata Gunung Papandayan per 30 menit", sort_order: 8, active: true },
  { item: "Sewa Kuda Cikajang", price: 50000, category: "Aktivitas", description: "Sewa kuda untuk berkendara di padang rumput Cikajang per 30 menit", sort_order: 9, active: true },
  { item: "Camping Papandayan (tenda sendiri)", price: 30000, category: "Camping", description: "Biaya izin camping di Gunung Papandayan membawa tenda sendiri per malam", sort_order: 10, active: true },
  { item: "Sewa Tenda Dome", price: 75000, category: "Camping", description: "Sewa tenda dome kapasitas 2-3 orang per malam", sort_order: 11, active: true },
  { item: "Guide Lokal", price: 150000, category: "Jasa", description: "Jasa pemandu wisata lokal bersertifikat per hari", sort_order: 12, active: true },
];

const influencerData = [
  { name: "Rifki Maulana",    handle: "@rifkijalanjalan",   instagram: "128K", tiktok: "64K",  verified: true,  color: "#0194f3", color2: "#0053a8", niches: ["Travel","Lifestyle","Vlog"],        location: "Garut",   rating: 4.9, rate: "Rp 500K/post",  bio: "Penjelajah jalur tersembunyi di Garut & Jawa Barat.",   photos: ["/images/jmlc-vol1-5.jpg","/images/jmlc-vol1-1.jpg","/images/jmlc-vol1-12.jpg"], sort_order: 1 },
  { name: "Sinta Amelia",     handle: "@sintakulinergarut", instagram: "96K",  tiktok: "245K", verified: true,  color: "#EC4899", color2: "#be185d", niches: ["Kuliner","Food Review","ASMR"],     location: "Garut",   rating: 4.8, rate: "Rp 450K/post",  bio: "Review jujur kuliner lokal Garut setiap hari.",         photos: ["/images/jmlc-vol1-2.jpg","/images/jmlc-vol1-9.jpg","/images/jmlc-vol1-14.jpg"], sort_order: 2 },
  { name: "Dede Firmansyah",  handle: "@dedefirman",        instagram: "58K",  tiktok: "112K", verified: true,  color: "#F43F5E", color2: "#9f1239", niches: ["Otomotif","Komunitas","Lifestyle"], location: "Garut",   rating: 4.7, rate: "Rp 300K/post",  bio: "Konten otomotif & komunitas anak muda Garut.",          photos: ["/images/jmlc-vol1-8.jpg","/images/jmlc-vol1-4.jpg","/images/jmlc-vol1-11.jpg"], sort_order: 3 },
  { name: "Nadia Putri",      handle: "@nadiaootd",         instagram: "312K", tiktok: "89K",  verified: true,  color: "#A855F7", color2: "#6b21a8", niches: ["Fashion","OOTD","Beauty"],          location: "Bandung", rating: 5.0, rate: "Rp 1.2jt/post", bio: "Fashion & beauty creator, inspirasi outfit harian.",    photos: ["/images/jmlc-vol1-3.jpg","/images/jmlc-vol1-6.jpg","/images/jmlc-vol1-15.jpg"], sort_order: 4 },
  { name: "Aldi Ramdani",     handle: "@aldilensa",         instagram: "54K",  tiktok: "21K",  verified: false, color: "#F59E0B", color2: "#b45309", niches: ["Fotografi","Alam","Editing"],       location: "Garut",   rating: 4.6, rate: "Rp 250K/post",  bio: "Mengabadikan keindahan alam Garut lewat lensa kamera.", photos: ["/images/jmlc-vol1-10.jpg","/images/jmlc-vol1-7.jpg","/images/jmlc-vol1-13.jpg"], sort_order: 5 },
  { name: "Citra Ayu",        handle: "@citraunbox",        instagram: "40K",  tiktok: "76K",  verified: false, color: "#10B981", color2: "#065f46", niches: ["Unboxing","Review","Tech"],         location: "Garut",   rating: 4.5, rate: "Rp 200K/post",  bio: "Unboxing & review produk lokal Indonesia terpercaya.",  photos: ["/images/jmlc-vol1-13.jpg","/images/jmlc-vol1-2.jpg","/images/jmlc-vol1-6.jpg"], sort_order: 6 },
  { name: "Yusuf Hidayat",    handle: "@yusufhikinggarut",  instagram: "189K", tiktok: "52K",  verified: true,  color: "#0172B1", color2: "#0c4a6e", niches: ["Hiking","Alam","Outdoor"],          location: "Garut",   rating: 4.9, rate: "Rp 700K/post",  bio: "Pendaki gunung & penjaga alam Garut yang aktif.",       photos: ["/images/jmlc-vol1-7.jpg","/images/jmlc-vol1-11.jpg","/images/jmlc-vol1-3.jpg"], sort_order: 7 },
  { name: "Melani Putri",     handle: "@melanifoodie",      instagram: "63K",  tiktok: "34K",  verified: false, color: "#EF4444", color2: "#7f1d1d", niches: ["Kuliner","Resep","Cafe"],           location: "Garut",   rating: 4.6, rate: "Rp 280K/post",  bio: "Pecinta kuliner & pemburu cafe estetik Garut.",         photos: ["/images/jmlc-vol1-15.jpg","/images/jmlc-vol1-8.jpg","/images/jmlc-vol1-1.jpg"], sort_order: 8 },
];

const transportasiData = [
  { name: "Angkot Garut-Cipanas", type: "Angkot", kode: "01", asal: "Terminal Guntur Garut", tujuan: "Cipanas", via: "Jl. Pramuka", tarif: 5000, jam: "05:00-21:00", frekuensi: "Setiap 15 menit", description: "Angkot jurusan Garut–Cipanas melewati pusat kota.", active: true },
  { name: "Angkot Garut-Tarogong", type: "Angkot", kode: "02", asal: "Terminal Guntur Garut", tujuan: "Tarogong", via: "Jl. Ahmad Yani", tarif: 4000, jam: "05:30-21:30", frekuensi: "Setiap 20 menit", description: "Angkot menuju kawasan wisata Tarogong dan Cipanas.", active: true },
  { name: "Bus Garut-Bandung (AC)", type: "Bus", kode: "GB-AC", asal: "Terminal Guntur Garut", tujuan: "Terminal Leuwipanjang Bandung", via: "Tol Cipularang", tarif: 45000, jam: "05:00-20:00", frekuensi: "Setiap 1 jam", description: "Bus ber-AC jurusan Garut–Bandung via tol. Waktu tempuh sekitar 2 jam.", active: true },
  { name: "Bus Garut-Bandung (Ekonomi)", type: "Bus", kode: "GB-EK", asal: "Terminal Guntur Garut", tujuan: "Terminal Leuwipanjang Bandung", via: "Jl. Raya Garut-Bandung", tarif: 25000, jam: "04:30-21:00", frekuensi: "Setiap 30 menit", description: "Bus ekonomi non-AC Garut–Bandung via jalur biasa. Waktu tempuh 3–4 jam.", active: true },
  { name: "Kereta Lokal Garut-Cibatu", type: "Kereta", kode: "KA-LK", asal: "Stasiun Garut", tujuan: "Stasiun Cibatu", via: "-", tarif: 4000, jam: "06:00-18:00", frekuensi: "4 kali sehari", description: "Kereta lokal penghubung Garut–Cibatu, kemudian bisa sambung ke Bandung atau Jakarta.", active: true },
  { name: "Ojek Online (Garut Kota)", type: "Ojek Online", kode: "OJ-01", asal: "Garut Kota", tujuan: "Seluruh Garut Kota", via: "-", tarif: 10000, jam: "06:00-23:00", frekuensi: "Sesuai permintaan", description: "Layanan ojek online yang beroperasi di wilayah Garut Kota. Tarif mulai Rp10.000.", active: true },
  { name: "Travel Garut-Bandara Husein", type: "Travel", kode: "TV-BD", asal: "Garut Kota (jemput lokasi)", tujuan: "Bandara Husein Sastranegara", via: "Tol Cipularang", tarif: 120000, jam: "03:00-20:00", frekuensi: "Sesuai jadwal pesanan", description: "Layanan travel door-to-door Garut ke Bandara Husein. Pesan minimal H-1.", active: true },
  { name: "Damri Garut-Bandung", type: "Bus", kode: "DAMRI", asal: "Terminal Guntur Garut", tujuan: "Bandung (berbagai tujuan)", via: "Tol Cipularang", tarif: 55000, jam: "05:30-19:30", frekuensi: "Setiap 2 jam", description: "Bus DAMRI resmi dengan AC dan bagasi besar. Cocok untuk wisatawan membawa banyak barang.", active: true },
];

export async function seedIfEmpty(): Promise<void> {
  const client = await pool.connect();
  try {
    // ── Create seed_log table (tracks which tables have ever been seeded) ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS seed_log (
        table_name VARCHAR(100) PRIMARY KEY,
        seeded_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // ── Column migrations (idempotent, run every startup) ──
    await client.query(`ALTER TABLE berita ADD COLUMN IF NOT EXISTS event_date DATE`);
    await client.query(`ALTER TABLE berita ADD COLUMN IF NOT EXISTS photo_source VARCHAR(255)`);
    await client.query(`ALTER TABLE berita ADD COLUMN IF NOT EXISTS source_name VARCHAR(255)`);
    await client.query(`ALTER TABLE berita ADD COLUMN IF NOT EXISTS source_url TEXT`);
    await client.query(`ALTER TABLE berita ADD COLUMN IF NOT EXISTS location VARCHAR(120)`);
    // Voucher campaign: applicable_type restricts voucher to a content category
    await client.query(`ALTER TABLE vouchers ADD COLUMN IF NOT EXISTS applicable_type VARCHAR(50)`);
    // Exclusive rewards: users must reach this point balance before claiming
    await client.query(`ALTER TABLE vouchers ADD COLUMN IF NOT EXISTS required_points INTEGER NOT NULL DEFAULT 0`);
    // Kuliner orders: track applied voucher and resulting discount
    await client.query(`ALTER TABLE kuliner_orders ADD COLUMN IF NOT EXISTS voucher_code VARCHAR(100)`);
    await client.query(`ALTER TABLE kuliner_orders ADD COLUMN IF NOT EXISTS discount_amount INTEGER NOT NULL DEFAULT 0`);
    // Jajan YUK: preserve server-calculated delivery, service, and voucher amounts on each order
    await client.query(`ALTER TABLE jajan_yuk_orders ADD COLUMN IF NOT EXISTS delivery_discount INTEGER NOT NULL DEFAULT 0`);
    await client.query(`ALTER TABLE jajan_yuk_orders ADD COLUMN IF NOT EXISTS service_fee INTEGER NOT NULL DEFAULT 0`);
    await client.query(`ALTER TABLE jajan_yuk_orders ADD COLUMN IF NOT EXISTS voucher_code VARCHAR(100)`);
    await client.query(`ALTER TABLE jajan_yuk_orders ADD COLUMN IF NOT EXISTS voucher_discount INTEGER NOT NULL DEFAULT 0`);
    await client.query(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES ('jajan_yuk_service_fee_percent', '2', NOW())
       ON CONFLICT (key) DO NOTHING`,
    );
    // ── Create talents table (admin-managed talent studio directory) ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS talents (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(200) NOT NULL,
        role        VARCHAR(200) NOT NULL DEFAULT '',
        category    VARCHAR(100) NOT NULL DEFAULT 'mc',
        tagline     TEXT NOT NULL DEFAULT '',
        instagram   VARCHAR(200) NOT NULL DEFAULT '',
        tags        TEXT[] NOT NULL DEFAULT '{}',
        verified    BOOLEAN NOT NULL DEFAULT false,
        featured    BOOLEAN NOT NULL DEFAULT false,
        bio         TEXT NOT NULL DEFAULT '',
        wa          VARCHAR(50) NOT NULL DEFAULT '',
        photo       TEXT NOT NULL DEFAULT '',
        sort_order  INTEGER NOT NULL DEFAULT 0,
        active      BOOLEAN NOT NULL DEFAULT true,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // ── Create influencers table (admin-managed creator directory) ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS influencers (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(255) NOT NULL,
        handle      VARCHAR(255) DEFAULT '',
        instagram   VARCHAR(50)  DEFAULT '',
        tiktok      VARCHAR(50)  DEFAULT '',
        verified    BOOLEAN      DEFAULT false,
        color       VARCHAR(20)  DEFAULT '#EC4899',
        color2      VARCHAR(20)  DEFAULT '#be185d',
        niches      TEXT[]       DEFAULT '{}',
        location    VARCHAR(255) DEFAULT '',
        rating      NUMERIC(2,1) DEFAULT 0,
        rate        VARCHAR(100) DEFAULT '',
        bio         TEXT         DEFAULT '',
        photos      TEXT[]       DEFAULT '{}',
        active      BOOLEAN      DEFAULT true,
        sort_order  INT          DEFAULT 0,
        created_at  TIMESTAMPTZ  DEFAULT NOW(),
        updated_at  TIMESTAMPTZ  DEFAULT NOW()
      )
    `);

    /** Returns true if this table was NEVER seeded before (safe to seed once). */
    async function neverSeeded(tableName: string): Promise<boolean> {
      const { rows } = await client.query(
        "SELECT 1 FROM seed_log WHERE table_name = $1",
        [tableName]
      );
      return rows.length === 0;
    }

    /** Mark a table as seeded so it is never touched again. */
    async function markSeeded(tableName: string): Promise<void> {
      await client.query(
        "INSERT INTO seed_log (table_name) VALUES ($1) ON CONFLICT DO NOTHING",
        [tableName]
      );
    }

    // ── Do not seed a shared/default admin password ──
    const { rows: adminRows } = await client.query("SELECT COUNT(*)::int AS count FROM admin_users");
    if ((adminRows[0]?.count ?? 0) === 0) {
      console.warn("[seed] No admin account exists. Create one with the local admin:set-password command.");
    }

    // ── Seed wisata ──
    if (await neverSeeded("wisata")) {
      console.log("[seed] Wisata table empty — seeding data...");
      for (const w of wisataData) {
        await client.query(
          `INSERT INTO wisata (name, category, rating, entry_fee, image, location, description, partner, active, opening_hours, facilities, google_maps_url)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
          [w.name, w.category, w.rating, w.entry_fee, w.image, w.location, w.description, w.partner, w.active, w.opening_hours, w.facilities, w.google_maps_url ?? null]
        );
      }
      console.log(`[seed] Inserted ${wisataData.length} wisata rows`);
      await markSeeded("wisata");
    }

    // ── Seed kuliner ──
    if (await neverSeeded("kuliner")) {
      console.log("[seed] Seeding kuliner for the first time...");
      for (const k of kulinerData) {
        await client.query(
          `INSERT INTO kuliner (name, category, rating, image, location, description, featured, hours, active, google_maps_url, price_range)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
          [k.name, k.category, k.rating, k.image, k.location, k.description, k.featured, k.hours, k.active, (k as { google_maps_url?: string }).google_maps_url ?? null, k.price_range]
        );
      }
      console.log(`[seed] Inserted ${kulinerData.length} kuliner rows`);
      await markSeeded("kuliner");
    }

    // ── Seed banners ──
    if (await neverSeeded("banners")) {
      console.log("[seed] Seeding banners for the first time...");
      for (const b of bannerData) {
        await client.query(
          `INSERT INTO banners (title, subtitle, description, category, btn_text, link, image, accent, sort_order, active)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [b.title, b.subtitle, b.description, b.category, b.btn_text, b.link, b.image, b.accent, b.sort_order, b.active]
        );
      }
      console.log(`[seed] Inserted ${bannerData.length} banner rows`);
      await markSeeded("banners");
    }

    // ── Seed event tickets ──
    if (await neverSeeded("event_tickets")) {
      console.log("[seed] Seeding event_tickets for the first time...");
      const evRow = await client.query(
        "SELECT id FROM events WHERE slug=$1 OR (slug IS NULL AND name=$2) LIMIT 1",
        ["temu-tarung-vol-2", "Temu Tarung Vol. 2"]
      );
      if (evRow.rows.length > 0) {
        const evId = evRow.rows[0].id;
        const existingCount = await client.query(
          "SELECT COUNT(*) FROM event_tickets WHERE event_id=$1",
          [evId]
        );
        const alreadyHasTickets = parseInt(existingCount.rows[0].count, 10) > 0;
        if (alreadyHasTickets) {
          console.log(`[seed] event_tickets already exist for event id=${evId}, skipping insert`);
        } else {
          const ticketData = [
            { name: "Reguler Early Bird",  description: "Tiket reguler · harga spesial early bird",  price: 20000, quota: 1500, sold: 0, sale_start: "2026-05-13", sale_end: "2026-05-31", sort_order: 1, active: true },
            { name: "Reguler Presale 2",   description: "Tiket reguler · gelombang kedua",           price: 25000, quota: 1000, sold: 0, sale_start: "2026-06-01", sale_end: "2026-06-14", sort_order: 2, active: true },
            { name: "Reguler OTS",         description: "Tiket reguler · on the spot",               price: 30000, quota: 500,  sold: 0, sale_start: "2026-06-15", sale_end: "2026-06-21", sort_order: 3, active: true },
            { name: "VIP Early Bird",      description: "Akses VIP · harga spesial early bird",      price: 60000, quota: 50,   sold: 0, sale_start: "2026-05-13", sale_end: "2026-05-31", sort_order: 7, active: true },
            { name: "VIP Presale 2",       description: "Akses VIP · gelombang kedua",               price: 65000, quota: 30,   sold: 0, sale_start: "2026-06-01", sale_end: "2026-06-14", sort_order: 8, active: true },
            { name: "VIP OTS",             description: "Akses VIP · on the spot",                   price: 70000, quota: 20,   sold: 0, sale_start: "2026-06-15", sale_end: "2026-06-21", sort_order: 9, active: true },
          ];
          for (const t of ticketData) {
            await client.query(
              `INSERT INTO event_tickets (event_id, name, description, price, quota, sold, sale_start, sale_end, sort_order, active)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
              [evId, t.name, t.description, t.price, t.quota, t.sold, t.sale_start, t.sale_end, t.sort_order, t.active]
            );
          }
          console.log(`[seed] Inserted ${ticketData.length} ticket rows for event id=${evId}`);
        }
      } else {
        console.log("[seed] Temu Tarung event not found, skipping ticket seed");
      }
      await markSeeded("event_tickets");
    }

    // ── Migrasi data: set sale_start/sale_end untuk tiket yang sudah ada ──
    if (await neverSeeded("ticket_sale_dates_v1")) {
      console.log("[seed] Migrating ticket sale dates...");
      const evRow = await client.query(
        "SELECT id FROM events WHERE slug=$1 OR (slug IS NULL AND name=$2) LIMIT 1",
        ["temu-tarung-vol-2", "Temu Tarung Vol. 2"]
      );
      if (evRow.rows.length > 0) {
        const evId = evRow.rows[0].id;
        const saleDates: Record<string, { sale_start: string; sale_end: string; sort_order: number }> = {
          "Presale 1":          { sale_start: "2026-05-13", sale_end: "2026-05-31", sort_order: 4 },
          "Presale 2":          { sale_start: "2026-06-01", sale_end: "2026-06-14", sort_order: 5 },
          "OTS":                { sale_start: "2026-06-20", sale_end: "2026-06-21", sort_order: 6 },
          "Reguler Early Bird": { sale_start: "2026-05-13", sale_end: "2026-05-31", sort_order: 1 },
          "Reguler Presale 2":  { sale_start: "2026-06-01", sale_end: "2026-06-14", sort_order: 2 },
          "Reguler OTS":        { sale_start: "2026-06-15", sale_end: "2026-06-21", sort_order: 3 },
          "VIP Early Bird":     { sale_start: "2026-05-13", sale_end: "2026-05-31", sort_order: 7 },
          "VIP Presale 2":      { sale_start: "2026-06-01", sale_end: "2026-06-14", sort_order: 8 },
          "VIP OTS":            { sale_start: "2026-06-15", sale_end: "2026-06-21", sort_order: 9 },
        };
        for (const [name, dates] of Object.entries(saleDates)) {
          await client.query(
            `UPDATE event_tickets SET sale_start=$1, sale_end=$2, sort_order=$3
             WHERE event_id=$4 AND name=$5 AND (sale_start IS NULL OR sale_end IS NULL)`,
            [dates.sale_start, dates.sale_end, dates.sort_order, evId, name]
          );
        }
        console.log("[seed] Ticket sale dates migrated for event id=" + evId);
      }
      await markSeeded("ticket_sale_dates_v1");
    }

    // ── Seed perlombaan ──
    if (await neverSeeded("perlombaan")) {
      console.log("[seed] Seeding perlombaan for the first time...");
      for (const p of perlombaanData) {
        await client.query(
          `INSERT INTO perlombaan (name, category, date, location, image, description, prize, organizer, fee, max_peserta, featured, active)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
          [p.name, p.category, p.date, p.location, p.image, p.description, p.prize, p.organizer, p.fee, p.max_peserta, p.featured, p.active]
        );
      }
      console.log(`[seed] Inserted ${perlombaanData.length} perlombaan rows`);
      await markSeeded("perlombaan");
    }

    // ── Seed digital services ──
    if (await neverSeeded("digital_services")) {
      console.log("[seed] Seeding digital_services for the first time...");
      for (const s of digitalServicesData) {
        await client.query(
          `INSERT INTO digital_services (title, description, price, category, image, whatsapp, featured, active)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [s.title, s.description, s.price, s.category, s.image, s.whatsapp, s.featured, s.active]
        );
      }
      console.log(`[seed] Inserted ${digitalServicesData.length} digital service rows`);
      await markSeeded("digital_services");
    }

    // ── Seed price list ──
    if (await neverSeeded("price_list")) {
      console.log("[seed] Seeding price_list for the first time...");
      for (const p of priceListData) {
        await client.query(
          `INSERT INTO price_list (item, price, category, description, sort_order, active)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [p.item, p.price, p.category, p.description, p.sort_order, p.active]
        );
      }
      console.log(`[seed] Inserted ${priceListData.length} price list rows`);
      await markSeeded("price_list");
    }

    // ── Seed transportasi ──
    if (await neverSeeded("transportasi")) {
      console.log("[seed] Seeding transportasi for the first time...");
      for (const t of transportasiData) {
        await client.query(
          `INSERT INTO transportasi (name, type, kode, asal, tujuan, via, tarif, jam, frekuensi, description, active)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
          [t.name, t.type, t.kode, t.asal, t.tujuan, t.via, t.tarif, t.jam, t.frekuensi, t.description, t.active]
        );
      }
      console.log(`[seed] Inserted ${transportasiData.length} transportasi rows`);
      await markSeeded("transportasi");
    }

    // ── Seed vouchers ──
    if (await neverSeeded("vouchers")) {
      console.log("[seed] Seeding vouchers for the first time...");
      const voucherData = [
        { title: "Pengguna Baru", code: "NEWBIE10", type: "new_user", discount_type: "persen", discount_value: 10, min_purchase: 0, expiry_date: null, description: "Daftar akun Nempo sekarang dan dapatkan diskon langsung 10% untuk semua event & wisata. Berlaku 30 hari setelah registrasi.", active: true, applicable_type: null },
        { title: "Reward Poin Silver", code: "SILVER15", type: "point_reward", discount_type: "persen", discount_value: 15, min_purchase: 0, expiry_date: null, description: "Kumpulkan 500 poin untuk naik ke Silver dan dapatkan diskon 15%. Semakin banyak poin, semakin besar diskonmu.", active: true, applicable_type: null, required_points: 0 },
        { title: "Akses Nempo Elite", code: "ELITE3000", type: "point_reward", discount_type: "reward", discount_value: 0, min_purchase: 0, expiry_date: null, description: "Hadiah eksklusif untuk member yang berhasil mengumpulkan 3.000 poin. Bukan voucher diskon dan hanya bisa diklaim satu kali.", active: true, applicable_type: null, required_points: 3000 },
        { title: "Koleksi Nempo Legend", code: "LEGEND5000", type: "point_reward", discount_type: "reward", discount_value: 0, min_purchase: 0, expiry_date: null, description: "Reward paling langka Nempo untuk member dengan 5.000 poin. Bukan voucher diskon dan jumlah klaim dibatasi satu kali.", active: true, applicable_type: null, required_points: 5000 },
        { title: "Liburan Akhir Tahun", code: "YEAREND25", type: "promo", discount_type: "persen", discount_value: 25, min_purchase: 100000, expiry_date: "2025-12-31", description: "Rayakan akhir tahun di Garut! Diskon 25% untuk pemesanan wisata dan penginapan minimal Rp100.000.", active: true, applicable_type: null },
        { title: "Flash Sale Weekend", code: "WEEKEND20", type: "promo", discount_type: "persen", discount_value: 20, min_purchase: 50000, expiry_date: "2025-07-31", description: "Hanya di akhir pekan! Dapatkan diskon 20% untuk semua layanan wisata Garut. Jangan sampai ketinggalan.", active: true, applicable_type: null },
      ];
      for (const v of voucherData) {
        await client.query(
           `INSERT INTO vouchers (title, code, type, discount_type, discount_value, min_purchase, expiry_date, description, active, applicable_type, required_points)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (code) DO NOTHING`,
           [v.title, v.code, v.type, v.discount_type, v.discount_value, v.min_purchase, v.expiry_date, v.description, v.active, v.applicable_type, v.required_points ?? 0]
        );
      }
      console.log(`[seed] Inserted ${voucherData.length} voucher rows`);
      await markSeeded("vouchers");
    }

    // Keep the rare, non-discount rewards available even when the base voucher seed
    // ran before these rewards were introduced.
    const exclusiveRewards = [
      {
        title: "Akses Nempo Elite",
        code: "ELITE3000",
        description: "Hadiah eksklusif untuk member yang berhasil mengumpulkan 3.000 poin. Bukan voucher diskon dan hanya bisa diklaim satu kali.",
        required_points: 3000,
      },
      {
        title: "Koleksi Nempo Legend",
        code: "LEGEND5000",
        description: "Reward paling langka Nempo untuk member dengan 5.000 poin. Bukan voucher diskon dan jumlah klaim dibatasi satu kali.",
        required_points: 5000,
      },
    ];
    for (const reward of exclusiveRewards) {
      await client.query(
        `INSERT INTO vouchers (title, code, type, discount_type, discount_value, min_purchase, expiry_date, description, active, applicable_type, required_points)
         VALUES ($1,$2,'point_reward','reward',0,0,NULL,$3,true,NULL,$4)
         ON CONFLICT (code) DO NOTHING`,
        [reward.title, reward.code, reward.description, reward.required_points]
      );
    }

    // ── Seed cafe campaign vouchers ──
    if (await neverSeeded("cafe_campaign_vouchers")) {
      console.log("[seed] Seeding cafe campaign vouchers...");
      const cafeVouchers = [
        {
          title: "Promo Cafe Garut – Diskon 20%",
          code: "CAFENEMPO20",
          type: "promo",
          discount_type: "persen",
          discount_value: 20,
          min_purchase: 50000,
          expiry_date: "2026-12-31",
          description: "Nikmati diskon 20% di cafe-cafe pilihan Garut! Tunjukkan kode ini kepada kasir saat memesan. Min. pembelian Rp 50.000.",
          active: true,
          applicable_type: "kuliner",
        },
        {
          title: "Nongkrong Hemat – Potongan Rp 15.000",
          code: "NGOPI15K",
          type: "promo",
          discount_type: "nominal",
          discount_value: 15000,
          min_purchase: 40000,
          expiry_date: "2026-12-31",
          description: "Potongan langsung Rp 15.000 untuk pembelian minuman di cafe partner Nempo. Min. transaksi Rp 40.000.",
          active: true,
          applicable_type: "kuliner",
        },
        {
          title: "Weekend Cafe Vibes – Diskon 15%",
          code: "CAFEWEEKEND",
          type: "promo",
          discount_type: "persen",
          discount_value: 15,
          min_purchase: 30000,
          expiry_date: "2026-12-31",
          description: "Khusus akhir pekan! Diskon 15% untuk reservasi cafe melalui Nempo. Min. pembelian Rp 30.000.",
          active: true,
          applicable_type: "kuliner",
        },
      ];
      for (const v of cafeVouchers) {
        await client.query(
          `INSERT INTO vouchers (title, code, type, discount_type, discount_value, min_purchase, expiry_date, description, active, applicable_type)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (code) DO NOTHING`,
          [v.title, v.code, v.type, v.discount_type, v.discount_value, v.min_purchase, v.expiry_date, v.description, v.active, v.applicable_type]
        );
      }
      console.log("[seed] Inserted cafe campaign vouchers");
      await markSeeded("cafe_campaign_vouchers");
    }

    // ── Seed demo cafe (Nempo Demo Cafe — contoh integrasi lengkap) ──
    if (await neverSeeded("demo_cafe_nempo")) {
      console.log("[seed] Seeding demo cafe...");
      const ins = await client.query(
        `INSERT INTO kuliner
           (name, category, image, location, description, featured, hours, active,
            phone, google_maps_url, price_range, instagram, facilities, photos)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         RETURNING id`,
        [
          "Nempo Cafe & Co-Working",
          "Cafe",
          "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop",
          "Jl. Ciledug No. 88, Garut Kota",
          "Cafe modern di pusat Garut yang menggabungkan konsep kedai kopi, co-working space, dan ruang kreatif. Menyajikan kopi Arabika single origin dari perkebunan Cikajang, lengkap dengan menu all-day breakfast, salad, dan pastri artisan. Suasana nyaman dengan koneksi Wi-Fi cepat dan stopkontak di setiap meja — favorit pekerja remote dan mahasiswa Garut. Partner resmi voucher diskon Nempo Campaign.",
          true,
          "08.00 – 23.00",
          true,
          "085200001234",
          "https://www.google.com/maps/search/Nempo+Cafe+Garut",
          "Rp 20.000 – Rp 75.000",
          "@nempocafe.garut",
          "Wi-Fi,Colokan Listrik,AC,Parkir,Toilet,Mushola,Area Outdoor,Live Acoustic",
          JSON.stringify([
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&auto=format&fit=crop",
          ]),
        ]
      );
      const id = ins.rows[0].id;
      const slug = `nempo-cafe-co-working-${id}`;
      await client.query(`UPDATE kuliner SET slug=$1 WHERE id=$2`, [slug, id]);
      console.log(`[seed] Demo cafe inserted (id=${id}, slug=${slug})`);
      await markSeeded("demo_cafe_nempo");
    }

    // ── Seed berita ──
    if (await neverSeeded("berita")) {
      console.log("[seed] Seeding berita for the first time...");
      const beritaData = [
        { title: "Pemerintah Garut Resmikan Rute Baru Wisata Kawah Darajat yang Lebih Nyaman", category: "Pariwisata", image: "", summary: "Akses menuju kawasan wisata Kawah Darajat kini lebih mudah dengan diresmikannya rute baru yang lebih lebar dan aman.", content: "Akses menuju kawasan wisata Kawah Darajat kini lebih mudah dengan diresmikannya rute baru yang lebih lebar dan aman. Pemerintah Kabupaten Garut meresmikan jalur baru tersebut dalam sebuah upacara resmi yang dihadiri oleh berbagai pejabat daerah.", author: "Humas Pemkab Garut", featured: true, active: true },
        { title: "Festival Dodol Garut 2024 Sukses Tarik Ribuan Pengunjung dari Seluruh Nusantara", category: "Budaya", image: "", summary: "Acara tahunan Festival Dodol Garut kembali digelar dan berhasil menarik perhatian wisatawan lokal maupun mancanegara.", content: "Festival Dodol Garut 2024 kembali digelar dengan meriah di alun-alun Garut. Ribuan pengunjung dari seluruh penjuru nusantara hadir untuk menyaksikan dan merasakan langsung proses pembuatan dodol tradisional khas Garut.", author: "Nempo.id News", featured: true, active: true },
        { title: "Cuaca Ekstrem, Pendakian Gunung Papandayan Ditutup Sementara", category: "Peringatan", image: "", summary: "Mengingat kondisi cuaca yang memburuk, jalur pendakian Gunung Papandayan ditutup sementara untuk keselamatan pengunjung.", content: "Pihak pengelola Gunung Papandayan bersama BKSDA Jawa Barat mengumumkan penutupan sementara jalur pendakian menyusul kondisi cuaca ekstrem yang berpotensi membahayakan keselamatan para pendaki.", author: "BKSDA Jabar", featured: false, active: true },
        { title: "Komunitas Pemuda Lestarikan Pencak Silat Lewat Sanggar Seni Baru", category: "Budaya", image: "", summary: "Sebuah komunitas pemuda di Garut mendirikan sanggar seni untuk melestarikan kesenian Pencak Silat yang semakin tergerus zaman.", content: "Komunitas Garut Bergerak mendirikan Sanggar Seni Pencak Silat di Kecamatan Tarogong sebagai upaya pelestarian seni bela diri tradisional Sunda. Sanggar ini terbuka untuk umum dan mengajarkan berbagai aliran pencak silat Garut.", author: "Seni Budaya Garut", featured: false, active: true },
        { title: "Investasi Hotel Bintang Empat Pertama di Pusat Kota Garut Segera Dimulai", category: "Ekonomi", image: "", summary: "Sebuah grup hospitality nasional berencana membangun hotel berbintang pertama di pusat Kota Garut senilai Rp 250 miliar.", content: "Grup hospitality nasional PT Nusantara Hospitality Group mengumumkan rencana pembangunan hotel bintang empat di jantung Kota Garut. Investasi senilai Rp 250 miliar ini diharapkan dapat mendongkrak sektor pariwisata dan ekonomi lokal.", author: "Bisnis Garut", featured: false, active: true },
        { title: "Kuliner Soto Garut Kini Merambah Pasar Jakarta dan Bandung", category: "Kuliner", image: "", summary: "Popularitas soto khas Garut terus meluas, dengan banyak warung baru bermunculan di kota-kota besar Jawa Barat.", content: "Soto Garut dengan cita rasa kuah bening yang khas kini semakin populer di luar wilayah Garut. Puluhan warung Soto Garut telah berdiri di Jakarta dan Bandung, membawa cita rasa autentik kuliner khas Garut ke kota-kota besar.", author: "Redaksi Nempo", featured: false, active: true },
        { title: "Domba Garut Adu Ketangkasan, Tradisi yang Terus Hidup di Modernisasi", category: "Tradisi", image: "", summary: "Adu ketangkasan domba Garut masih menjadi atraksi budaya andalan yang menarik ribuan penonton setiap pekannya.", content: "Di tengah derasnya arus modernisasi, tradisi adu ketangkasan domba Garut tetap bertahan dan diminati masyarakat. Setiap akhir pekan, arena adu domba di berbagai kecamatan di Garut selalu dipenuhi ribuan penonton.", author: "Liputan Khusus", featured: true, active: true },
        { title: "Garut Siap Jadi Kota Cerdas Pariwisata dengan Teknologi Digital Terkini", category: "Teknologi", image: "", summary: "Pemerintah sedang menggodok berbagai inovasi digital untuk mendukung ekosistem pariwisata di Garut.", content: "Dinas Komunikasi dan Informatika Kabupaten Garut bersama Dinas Pariwisata tengah mengembangkan platform digital terintegrasi untuk mendukung ekosistem pariwisata. Sistem ini mencakup booking online, peta wisata digital, dan informasi real-time.", author: "Dinas Kominfo", featured: false, active: true },
      ];
      for (const b of beritaData) {
        await client.query(
          `INSERT INTO berita (title, category, image, summary, content, author, featured, active)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [b.title, b.category, b.image, b.summary, b.content, b.author, b.featured, b.active]
        );
      }
      console.log(`[seed] Inserted ${beritaData.length} berita rows`);
      await markSeeded("berita");
    }

    // ── Seed talents ──
    if (await neverSeeded("talents")) {
      console.log("[seed] Seeding talents for the first time...");
      const talentsData = [
        { name:"Rizky Aditya",    role:"MC & Host",          category:"mc",      tagline:"Penuh energi, siap pimpin panggung apapun.",           instagram:"@rizky.mc.garut",   tags:["Pernikahan","Corporate","Festival"],   verified:true,  featured:true,  bio:"MC profesional dengan pengalaman lebih dari 5 tahun di berbagai event Garut. Spesialis wedding, corporate, dan festival budaya.", wa:"6281234567890", photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&q=80",  sort_order:1  },
        { name:"Rendi Saputra",   role:"MC & Presenter",     category:"mc",      tagline:"Formal atau santai, selalu on point.",                 instagram:"@rendi.host",       tags:["Seminar","Wisuda","Podcast"],          verified:false, featured:false, bio:"Presenter muda berbakat dari Garut yang piawai membawakan acara seminar, wisuda, dan podcast dengan gaya yang segar.", wa:"6281234567891", photo:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=480&q=80",  sort_order:2  },
        { name:"Ahmad Fauzi",     role:"Gitaris",             category:"band",    tagline:"Dari melodi lembut hingga riff yang mengguncang.",      instagram:"@fauzi.strings",    tags:["Rock","Jazz","Akustik"],               verified:true,  featured:false, bio:"Gitaris berpengalaman yang menguasai berbagai genre dari akustik, jazz, hingga rock. Tampil di lebih dari 100 event.", wa:"6281234567892", photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=480&q=80",  sort_order:3  },
        { name:"Fajar Maulana",   role:"Drumer",              category:"band",    tagline:"Groove yang pas, beat yang bikin panggung hidup.",     instagram:"@fajar.drum",       tags:["Funk","Pop","Rock"],                   verified:true,  featured:true,  bio:"Drumer energetik spesialis funk dan pop rock. Ritme yang solid dan presisi menjadi kekuatan utamanya di atas panggung.", wa:"6281234567893", photo:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=480&q=80",  sort_order:4  },
        { name:"Dian Permana",    role:"Bassist",             category:"band",    tagline:"Fondasi musik yang kuat di balik setiap penampilan.",  instagram:"@dian.bass",        tags:["Jazz","Blues","Pop"],                  verified:false, featured:false, bio:"Bassist jazz dan blues yang memperkuat fondasi musik di setiap penampilan. Berpengalaman di berbagai festival musik Garut.", wa:"6281234567894", photo:"https://images.unsplash.com/photo-1463453091185-61582044d556?w=480&q=80",  sort_order:5  },
        { name:"Nadia Putri",     role:"Penari Tradisional",  category:"budaya",  tagline:"Gerak tubuh yang bercerita tentang tanah Sunda.",      instagram:"@nadia.tari",       tags:["Jaipongan","Tari Sunda","Festival"],   verified:true,  featured:true,  bio:"Penari tradisional Sunda yang sudah tampil di berbagai festival budaya tingkat nasional. Spesialisasi tari Jaipongan dan tari Sunda klasik.", wa:"6281234567895", photo:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=480&q=80",  sort_order:6  },
        { name:"Lila Agustina",   role:"Seniman Budaya",      category:"budaya",  tagline:"Melestarikan budaya lewat karya yang memukau.",        instagram:"@lila.seni",        tags:["Angklung","Topeng","Wayang"],          verified:true,  featured:false, bio:"Seniman serba bisa yang menguasai angklung, topeng, dan wayang. Aktif dalam pelestarian seni budaya Sunda di Garut.", wa:"6281234567896", photo:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=480&q=80",  sort_order:7  },
        { name:"Siti Nurhasanah", role:"Vokalis",             category:"vokalis", tagline:"Suara Garut yang menembus batas.",                     instagram:"@siti.nrhs",        tags:["Sunda Pop","R&B","Akustik"],           verified:true,  featured:true,  bio:"Vokalis berbakat dengan suara khas Sunda yang merdu. Sudah rekaman beberapa single dan tampil di berbagai panggung besar Garut.", wa:"6281234567897", photo:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=480&q=80",  sort_order:8  },
        { name:"Dinda Ramadhani", role:"Vokalis",             category:"vokalis", tagline:"Suara hangat yang cocok untuk setiap suasana panggung.",instagram:"@dinda.vocal",      tags:["Pop","Ballad","Jazz"],                 verified:true,  featured:false, bio:"Vokalis pop dan jazz dengan suara hangat yang adaptif. Cocok untuk wedding, corporate event, hingga konser akustik.", wa:"6281234567898", photo:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=480&q=80",  sort_order:9  },
        { name:"Bunga Cantika",   role:"Vokalis & Performer", category:"vokalis", tagline:"Ekspresif, enerjik, dan selalu membekas di hati.",    instagram:"@bunga.vocal",      tags:["Pop","Dangdut","Folk"],                verified:false, featured:false, bio:"Performer energetik yang menggabungkan vokal kuat dengan aksi panggung yang memukau. Spesialis pop, dangdut, dan folk.", wa:"6281234567899", photo:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=480&q=80",  sort_order:10 },
      ];
      for (const t of talentsData) {
        await client.query(
          `INSERT INTO talents (name, role, category, tagline, instagram, tags, verified, featured, bio, wa, photo, sort_order, active)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
          [t.name, t.role, t.category, t.tagline, t.instagram, t.tags, t.verified, t.featured, t.bio, t.wa, t.photo, t.sort_order, true]
        );
      }
      console.log(`[seed] Inserted ${talentsData.length} talent rows`);
      await markSeeded("talents");
    }

    // ── Seed influencers ──
    if (await neverSeeded("influencers")) {
      console.log("[seed] Seeding influencers for the first time...");
      for (const inf of influencerData) {
        await client.query(
          `INSERT INTO influencers (name, handle, instagram, tiktok, verified, color, color2, niches, location, rating, rate, bio, photos, active, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
          [inf.name, inf.handle, inf.instagram, inf.tiktok, inf.verified, inf.color, inf.color2,
           inf.niches, inf.location, inf.rating, inf.rate, inf.bio, inf.photos, true, inf.sort_order]
        );
      }
      console.log(`[seed] Inserted ${influencerData.length} influencer rows`);
      await markSeeded("influencers");
    }

    // ── Seed penginapan ──
    if (await neverSeeded("penginapan")) {
      console.log("[seed] Penginapan — seeding data...");
      const penginapanData = [
        { name: "Kampung Sampireun Resort", category: "Resort", image: "", location: "Samarang, Garut", description: "Resort mewah di atas danau dengan saung-saung tradisional Sunda, suasana alam yang tenang dan romantis.", amenities: ["Kolam Renang", "Spa", "Restoran", "WiFi", "Parkir", "Sarapan Termasuk"], price_per_night: 850000, featured: true, active: true },
        { name: "Danau Dariza Resort", category: "Resort", image: "", location: "Tarogong Kaler, Garut", description: "Resort keluarga dengan danau buatan dan berbagai wahana air, cocok untuk liburan bersama anak-anak.", amenities: ["Kolam Renang", "Restoran", "Taman Bermain", "WiFi", "Sarapan Termasuk"], price_per_night: 650000, featured: true, active: true },
        { name: "Favehotel Cimanuk", category: "Hotel", image: "", location: "Tarogong Kidul, Garut", description: "Hotel bintang 3 modern di pusat kota Garut, dekat pusat perbelanjaan dan kuliner khas Garut.", amenities: ["AC", "TV", "Restoran", "Gym", "WiFi"], price_per_night: 450000, featured: true, active: true },
        { name: "Villa Hijau Garut", category: "Villa", image: "", location: "Cilawu, Garut", description: "Villa pribadi dengan view pegunungan yang memukau, lengkap dengan taman luas dan area BBQ.", amenities: ["Dapur", "Ruang Keluarga", "Taman Luas", "BBQ", "Parkir"], price_per_night: 750000, featured: true, active: true },
        { name: "Homestay Pak Asep", category: "Homestay", image: "", location: "Bayongbong, Garut", description: "Homestay nyaman di desa dengan suasana pedesaan autentik, pemilik yang ramah dan sarapan lezat.", amenities: ["Sarapan", "WiFi", "Parkir", "Dapur Bersama"], price_per_night: 200000, featured: true, active: true },
        { name: "The Valley Hotel Papandayan", category: "Hotel", image: "", location: "Cisurupan, Garut", description: "Hotel dekat kawasan wisata Gunung Papandayan dengan pemandian air panas alami.", amenities: ["AC", "TV", "Restoran", "Hot Spring", "WiFi", "Sarapan Termasuk"], price_per_night: 550000, featured: false, active: true },
        { name: "Villa Puncak Darajat", category: "Villa", image: "", location: "Pasirwangi, Garut", description: "Villa premium dengan private pool dan jacuzzi menghadap kawah Darajat, pengalaman menginap terbaik.", amenities: ["Private Pool", "Jacuzzi", "Dapur", "BBQ", "Parkir"], price_per_night: 1200000, featured: false, active: true },
        { name: "Saung Tirta Cisarua", category: "Homestay", image: "", location: "Cisarua, Garut", description: "Penginapan tradisional di tepi sungai dengan suasana alam yang asri dan tenang.", amenities: ["Sarapan", "WiFi", "Taman"], price_per_night: 180000, featured: false, active: true },
      ];
      for (const p of penginapanData) {
        await client.query(
          `INSERT INTO penginapan (name, category, image, location, description, amenities, price_per_night, featured, active)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [p.name, p.category, p.image, p.location, p.description, p.amenities, p.price_per_night, p.featured, p.active]
        );
      }
      console.log(`[seed] Inserted ${penginapanData.length} penginapan rows`);
      await markSeeded("penginapan");
    }

  } finally {
    client.release();
  }
}
