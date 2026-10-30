import "./_group.css";
import "./Refined.css";
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

function StoryCard({ story, featured = false }: { story: Story; featured?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <article className={`story-card ${featured ? "story-card-featured" : ""}`}>
      <div className="story-card-meta">
        <span>{story.category}</span>
        <span className="story-meta-dot" aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{story.duration}</span>
      </div>
      <h2 className="story-title">{story.title}</h2>
      <div className="story-place">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        <span>{story.place}</span>
        <span className="story-place-divider" aria-hidden="true">/</span>
        <span>{story.area}</span>
      </div>
      <p className="story-excerpt">{story.excerpt}</p>
      <blockquote className="story-lesson">“{story.lesson}”</blockquote>
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        className="story-read-button"
      >
        {open ? "Tutup cerita" : "Baca cerita"}
        {open ? <X className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </button>
      {open && (
        <div className="story-reading">
          {story.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="story-reading-note">
            Catatan: cerita rakyat memiliki banyak versi yang berkembang di masyarakat. Ringkasan ini disajikan sebagai pengantar budaya.
          </p>
        </div>
      )}
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
    <main className="folklore-page min-h-screen">
      <header className="folklore-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[1fr_.88fr] lg:gap-14 lg:px-10 lg:py-14">
          <div>
            <p className="folklore-kicker"><BookOpenText className="h-4 w-4" /> Nempo · Cerita daerah</p>
            <h1 className="folklore-heading">Cerita rakyat<br /><span>Jawa Barat</span></h1>
            <p className="folklore-intro">
              Buka halaman, temukan kisah, dan bawa pulang pelajarannya. Cerita pilihan dari Garut dan tanah Sunda untuk dibaca bersama.
            </p>
            <div className="folklore-hero-count">
              <span className="folklore-count-number">{stories.length}</span>
              <span>cerita untuk dijelajahi</span>
            </div>
          </div>
          <figure className="folklore-landscape">
            <img src="/__mockup/images/papandayan.webp" alt="Pendaki melintasi lanskap Gunung Papandayan, Garut" />
            <figcaption><span>Lanskap Garut</span><span>Gunung Papandayan</span></figcaption>
          </figure>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-12 pt-9 sm:px-8 sm:pb-16 sm:pt-12 lg:px-10">
        <div className="folklore-section-head">
          <div>
            <p className="folklore-eyebrow">Kumpulan cerita</p>
            <h2 className="folklore-section-title">Pilih cerita untuk dibaca</h2>
          </div>
          <label className="folklore-search">
            <Search className="h-4 w-4 shrink-0" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari judul atau daerah"
              aria-label="Cari cerita rakyat"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Hapus pencarian">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
        </div>

        <div className="folklore-filter">
          <div className="folklore-filter-head">
            <div>
              <p className="folklore-eyebrow">Jelajahi per wilayah</p>
              <p className="folklore-filter-current">
                Menampilkan <strong>{activeRegion === "Semua" ? "semua wilayah" : activeRegion}</strong>
              </p>
            </div>
            <span className="folklore-result-count">{filteredStories.length} cerita</span>
          </div>
          <div className="folklore-region-list" role="group" aria-label="Filter cerita berdasarkan wilayah">
            {regions.map((region) => {
              const selected = activeRegion === region;
              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => setActiveRegion(region)}
                  aria-pressed={selected}
                  className={`folklore-region ${selected ? "is-selected" : ""}`}
                >
                  <span>{region === "Semua" ? "Semua wilayah" : region}</span>
                  <span className="folklore-region-count">{regionCounts[region]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredStories.length > 0 ? (
          <div className="folklore-story-grid">
            {filteredStories.map((story, index) => (
              <StoryCard key={story.id} story={story} featured={index === 0} />
            ))}
          </div>
        ) : (
          <div className="folklore-empty">
            <BookOpenText className="mx-auto h-8 w-8" />
            <h3>Cerita belum ditemukan</h3>
            <p>Coba gunakan kata kunci lain atau pilih wilayah yang berbeda.</p>
            <button type="button" onClick={() => { setQuery(""); setActiveRegion("Semua"); }}>
              Tampilkan semua cerita <ChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        )}

        <aside className="folklore-share">
          <div className="folklore-share-copy">
            <span className="folklore-share-icon"><Feather className="h-5 w-5" /></span>
            <div>
              <h2>Punya versi cerita dari keluargamu?</h2>
              <p>Cerita rakyat hidup karena terus diceritakan. Bagikan versi lokal yang kamu kenal kepada Nempo.</p>
            </div>
          </div>
          <a href="mailto:halo@nempo.id?subject=Berbagi%20Cerita%20Rakyat" className="folklore-share-button">
            Bagikan cerita <ArrowRight className="h-4 w-4" />
          </a>
        </aside>
      </section>
    </main>
  );
}