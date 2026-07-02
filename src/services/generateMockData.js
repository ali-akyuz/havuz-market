const fs = require('fs');
const path = require('path');

const categories = [
  {
    id: "cat_1",
    slug: "havuz-robotlari",
    name: "Havuz Robotları",
    image: "/images/categories/havuz-robotlari.jpg",
    subcategories: [
      { id: "sub_1_1", slug: "zemin-temizleyen-robotlar", name: "Zemin Temizleyen Robotlar" },
      { id: "sub_1_2", slug: "duvar-ve-zemin-temizleyen-robotlar", name: "Duvar ve Zemin Temizleyen Robotlar" },
      { id: "sub_1_3", slug: "akilli-havuz-robotlari", name: "Akıllı Havuz Robotları" }
    ]
  },
  {
    id: "cat_2",
    slug: "havuz-kimyasallari",
    name: "Havuz Kimyasalları",
    image: "/images/categories/havuz-kimyasallari.jpg",
    subcategories: [
      { id: "sub_2_1", slug: "klor", name: "Klor Ürünleri" },
      { id: "sub_2_2", slug: "ph-duzenleyiciler", name: "pH Düzenleyiciler" },
      { id: "sub_2_3", slug: "yosun-onleyiciler", name: "Yosun Önleyiciler" }
    ]
  },
  {
    id: "cat_3",
    slug: "havuz-pompalari",
    name: "Havuz Pompaları",
    image: "/images/categories/havuz-pompalari.jpg",
    subcategories: [
      { id: "sub_3_1", slug: "santrifuj-pompalar", name: "Santrifüj Pompalar" },
      { id: "sub_3_2", slug: "degisken-hizli-pompalar", name: "Değişken Hızlı Pompalar" },
      { id: "sub_3_3", slug: "ticari-havuz-pompalari", name: "Ticari Havuz Pompaları" }
    ]
  },
  {
    id: "cat_4",
    slug: "havuz-aydinlatmalari",
    name: "Havuz Aydınlatmaları",
    image: "/images/categories/havuz-aydinlatmalari.jpg",
    subcategories: [
      { id: "sub_4_1", slug: "led-aydinlatmalar", name: "LED Aydınlatmalar" },
      { id: "sub_4_2", slug: "siva-ustu-lambalar", name: "Sıva Üstü Lambalar" },
      { id: "sub_4_3", slug: "fiber-optik-aydinlatmalar", name: "Fiber Optik Aydınlatmalar" }
    ]
  },
  {
    id: "cat_5",
    slug: "havuz-ekipmanlari",
    name: "Havuz Ekipmanları",
    image: "/images/categories/havuz-ekipmanlari.jpg",
    subcategories: [
      { id: "sub_5_1", slug: "kum-filtreleri", name: "Kum Filtreleri" },
      { id: "sub_5_2", slug: "havuz-merdivenleri", name: "Havuz Merdivenleri" },
      { id: "sub_5_3", slug: "temizlik-ekipmanlari", name: "Temizlik Ekipmanları (Fırça, Kepçe vb.)" }
    ]
  },
  {
    id: "cat_6",
    slug: "tuz-klor-jeneratorleri",
    name: "Tuz Klor Jeneratörleri",
    image: "/images/categories/tuz-klor-jeneratorleri.jpg",
    subcategories: [
      { id: "sub_6_1", slug: "ev-tipi-jeneratorler", name: "Ev Tipi Jeneratörler" },
      { id: "sub_6_2", slug: "ticari-tip-jeneratorler", name: "Ticari Tip Jeneratörler" },
      { id: "sub_6_3", slug: "otomasyon-sistemleri", name: "Otomasyon Sistemleri" }
    ]
  }
];

const generateProducts = () => {
  const products = [];
  let idCounter = 1;
  const brands = ["Zodiac", "Dolphin", "Hayward", "AstralPool", "Gemaş", "BWT", "Pina"];
  
  categories.forEach(category => {
    category.subcategories.forEach((sub, index) => {
      const count = index === 0 ? 2 : (index === 1 ? 2 : 1);
      
      for(let i=0; i<count; i++) {
        const isCampaign = Math.random() > 0.7;
        const isBestseller = Math.random() > 0.8;
        const isNew = Math.random() > 0.8;
        const stock = Math.random() > 0.1 ? Math.floor(Math.random() * 50) + 1 : 0;
        const price = Math.floor(Math.random() * 10000) + 500;
        const discount = isCampaign ? Math.floor(Math.random() * 30) + 10 : 0;
        const oldPrice = discount > 0 ? Math.floor(price * (1 + discount/100)) : null;
        
        const brand = brands[Math.floor(Math.random() * brands.length)];
        
        const badges = [];
        if (isCampaign) badges.push("Kampanya");
        if (isBestseller) badges.push("Çok Satan");
        if (isNew) badges.push("Yeni Ürün");
        
        products.push({
          id: `prod_${idCounter}`,
          slug: `${brand.toLowerCase()}-${sub.slug}-${i+1}`.replace(/[^a-z0-9-]/g, '-'),
          title: `${brand} Premium ${sub.name.replace(/\(.*?\)/g, '').trim()} Model ${i+1}`,
          brand: brand,
          category: category.id,
          subcategory: sub.id,
          price: price,
          oldPrice: oldPrice,
          discount: discount,
          stock: stock,
          rating: (Math.random() * 2 + 3).toFixed(1),
          reviewCount: Math.floor(Math.random() * 150),
          images: [
            `/images/products/${category.slug}-${i+1}.jpg`,
            `/images/products/placeholder-2.jpg`,
            `/images/products/placeholder-3.jpg`
          ],
          shortDescription: `Havuzunuz için en iyi ${sub.name.toLowerCase()} çözümü.`,
          description: `${brand} marka yüksek kaliteli ${sub.name.toLowerCase()}. Uzun ömürlü kullanım ve maksimum performans için tasarlanmıştır. ${category.name} kategorisinde en çok tercih edilen ürünlerden biridir. Yüksek enerji verimliliği ve dayanıklı yapısı ile havuz bakımınızı kolaylaştırır.`,
          technicalSpecs: {
            "Ağırlık": `${(Math.random() * 10 + 1).toFixed(1)} kg`,
            "Garanti": "2 Yıl",
            "Güç": `${Math.floor(Math.random() * 2000 + 500)} W`,
            "Renk": "Mavi / Beyaz",
            "Üretim Yeri": "Avrupa"
          },
          badges: badges
        });
        idCounter++;
      }
    });
  });
  
  return products;
};

const data = {
  categories: categories,
  products: generateProducts()
};

const dirPath = path.join(__dirname);
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

fs.writeFileSync(path.join(dirPath, 'mockData.json'), JSON.stringify(data, null, 2));
console.log("mockData.json successfully generated with", data.products.length, "products.");
