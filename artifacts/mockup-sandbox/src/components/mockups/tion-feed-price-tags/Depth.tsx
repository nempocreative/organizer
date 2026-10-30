import "./_group.css";
import "./Depth.css";

const products = [
  {
    name: "Pistachio Aren Latte",
    description: "Pistachio & gula aren",
    price: "Rp15.000",
    priceLabel: "15K",
    image: "/__mockup/images/tion-feed/pistachio-cup-cutout.png",
    center: "23%",
    cupTop: "52.5%",
    priceBadgeLeft: "26%",
    priceBadgeTop: "66%",
    cupWidth: "31%",
    cupHeight: "35%",
    captionTop: "85%",
    zIndex: 10,
    priceStyle: "pistachio",
  },
  {
    name: "Kopi Kenangan Mantan",
    description: "Kopi susu creamy",
    price: "Rp18.000",
    priceLabel: "18K",
    image: "/__mockup/images/tion-feed/kopi-kenangan-mantan-cutout.png",
    center: "77%",
    cupTop: "52%",
    priceBadgeLeft: "75%",
    priceBadgeTop: "65%",
    cupWidth: "31%",
    cupHeight: "35%",
    captionTop: "85%",
    zIndex: 10,
    priceStyle: "coffee",
  },
  {
    name: "Avocado Milk",
    description: "Avokad creamy & segar",
    price: "Rp21.000",
    priceLabel: "21K",
    image: "/__mockup/images/tion-feed/avocado-milk.png",
    center: "50%",
    cupTop: "49.5%",
    priceBadgeLeft: "44%",
    priceBadgeTop: "66%",
    cupWidth: "46%",
    cupHeight: "46%",
    captionTop: "89%",
    zIndex: 15,
    priceStyle: "avocado",
  },
];

export function Depth() {
  return (
    <main className="tion-feed-stage">
      <article
        aria-label="Promo Nasution Boy dengan tiga minuman"
        className="tion-feed-poster"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(32,19,17,0.3) 0%, rgba(32,19,17,0.08) 28%, transparent 48%), url("/__mockup/images/tion-feed/nasution-retro-product-background.png")',
        }}
      >
        <div className="tion-feed-poster__header">
          <img
            src="/__mockup/images/tion-feed/nasution-boy-retro-logo-white.png"
            alt="Logo Nasution Boy"
            className="tion-feed-poster__wordmark"
            draggable={false}
          />
          <section className="tion-feed-poster__promo">
            <p className="tion-feed-poster__intro">Beli Kopi Kenangan</p>
            <h1 className="tion-feed-poster__headline">Lebih Murah</h1>
            <p className="tion-feed-poster__voucher">Pakai Voucher TikTok</p>
          </section>
        </div>

        {products.map((product) => (
          <img
            key={`${product.name}-image`}
            src={product.image}
            alt={product.name}
            className="tion-feed-product"
            style={{
              left: product.center,
              top: product.cupTop,
              width: product.cupWidth,
              height: product.cupHeight,
              zIndex: product.zIndex,
            }}
            draggable={false}
          />
        ))}

        <aside aria-label="Harga promo untuk tiap minuman">
          {products.map((product) => (
            <div
              key={`${product.name}-price`}
              className={`depth-tag depth-tag--${product.priceStyle}`}
              style={{ left: product.priceBadgeLeft, top: product.priceBadgeTop }}
              role="img"
              aria-label={`Harga ${product.price}`}
            >
              <span className="depth-tag__prefix" aria-hidden="true">
                Mulai dari
              </span>
              <span className="depth-tag__price" aria-hidden="true">
                {product.priceLabel}
              </span>
            </div>
          ))}
        </aside>

        <section className="tion-feed-captions" aria-label="Nama minuman">
          {products.map((product) => (
            <div
              key={`${product.name}-description`}
              className="tion-feed-caption"
              style={{ left: product.center, top: product.captionTop }}
            >
              <h2 className="tion-feed-caption__name">{product.name}</h2>
              <p className="tion-feed-caption__description">
                {product.description}
              </p>
            </div>
          ))}
        </section>
      </article>
    </main>
  );
}
