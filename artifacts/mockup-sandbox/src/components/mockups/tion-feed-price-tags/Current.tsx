import "./_group.css";

const products = [
  {
    name: "Pistachio Aren Latte",
    description: "Pistachio & gula aren",
    oldPrice: "Rp22.000",
    price: "Rp15.000",
    image: "/__mockup/images/tion-feed/pistachio-cup-cutout.png",
    center: "23%",
    cupTop: "52.5%",
    cupWidth: "31%",
    cupHeight: "35%",
    priceTop: "45.5%",
    captionTop: "85%",
    zIndex: 10,
    priceStyle: "pistachio",
  },
  {
    name: "Kopi Kenangan Mantan",
    description: "Kopi susu creamy",
    oldPrice: "Rp24.000",
    price: "Rp18.000",
    image: "/__mockup/images/tion-feed/kopi-kenangan-mantan-cutout.png",
    center: "77%",
    cupTop: "52%",
    cupWidth: "31%",
    cupHeight: "35%",
    priceTop: "45%",
    captionTop: "85%",
    zIndex: 10,
    priceStyle: "coffee",
  },
  {
    name: "Avocado Milk",
    description: "Avokad creamy & segar",
    oldPrice: "Rp26.000",
    price: "Rp21.000",
    image: "/__mockup/images/tion-feed/avocado-milk.png",
    center: "50%",
    cupTop: "49.5%",
    cupWidth: "46%",
    cupHeight: "46%",
    priceTop: "44%",
    captionTop: "89%",
    zIndex: 15,
    priceStyle: "avocado",
  },
];

export function Current() {
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

        <aside aria-label="Label harga promo">
          {products.map((product) => (
            <div
              key={`${product.name}-price`}
              className={`price-tag price-tag--${product.priceStyle}`}
              style={{ left: product.center, top: product.priceTop }}
            >
              <span className="price-tag__eyebrow">Harga promo</span>
              <span className="price-tag__old">{product.oldPrice}</span>
              <span className="price-tag__new">{product.price}</span>
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
