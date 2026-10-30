import eventPhoto from '../../assets/deck/karnaval.webp';
import influencerPhoto from '../../assets/deck/creator-influencer-ai.jpg';
import weddingCreatorPhoto from '../../assets/deck/creator-wcc-ai.jpg';
import { SectionKicker, SlideCanvas, SlideFooter } from '../../components/slide-kit';

const stories = [
  {
    number: '01',
    title: 'Momen acara',
    detail: 'Tim creator untuk mengabadikan acara klien.',
    startFrom: 'Rp150.000',
    image: eventPhoto,
    alt: 'Suasana acara yang diramaikan para pengunjung',
    position: 'center',
  },
  {
    number: '02',
    title: 'Video influencer',
    detail: 'Influencer membuat video untuk brand atau campaign.',
    startFrom: 'Rp150.000',
    image: influencerPhoto,
    alt: 'Influencer menyiapkan konten video dengan ponsel',
    position: 'center',
  },
  {
    number: '03',
    title: 'Wedding Content Creator',
    detail: 'WCC untuk mengabadikan momen wedding.',
    startFrom: 'Rp350.000',
    image: weddingCreatorPhoto,
    alt: 'Wedding content creator merekam suasana pernikahan',
    position: 'center 42%',
  },
];

const bookingSteps = [
  {
    number: '01',
    title: 'Ceritakan kebutuhan',
    detail: 'Momen acara, video influencer, WCC, atau lainnya.',
  },
  {
    number: '02',
    title: 'Pilih creator',
    detail: 'Sesuaikan creator dengan format konten.',
  },
  {
    number: '03',
    title: 'Sepakati detail',
    detail: 'Bahas format, jadwal, dan ruang lingkup.',
  },
];

export default function TempatRasaAktivitasSlide() {
  return (
    <SlideCanvas className="bg-[#f5f9ff] px-[82px] pt-[76px] text-[#101322]">
      <div className="flex items-end justify-between">
        <div>
          <SectionKicker>Creator Booking</SectionKicker>
          <h1 className="mt-4 text-[68px] font-extrabold leading-none tracking-[-0.07em]">
            Creator untuk momen penting.
          </h1>
        </div>
        <p className="mb-1 max-w-[390px] text-[21px] leading-[1.4] text-[#526476]">
          Tim creator yang dapat dibooking untuk acara, video influencer, WCC,
          dan kebutuhan lainnya.
        </p>
      </div>

      <div className="mt-[42px] grid h-[440px] grid-cols-3 gap-7">
        {stories.map((story) => (
          <article
            key={story.number}
            className="group relative overflow-hidden rounded-[34px] bg-[#dce8ef]"
          >
            <img
              src={story.image}
              alt={story.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              style={{ objectPosition: story.position }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061c32]/90 via-[#061c32]/15 to-transparent" />
            <span className="absolute left-7 top-7 rounded-full border border-white/45 bg-black/15 px-5 py-3 text-[15px] font-bold tracking-[0.17em] text-white backdrop-blur-sm">
              {story.number}
            </span>
            <div className="absolute bottom-7 left-7 right-7 text-white">
              <h2 className="text-[38px] font-extrabold leading-none tracking-[-0.06em]">
                {story.title}
              </h2>
              <p className="mt-3 max-w-[440px] text-[19px] leading-[1.35] text-white/80">
                {story.detail}
              </p>
              <div className="mt-4 inline-flex flex-col rounded-[16px] bg-white px-4 py-2.5 text-[#16375b] shadow-[0_8px_24px_rgba(4,24,45,0.16)]">
                <span className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#1d56c5]">
                  Start from
                </span>
                <span className="mt-0.5 text-[24px] font-extrabold leading-none tracking-[-0.04em]">
                  {story.startFrom}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-[42px]">
        <div className="flex items-end justify-between">
          <SectionKicker>Alur booking</SectionKicker>
          <p className="text-[18px] font-medium text-[#526476]">
            Dari kebutuhan awal hingga ruang lingkup disepakati.
          </p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-6">
          {bookingSteps.map((step) => (
            <article
              key={step.number}
              className="flex min-h-[142px] items-start gap-5 rounded-[24px] border border-[#dce8f1] bg-white/80 px-6 py-5 shadow-[0_10px_28px_rgba(24,73,113,0.04)]"
            >
              <span className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-full bg-[#e2f2ff] text-[15px] font-extrabold tracking-[0.08em] text-[#1d56c5]">
                {step.number}
              </span>
              <div className="pt-0.5">
                <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#16375b]">
                  {step.title}
                </h2>
                <p className="mt-2 text-[18px] leading-[1.4] text-[#526476]">
                  {step.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <SlideFooter number="03" />
    </SlideCanvas>
  );
}