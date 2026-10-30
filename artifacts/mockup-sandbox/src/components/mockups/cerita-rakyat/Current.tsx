import "./_group.css";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  ChevronDown,
  Clock3,
  Feather,
  MapPin,
  Search,
  X,
} from "lucide-react";

type Story = {
  id: string;
  title: string;
  place: string;
  area: string;
  category: string;
  duration: string;
  excerpt: string;
  lesson: string;
  color: string;
  mark: string;
  body: string[];
};

const stories: Story[] = [
  {
    id: "situ-bagendit",
    title: "Legenda Situ Bagendit",
    place: "Garut",
    area: "Garut",
    category: "Legenda tempat",
    duration: "6 menit",
    excerpt: "Kisah tentang keserakahan, kepedulian, dan asal mula danau yang kini menjadi salah satu ikon Garut.",
    lesson: "Harta tidak berarti jika membuat kita lupa pada sesama.",
    color: "#0f766e",
    mark: "SB",
    body: [
      "Di sebuah kampung yang subur, hiduplah seorang janda kaya bernama Nyai Endit. Ia memiliki banyak harta, tetapi terkenal pelit dan tidak mau menolong warga yang sedang kesusahan.",
      "Suatu hari, seorang pengembara tua datang meminta sedikit makanan. Nyai Endit menolaknya dengan kasar. Tak lama kemudian, air memancar dari tanah dan terus membesar. Warga berusaha menyelamatkan diri, sementara rumah dan harta Nyai Endit ikut tersapu air.",
      "Tempat itu kemudian dikenal sebagai Situ Bagendit. Cerita ini diwariskan sebagai pengingat bahwa rezeki akan lebih berarti jika dibagikan dan lingkungan harus dijaga bersama.",
    ],
  },
  {
    id: "lutung-kasarung",
    title: "Lutung Kasarung",
    place: "Tatar Sunda",
    area: "Tatar Sunda",
    category: "Kisah kerajaan",
    duration: "8 menit",
    excerpt: "Perjalanan Purbasari menemukan keberanian, ketulusan, dan cinta yang tidak diukur dari rupa.",
    lesson: "Ketulusan dan kebaikan akan menemukan jalannya sendiri.",
    color: "#7c3aed",
    mark: "LK",
    body: [
      "Purbasari adalah putri bungsu yang lembut hati. Kakaknya, Purbararang, merasa iri ketika Purbasari dipilih untuk memimpin kerajaan. Berbagai cara dilakukan agar Purbasari terlihat tidak layak.",
      "Dalam pengasingan, Purbasari bertemu seekor lutung yang selalu menolongnya. Lutung itu sebenarnya Guruminda, seorang pangeran yang sedang menjalani hukuman. Ia membantu Purbasari membangun kehidupan baru dengan penuh kesabaran.",
      "Pada akhirnya, kebenaran terungkap. Purbasari kembali ke kerajaan dan membuktikan bahwa pemimpin yang baik lahir dari hati yang tulus, bukan dari penampilan atau ambisi.",
    ],
  },
  {
    id: "nyi-pohaci",
    title: "Nyi Pohaci Sanghyang Asri",
    place: "Tanah Sunda",
    area: "Tatar Sunda",
    category: "Asal-usul",
    duration: "7 menit",
    excerpt: "Cerita tentang sosok yang dipercaya menjadi sumber kesuburan dan pangan bagi masyarakat Sunda.",
    lesson: "Alam adalah titipan yang perlu dirawat dan dihormati.",
    color: "#b45309",
    mark: "NP",
    body: [
      "Nyi Pohaci Sanghyang Asri dikenal dalam kepercayaan Sunda sebagai sosok yang membawa kehidupan dan kesuburan. Kisahnya menyatukan manusia, tanah, air, dan tumbuhan dalam satu hubungan yang saling menjaga.",
      "Dari pengorbanan dan perjalanan Nyi Pohaci, tumbuh berbagai tanaman yang bermanfaat bagi kehidupan. Padi menjadi lambang utama kesejahteraan karena memberi makan banyak orang.",
      "Bagi masyarakat Sunda, kisah ini bukan hanya cerita asal-usul. Ia juga menjadi ajakan untuk menghargai petani, menjaga tanah, dan tidak mengambil alam secara berlebihan.",
    ],
  },
  {
    id: "sangkuriang",
    title: "Sangkuriang",
    place: "Jawa Barat",
    area: "Bandung Raya",
    category: "Legenda alam",
    duration: "8 menit",
    excerpt: "Legenda tentang asal mula Tangkuban Parahu dan akibat dari keputusan yang diambil tanpa mengenal kebenaran.",
    lesson: "Kenali kebenaran sebelum bertindak dalam amarah.",
    color: "#1d4ed8",
    mark: "SK",
    body: [
      "Sangkuriang tumbuh sebagai pemuda pemberani yang gemar berburu. Dalam sebuah perjalanan, ia tidak sengaja membunuh Tumang, anjing yang sebenarnya adalah ayahnya sendiri. Peristiwa itu membuatnya pergi jauh dari rumah.",
      "Bertahun-tahun kemudian, Sangkuriang kembali dan bertemu Dayang Sumbi tanpa menyadari bahwa perempuan itu adalah ibunya. Mereka saling menyukai, sampai sebuah tanda membuat Dayang Sumbi mengenali anaknya.",
      "Dayang Sumbi meminta Sangkuriang membuat danau serta perahu dalam satu malam. Saat usaha itu hampir berhasil, ia menggagalkannya dengan membuat suasana seolah-olah pagi telah tiba. Perahu yang ditendang kemudian dipercaya menjadi Tangkuban Parahu.",
    ],
  },
  {
    id: "mundinglaya",
    title: "Mundinglaya Dikusumah",
    place: "Tatar Sunda",
    area: "Tatar Sunda",
    category: "Kepahlawanan",
    duration: "9 menit",
    excerpt: "Kisah kepahlawanan seorang putra kerajaan yang menempuh perjalanan jauh demi menyelamatkan negerinya.",
    lesson: "Keberanian menjadi berarti saat digunakan untuk melindungi orang lain.",
    color: "#be123c",
    mark: "MD",
    body: [
      "Mundinglaya Dikusumah adalah putra kerajaan yang dikenal tenang dan berani. Ia mendapat tugas mencari Layang Salaka Domas, benda pusaka yang dipercaya dapat membawa keselamatan bagi negeri.",
      "Perjalanannya penuh rintangan. Ia harus melewati tempat-tempat asing dan menghadapi kekuatan besar dengan akal, kesetiaan, dan keberanian. Ia tidak berangkat untuk mencari kemuliaan pribadi.",
      "Setelah pusaka berhasil dibawa pulang, kedamaian kembali hadir. Kisah Mundinglaya terus diceritakan sebagai teladan tentang tanggung jawab seorang pemimpin.",
    ],
  },
  {
    id: "situ-cangkuang",
    title: "Legenda Situ Cangkuang",
    place: "Leles, Garut",
    area: "Garut",
    category: "Legenda tempat",
    duration: "6 menit",
    excerpt: "Kisah tentang kesetiaan, sebuah danau yang tenang, dan jejak kehidupan lama di sekitar Candi Cangkuang.",
    lesson: "Warisan masa lalu perlu dirawat agar tetap bercerita.",
    color: "#0369a1",
    mark: "SC",
    body: [
      "Di sekitar sebuah danau yang dikelilingi perbukitan, masyarakat hidup berdampingan dengan alam dan peninggalan leluhur. Nama Cangkuang dihubungkan dengan tanaman yang banyak tumbuh di kawasan itu.",
      "Dari generasi ke generasi, kisah Situ Cangkuang diceritakan bersama cerita tentang kampung, makam leluhur, dan candi yang menjadi pengingat bahwa kehidupan hari ini berdiri di atas jejak masa lalu.",
      "Legenda ini mengajak kita menjaga danau, situs budaya, dan lingkungan agar semuanya tetap bisa dipelajari oleh generasi berikutnya.",
    ],
  },
  {
    id: "nyi-anteh",
    title: "Nyi Anteh Sang Penunggu Bulan",
    place: "Bandung Raya",
    area: "Bandung Raya",
    category: "Legenda langit",
    duration: "7 menit",
    excerpt: "Kisah seorang perempuan yang dipercaya menjahit di bulan dan menjadi bagian dari imajinasi masyarakat Sunda.",
    lesson: "Kasih sayang dan ketekunan dapat hidup dalam cerita lintas generasi.",
    color: "#4338ca",
    mark: "NA",
    body: [
      "Nyi Anteh dikenal sebagai sosok perempuan yang tekun menenun dan menjahit. Dalam versi cerita yang berkembang di masyarakat Sunda, ia memiliki kucing kesayangan bernama Candramawat.",
      "Karena sebuah peristiwa, Nyi Anteh dipercaya terangkat ke bulan. Dari bumi, bayangannya tampak sedang duduk dan bekerja, ditemani kucing yang setia.",
      "Kisah ini menjadi cara masyarakat dahulu menjelaskan bayangan di bulan sekaligus menyimpan pesan tentang kesetiaan, ketekunan, dan kerinduan.",
    ],
  },
  {
    id: "talaga-warna",
    title: "Sasakala Talaga Warna",
    place: "Puncak, Bogor",
    area: "Bogor Raya",
    category: "Asal-usul danau",
    duration: "6 menit",
    excerpt: "Legenda tentang sebuah telaga yang berubah warna setelah kesombongan dan kesedihan memenuhi istana.",
    lesson: "Rasa syukur lebih berharga daripada kemewahan.",
    color: "#0f766e",
    mark: "TW",
    body: [
      "Di sebuah kerajaan yang makmur, hiduplah seorang putri yang disayangi seluruh rakyat. Pada hari ulang tahunnya, raja dan rakyat menyiapkan hadiah yang sangat indah untuknya.",
      "Namun sang putri menolak hadiah itu dengan sikap sombong. Kesedihan rakyat dan tangis raja kemudian dipercaya menggenangi tempat tersebut hingga menjadi telaga.",
      "Air telaga tampak berwarna-warni ketika memantulkan cahaya dan pepohonan. Cerita ini mengingatkan bahwa kemewahan tidak boleh membuat hati lupa bersyukur.",
    ],
  },
  {
    id: "prabu-siliwangi",
    title: "Prabu Siliwangi",
    place: "Pajajaran, Bogor",
    area: "Bogor Raya",
    category: "Kisah kerajaan",
    duration: "8 menit",
    excerpt: "Kisah kepemimpinan raja Pajajaran yang hidup dalam ingatan dan berbagai versi tradisi Sunda.",
    lesson: "Pemimpin dikenang karena perlindungan dan kebijaksanaannya.",
    color: "#92400e",
    mark: "PS",
    body: [
      "Prabu Siliwangi merupakan tokoh yang sangat dikenal dalam tradisi lisan Sunda dan sering dihubungkan dengan Kerajaan Pajajaran. Kisahnya berkembang dalam banyak versi di berbagai daerah Jawa Barat.",
      "Ia digambarkan sebagai pemimpin yang menjaga rakyat, menghormati alam, dan memiliki hubungan kuat dengan hutan serta gunung. Karena itu, namanya hadir dalam banyak sasakala dan tempat yang dianggap bersejarah.",
      "Cerita Prabu Siliwangi sebaiknya dibaca sebagai warisan tradisi lisan yang memiliki beragam versi, bukan sebagai satu catatan sejarah tunggal.",
    ],
  },
  {
    id: "rara-santang",
    title: "Nyi Mas Rara Santang",
    place: "Cirebon",
    area: "Cirebon Raya",
    category: "Kisah kerajaan",
    duration: "8 menit",
    excerpt: "Perjalanan seorang putri Pajajaran yang menjadi bagian penting dari kisah awal Cirebon.",
    lesson: "Perjalanan hidup dapat mempertemukan berbagai budaya.",
    color: "#be123c",
    mark: "RS",
    body: [
      "Nyi Mas Rara Santang dikenal dalam berbagai babad sebagai putri Pajajaran yang melakukan perjalanan jauh. Di sepanjang perjalanan, ia bertemu dengan tokoh-tokoh dan tradisi dari berbagai wilayah.",
      "Kisahnya kemudian terhubung dengan perkembangan Cirebon dan hubungan keluarga yang melahirkan tokoh-tokoh penting dalam sejarah kawasan pesisir utara Jawa Barat.",
      "Cerita ini memperlihatkan bagaimana budaya Sunda, pesisir, dan Islam bertemu dalam ingatan masyarakat Cirebon.",
    ],
  },
  {
    id: "nyi-mas-gandasari",
    title: "Nyi Mas Gandasari",
    place: "Cirebon",
    area: "Cirebon Raya",
    category: "Kisah kepahlawanan",
    duration: "7 menit",
    excerpt: "Cerita tentang seorang perempuan tangguh yang dikenang karena ilmu, keberanian, dan pengabdiannya.",
    lesson: "Keberanian tidak ditentukan oleh jenis kelamin.",
    color: "#7c2d12",
    mark: "NG",
    body: [
      "Nyi Mas Gandasari dikenal dalam tradisi Cirebon sebagai sosok perempuan yang cerdas, berani, dan memiliki kemampuan bela diri. Ia tumbuh dalam lingkungan yang mempertemukan banyak kebudayaan.",
      "Dalam sejumlah versi cerita, ia menjalani ujian dan pertarungan untuk membuktikan keteguhan hati serta kemampuannya. Ia tidak hanya dikenang karena kecantikan, tetapi juga karena keberanian.",
      "Kisah Nyi Mas Gandasari menjadi teladan bahwa perempuan dapat mengambil peran penting dalam menjaga masyarakat dan menyebarkan kebaikan.",
    ],
  },
  {
    id: "ciung-wanara",
    title: "Ciung Wanara",
    place: "Galuh, Ciamis",
    area: "Priangan Timur",
    category: "Kisah kerajaan",
    duration: "8 menit",
    excerpt: "Legenda Kerajaan Galuh tentang asal-usul seorang pemimpin yang harus menemukan identitas dan haknya.",
    lesson: "Kebenaran akan menemukan jalannya meski sempat disembunyikan.",
    color: "#166534",
    mark: "CW",
    body: [
      "Ciung Wanara adalah tokoh dalam legenda Kerajaan Galuh. Sejak kecil ia terpisah dari lingkungan istana dan tumbuh tanpa mengetahui asal-usulnya.",
      "Dengan kecerdasan, keberanian, dan bantuan orang-orang yang tulus, ia akhirnya mengetahui jati dirinya. Pertemuannya dengan lingkungan kerajaan membuka kembali kebenaran yang lama disembunyikan.",
      "Cerita ini mengajarkan bahwa kekuasaan tidak boleh dibangun di atas tipu daya dan bahwa rakyat berhak mendapatkan pemimpin yang adil.",
    ],
  },
  {
    id: "situ-lengkong-panjalu",
    title: "Sasakala Situ Lengkong Panjalu",
    place: "Panjalu, Ciamis",
    area: "Priangan Timur",
    category: "Legenda tempat",
    duration: "6 menit",
    excerpt: "Kisah telaga dan pulau kecil yang menjadi bagian dari warisan budaya Panjalu.",
    lesson: "Tempat yang dijaga bersama akan menjadi sumber ingatan bersama.",
    color: "#0369a1",
    mark: "SL",
    body: [
      "Situ Lengkong Panjalu dikelilingi oleh kisah tentang kerajaan, tokoh leluhur, dan perjalanan yang membawa benda pusaka ke kawasan Panjalu.",
      "Pulau kecil di tengah situ dan lingkungan sekitarnya kemudian menjadi bagian penting dari tradisi masyarakat. Cerita yang menyertainya diwariskan bersama penghormatan kepada leluhur dan alam.",
      "Sasakala ini mengajak kita melihat danau bukan hanya sebagai tempat wisata, tetapi juga sebagai ruang budaya yang perlu dirawat.",
    ],
  },
  {
    id: "karang-nini",
    title: "Legenda Karang Nini",
    place: "Pangandaran",
    area: "Priangan Timur",
    category: "Legenda pantai",
    duration: "6 menit",
    excerpt: "Kisah sepasang suami istri yang dipercaya berubah menjadi batu karena kesetiaan dan penantian panjang.",
    lesson: "Kesetiaan adalah janji yang dijaga dalam suka dan duka.",
    color: "#0f766e",
    mark: "KN",
    body: [
      "Di pesisir Pangandaran, masyarakat mengenal kisah sepasang suami istri yang hidup sederhana sebagai nelayan. Suatu hari, sang suami pergi melaut dan tak kunjung kembali.",
      "Sang istri terus menunggu di tepi pantai. Karena penantian yang sangat panjang, keduanya dipercaya berubah menjadi batu yang saling berhadapan.",
      "Karang Nini kemudian menjadi simbol kesetiaan dan pengingat agar manusia menghormati laut serta tidak melupakan orang-orang yang menunggu di rumah.",
    ],
  },
  {
    id: "talaga-manggung",
    title: "Sasakala Talaga Manggung",
    place: "Talaga, Majalengka",
    area: "Sumedang-Majalengka",
    category: "Legenda tempat",
    duration: "6 menit",
    excerpt: "Cerita tentang telaga, keluarga kerajaan, dan pesan untuk menjaga keselarasan dengan alam.",
    lesson: "Keserakahan dapat merusak rumah yang dibangun bersama.",
    color: "#a16207",
    mark: "TM",
    body: [
      "Talaga Manggung dikenal melalui cerita yang menghubungkan sebuah telaga dengan keluarga kerajaan dan perjalanan leluhur masyarakat setempat.",
      "Dalam berbagai versi, muncul konflik tentang harta, kekuasaan, dan janji yang dilanggar. Peristiwa besar kemudian mengubah tempat tinggal mereka dan membentuk telaga yang dikenang hingga kini.",
      "Sasakala ini diwariskan sebagai pengingat untuk menjaga hubungan keluarga, lingkungan, dan amanah dari para pendahulu.",
    ],
  },
  {
    id: "prabu-geusan-ulun",
    title: "Prabu Geusan Ulun",
    place: "Sumedang Larang",
    area: "Sumedang-Majalengka",
    category: "Kisah kerajaan",
    duration: "8 menit",
    excerpt: "Kisah kepemimpinan Sumedang Larang dan pusaka yang menjadi lambang identitas masyarakat Sumedang.",
    lesson: "Identitas tumbuh dari keberanian menjaga nilai dan amanah.",
    color: "#9f1239",
    mark: "GU",
    body: [
      "Prabu Geusan Ulun dikenal sebagai salah satu tokoh penting dalam kisah Sumedang Larang. Cerita tentangnya berkaitan dengan kepemimpinan, hubungan antarwilayah, dan perjalanan pusaka kerajaan.",
      "Dalam tradisi Sumedang, pusaka dan kisah kerajaan tidak hanya menyimpan kebanggaan, tetapi juga tanggung jawab untuk menjaga martabat serta kesejahteraan masyarakat.",
      "Kisah ini mengajak pembaca memahami bahwa warisan budaya hidup melalui perawatan, penghormatan, dan pengetahuan yang diteruskan.",
    ],
  },
  {
    id: "ratu-laut-selatan",
    title: "Ratu Laut Selatan",
    place: "Pelabuhan Ratu, Sukabumi",
    area: "Sukabumi-Cianjur",
    category: "Legenda pesisir",
    duration: "7 menit",
    excerpt: "Legenda pesisir selatan yang mengajarkan penghormatan kepada laut dan kekuatan alam.",
    lesson: "Alam memiliki kekuatan yang harus dihormati, bukan ditantang.",
    color: "#1e3a8a",
    mark: "RL",
    body: [
      "Masyarakat pesisir selatan Jawa mengenal berbagai versi cerita tentang Ratu Laut Selatan, sosok yang dipercaya menjaga keseimbangan dan kekuatan laut.",
      "Kisah ini hidup bersama aturan, pantangan, dan nasihat bagi orang yang beraktivitas di pantai. Laut dipandang sebagai ruang yang indah sekaligus memiliki bahaya.",
      "Terlepas dari versinya, pesan yang paling penting adalah menjaga keselamatan, menghormati alam, dan tidak merusak kawasan pesisir.",
    ],
  },
  {
    id: "gunung-padang",
    title: "Sasakala Gunung Padang",
    place: "Cianjur",
    area: "Sukabumi-Cianjur",
    category: "Legenda pegunungan",
    duration: "7 menit",
    excerpt: "Cerita tentang teras batu, leluhur, dan hubungan masyarakat dengan lanskap pegunungan Cianjur.",
    lesson: "Tempat tua perlu dipelajari dengan hormat dan kehati-hatian.",
    color: "#475569",
    mark: "GP",
    body: [
      "Gunung Padang dikelilingi oleh cerita tentang leluhur, bangunan batu, dan tempat yang dianggap istimewa oleh masyarakat sekitar. Kisah-kisahnya berkembang dalam banyak versi.",
      "Sebagian cerita menghubungkan susunan teras batu dengan perjalanan para pendahulu dan ritual penghormatan kepada alam. Pengetahuan lokal tersebut hidup berdampingan dengan penelitian arkeologi.",
      "Legenda ini mengajak kita menjaga situs, mendengar cerita warga, dan membedakan antara tradisi lisan dengan kesimpulan ilmiah.",
    ],
  },
  {
    id: "situ-wanayasa",
    title: "Legenda Situ Wanayasa",
    place: "Wanayasa, Purwakarta",
    area: "Purwakarta-Subang",
    category: "Legenda tempat",
    duration: "6 menit",
    excerpt: "Kisah telaga di kaki pegunungan yang menyimpan pesan tentang keselarasan manusia dan alam.",
    lesson: "Air dan tanah adalah titipan yang harus dijaga bersama.",
    color: "#047857",
    mark: "SW",
    body: [
      "Situ Wanayasa berada di kawasan yang dikelilingi perbukitan dan perkebunan. Masyarakat setempat menyimpan cerita tentang asal-usul telaga dan hubungan manusia dengan mata air.",
      "Dalam berbagai versi sasakala, telaga menjadi pengingat bahwa keserakahan dan kelalaian dapat mengganggu keseimbangan alam.",
      "Kisah ini relevan untuk dibaca kembali saat kita menjaga sumber air, pepohonan, dan ruang hidup di sekitar danau.",
    ],
  },
  {
    id: "nyi-endang-darma-ayu",
    title: "Nyi Endang Darma Ayu",
    place: "Indramayu",
    area: "Pantura Jawa Barat",
    category: "Asal-usul daerah",
    duration: "7 menit",
    excerpt: "Kisah tokoh perempuan yang namanya dipercaya menjadi asal-usul nama Indramayu.",
    lesson: "Sebuah daerah dibentuk oleh perjalanan dan keberanian banyak orang.",
    color: "#c2410c",
    mark: "ED",
    body: [
      "Dalam cerita yang berkembang di Indramayu, Nyi Endang Darma Ayu adalah tokoh perempuan yang melakukan perjalanan dan membuka hubungan dengan masyarakat di wilayah pesisir.",
      "Nama dan kisahnya kemudian dihubungkan dengan asal-usul Indramayu. Seperti banyak cerita asal-usul daerah, terdapat beberapa versi yang diwariskan oleh masyarakat.",
      "Cerita ini mengingatkan bahwa identitas pesisir terbentuk dari pertemuan, perjalanan, dan kerja bersama.",
    ],
  },
  {
    id: "asal-usul-karawang",
    title: "Sasakala Asal-usul Karawang",
    place: "Karawang",
    area: "Pantura Jawa Barat",
    category: "Asal-usul daerah",
    duration: "6 menit",
    excerpt: "Kisah tentang bentang sawah dan perjalanan masyarakat yang membentuk nama serta identitas Karawang.",
    lesson: "Tanah yang subur membawa tanggung jawab untuk dirawat.",
    color: "#15803d",
    mark: "KR",
    body: [
      "Karawang dikenal sebagai wilayah sawah yang luas. Masyarakat menyimpan beragam cerita tentang asal nama daerah dan pembukaan lahan yang kemudian menjadi sumber pangan.",
      "Dalam sasakala yang berkembang, perjalanan tokoh dan perubahan bentang alam menjadi bagian dari penjelasan tentang kehidupan masyarakat di sepanjang sungai dan pesisir.",
      "Cerita ini mengajak kita menghargai petani, irigasi, dan tanah yang selama berabad-abad menopang kehidupan.",
    ],
  },
  {
    id: "batu-hiu",
    title: "Legenda Batu Hiu",
    place: "Pangandaran",
    area: "Priangan Timur",
    category: "Legenda pantai",
    duration: "6 menit",
    excerpt: "Kisah batu karang berbentuk sirip hiu yang menjadi salah satu penanda pesisir selatan Pangandaran.",
    lesson: "Keindahan alam perlu dinikmati tanpa merusaknya.",
    color: "#0e7490",
    mark: "BH",
    body: [
      "Di pesisir Pangandaran, terdapat batu karang yang dari kejauhan tampak seperti sirip hiu. Masyarakat kemudian mengaitkan bentuknya dengan berbagai cerita tentang laut.",
      "Legenda Batu Hiu hidup sebagai cerita wisata sekaligus pengingat bahwa pantai menyimpan kekuatan, keindahan, dan bahaya yang perlu dihormati.",
      "Saat berkunjung, menjaga kebersihan, mengikuti petunjuk keselamatan, dan tidak merusak karang adalah cara terbaik menghormati kisahnya.",
    ],
  },
];

const regions = [
  "Semua",
  "Garut",
  "Bandung Raya",
  "Bogor Raya",
  "Cirebon Raya",
  "Priangan Timur",
  "Sumedang-Majalengka",
  "Sukabumi-Cianjur",
  "Purwakarta-Subang",
  "Pantura Jawa Barat",
  "Tatar Sunda",
] as const;

const regionCounts = regions.reduce<Record<string, number>>((counts, region) => {
  counts[region] = region === "Semua" ? stories.length : stories.filter((story) => story.area === region).length;
  return counts;
}, {});

function StoryMark({ story, featured = false }: { story: Story; featured?: boolean }) {
  return (
    <div
      className={`relative flex ${featured ? "min-h-[260px] md:h-full" : "h-44"} items-end overflow-hidden ${featured ? "rounded-none md:rounded-none" : "rounded-[1.35rem]"} p-5 text-white`}
      style={{
        backgroundColor: story.color,
        backgroundImage: `radial-gradient(circle at 18% 18%, rgba(255,255,255,.22) 0 2px, transparent 2.5px), linear-gradient(135deg, ${story.color} 0%, #172554 135%)`,
        backgroundSize: "22px 22px, auto",
      }}
    >
      <div className="absolute -right-8 -top-12 h-44 w-44 rounded-full border-2 border-white/15" />
      <div className="absolute -bottom-20 -left-12 h-52 w-52 rounded-full border border-white/15" />
      <div className="absolute right-5 top-5 text-2xl font-black text-white/70">✦</div>
      <div className="absolute right-5 top-12 flex h-11 w-11 rotate-6 items-center justify-center rounded-full border-2 border-white/40 bg-[#f7d48a] text-xs font-black tracking-widest text-[#172554] shadow-lg">
        {story.mark}
      </div>
      <div className="relative">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/80">
          <Feather className="h-3 w-3 text-[#f7d48a]" /> {featured ? "Cerita utama" : story.category}
        </div>
        <p className="text-xl font-black leading-tight sm:text-2xl">{story.place}</p>
        <p className="mt-1 max-w-[18rem] text-[11px] font-semibold leading-5 text-white/70">Satu cerita, banyak pelajaran.</p>
      </div>
    </div>
  );
}

function StoryCard({ story, featured = false }: { story: Story; featured?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <article className={`overflow-hidden rounded-[1.6rem] border-2 border-[#1d2942]/10 bg-[#fffaf0] shadow-[0_6px_0_rgba(29,41,66,0.08),0_15px_30px_rgba(106,65,35,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(29,41,66,0.08),0_20px_35px_rgba(106,65,35,0.12)] ${featured ? "md:col-span-2 md:grid md:grid-cols-[.95fr_1.05fr] xl:col-span-2" : ""}`}>
      <StoryMark story={story} featured={featured} />
      <div className="flex flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#e8492e]">{featured ? "Pilihan redaksi Nempo" : story.category}</p>
            <h2 className="text-xl font-black tracking-tight text-[#1d2942] sm:text-2xl">{story.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-[#7f6b59]">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{story.place}</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{story.duration}</span>
            </div>
          </div>
          <span className="rounded-full bg-[#f7d48a] px-2.5 py-1 text-[10px] font-black text-[#7b3f24]">{story.area}</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-[#6e6258]">{story.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t-2 border-dashed border-[#e8d7ba] pt-4">
          <p className="text-[11px] font-bold italic leading-5 text-[#9b7657]">“{story.lesson}”</p>
          <button
            type="button"
            onClick={() => setOpen(value => !value)}
            aria-expanded={open}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#1d2942] px-3 py-2 text-xs font-black text-white transition-colors hover:bg-[#e8492e]"
          >
            {open ? "Tutup" : "Baca"}
            {open ? <X className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
          </button>
        </div>
        {open && (
          <div className="mt-5 space-y-3 rounded-2xl border border-[#efd5a5] bg-[#fff1cf] p-4 text-sm leading-7 text-[#55483e]">
            {story.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="border-t border-[#e5c487] pt-3 text-[11px] font-semibold leading-5 text-[#8c572a]">
              Catatan: cerita rakyat memiliki banyak versi yang berkembang di masyarakat. Ringkasan ini disajikan sebagai pengantar budaya.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

export default function CeritaRakyatPage() {
  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState<(typeof regions)[number]>("Semua");

  const filteredStories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return stories.filter((story) => {
      const matchesRegion = activeRegion === "Semua" || story.area === activeRegion;
      const matchesQuery = !normalizedQuery
        || `${story.title} ${story.place} ${story.category} ${story.excerpt}`.toLowerCase().includes(normalizedQuery);
      return matchesRegion && matchesQuery;
    });
  }, [activeRegion, query]);

  return (
      <main className="min-h-screen bg-[#f7ead7] text-[#1d2942]">
        <section className="relative overflow-hidden border-b-4 border-[#1d2942] bg-[#f7d48a]">
          <div className="h-2 bg-[#e8492e]" />
          <div className="absolute -right-24 top-12 h-72 w-72 rounded-full border-[18px] border-[#e8492e]/10" />
          <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full border-[12px] border-[#1d2942]/10" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(#1d2942 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
           <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-7 lg:px-8 lg:pb-7 lg:pt-4">
             <div className="grid items-center gap-8 md:grid-cols-[1.2fr_.7fr] md:gap-6">
              <div>
                <div className="mb-4 inline-flex -rotate-2 items-center gap-2 rounded-full bg-[#e8492e] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[3px_3px_0_#1d2942]">
                  <BookOpenText className="h-3.5 w-3.5" /> Majalah cerita rakyat
                </div>
                <h1 className="max-w-3xl text-[3.7rem] font-black leading-[0.82] tracking-[-0.08em] text-[#1d2942] sm:text-7xl lg:text-7xl">
                  CERITA
                  <br />
                  <span className="text-[#e8492e]">RAKYAT</span>
                </h1>
                 <p className="mt-5 max-w-xl text-sm font-bold leading-6 text-[#5e4c3c] sm:text-base md:mt-3 md:max-w-lg md:text-sm md:leading-5">
                  Buka halaman, temukan kisah, dan bawa pulang pelajarannya. Cerita pilihan dari Garut dan tanah Sunda untuk dibaca bersama.
                </p>
                 <div className="mt-5 flex flex-wrap gap-2 md:mt-4">
                  {["Baca gratis", "Versi ringkas", "Untuk semua usia"].map((item, index) => (
                    <span key={item} className={`rounded-full border-2 border-[#1d2942]/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#1d2942] ${index === 1 ? "rotate-2 bg-white/55" : "bg-white/35"}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
               <div className="relative mx-auto w-full max-w-md md:max-w-[285px] md:justify-self-end">
                <div className="absolute -inset-3 rotate-3 rounded-[1.6rem] bg-[#e8492e] shadow-[6px_6px_0_#1d2942]" />
                <div className="relative rotate-[-2deg] overflow-hidden rounded-[1.5rem] border-4 border-[#1d2942] bg-[#fffaf0] p-3 shadow-[4px_4px_0_#1d2942]">
                  <div className="flex items-center justify-between border-b-2 border-dashed border-[#1d2942]/20 pb-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#e8492e]">
                    <span>Cerita pilihan</span>
                    <span>Garut</span>
                  </div>
                  <div className="relative my-2.5 flex h-24 items-center justify-center overflow-hidden rounded-2xl bg-[#1d2942]">
                    <div className="absolute -left-8 -top-10 h-32 w-32 rounded-full bg-[#f7d48a]/30" />
                    <div className="absolute -bottom-16 -right-8 h-40 w-40 rounded-full bg-[#e8492e]/70" />
                    <div className="relative flex h-14 w-24 items-center justify-center rounded-b-[1.5rem] rounded-t-xl border-4 border-[#7b3f24] bg-[#fff1cf] shadow-[0_5px_0_#7b3f24]">
                      <div className="h-10 w-px bg-[#e5c487]" />
                      <div className="absolute left-2 right-2 top-4 border-t-2 border-[#e5c487]" />
                      <BookOpenText className="absolute h-7 w-7 text-[#e8492e]" />
                    </div>
                    <span className="absolute bottom-3 left-4 text-2xl text-[#f7d48a]">✦</span>
                    <span className="absolute right-5 top-3 text-xl text-white">★</span>
                  </div>
                  <p className="text-center text-[10px] font-black uppercase tracking-[0.25em] text-[#7f6b59]">Legenda Situ Bagendit</p>
                  <p className="mt-1 text-center text-base font-black leading-tight text-[#1d2942]">Satu cerita,<br /><span className="text-[#e8492e]">banyak pelajaran.</span></p>
                  <div className="mt-2.5 flex justify-center"><span className="rounded-full bg-[#f7d48a] px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-[#7b3f24]">Mulai membaca →</span></div>
                </div>
                 <span className="absolute -left-8 top-1/2 z-10 flex h-16 w-16 -translate-y-1/2 -rotate-12 items-center justify-center rounded-full border-2 border-[#1d2942] bg-[#f7d48a] text-center text-[9px] font-black uppercase leading-3 text-[#1d2942] shadow-[3px_3px_0_#1d2942]">Warisan<br />kita!</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#e8492e]">Rubrik utama · Baca dan kenali</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-[#1d2942] sm:text-4xl">Pilih cerita untuk dibaca</h2>
            </div>
            <div className="flex w-full items-center gap-2 rounded-2xl border-2 border-[#1d2942]/15 bg-[#fffaf0] px-3 py-2.5 shadow-[3px_3px_0_rgba(29,41,66,.1)] lg:max-w-sm">
              <Search className="h-4 w-4 shrink-0 text-[#e8492e]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari judul atau daerah..."
                aria-label="Cari cerita rakyat"
                className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[#1d2942] outline-none placeholder:text-[#9b8979]"
              />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Hapus pencarian"><X className="h-4 w-4 text-slate-400" /></button>}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border-2 border-[#1d2942]/10 bg-[#fffaf0]/80 p-3 shadow-[3px_3px_0_rgba(29,41,66,.06)] sm:p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f7d48a] text-[#7b3f24]">
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7f6b59]">Jelajahi per wilayah</p>
                  <p className="text-[11px] font-bold text-[#1d2942]">
                    Menampilkan <span className="text-[#e8492e]">{activeRegion === "Semua" ? "semua wilayah" : activeRegion}</span>
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#7f6b59]">
                {filteredStories.length} cerita
              </span>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible md:pb-0">
              {regions.map((region) => {
                const selected = activeRegion === region;
                return (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setActiveRegion(region)}
                    aria-pressed={selected}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition-all ${selected ? "bg-[#1d2942] text-white shadow-[3px_3px_0_#e8492e]" : "border-2 border-[#1d2942]/10 bg-white/70 text-[#7f6b59] hover:-translate-y-0.5 hover:border-[#e8492e]/40 hover:text-[#e8492e]"}`}
                  >
                    {region === "Semua" ? "Semua wilayah" : region}
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] leading-none ${selected ? "bg-white/15 text-[#f7d48a]" : "bg-[#f7ead7] text-[#9b7657]"}`}>
                      {regionCounts[region]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {filteredStories.length > 0 ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredStories.map((story, index) => <StoryCard key={story.id} story={story} featured={index === 0} />)}
            </div>
          ) : (
            <div className="mt-7 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <BookOpenText className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-4 text-lg font-black text-slate-800">Cerita belum ditemukan</h3>
              <p className="mt-1 text-sm text-slate-500">Coba gunakan kata kunci lain atau pilih wilayah yang berbeda.</p>
              <button type="button" onClick={() => { setQuery(""); setActiveRegion("Semua"); }} className="mt-5 inline-flex items-center gap-1 text-xs font-black text-amber-700 hover:text-amber-900">
                Tampilkan semua cerita <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
              </button>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 rounded-3xl border border-amber-100 bg-amber-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm"><Feather className="h-5 w-5" /></div>
              <div>
                <p className="text-sm font-black text-amber-950">Punya versi cerita dari keluargamu?</p>
                <p className="mt-1 text-xs leading-5 text-amber-800/70">Cerita rakyat hidup karena terus diceritakan. Bagikan versi lokal yang kamu kenal kepada Nempo.</p>
              </div>
            </div>
            <a href="mailto:halo@nempo.id?subject=Berbagi%20Cerita%20Rakyat" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-amber-800">
              Bagikan cerita <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>
      </main>
  );
}