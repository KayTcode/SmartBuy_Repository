import { useState } from "react";
import { IconCart, IconHeart } from "../components/icons.jsx";
import { formatVND } from "../utils/currency.js";

function BMI() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState("");
  const [cart, setCart] = useState([]);

  // Danh sách sản phẩm fix cứng
  const products = [
    // Dành cho người gầy
    {
      id: 1,
      name: "Ức gà nướng mật ong",
      category: "gầy",
      calories: "350 kcal",
      price: 45000,
      image:
        "data:image/jpeg;base64,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",
    },
    {
      id: 2,
      name: "Sữa tươi nguyên kem",
      category: "gầy",
      calories: "150 kcal",
      price: 15000,
      image:
        "https://cdn.tgdd.vn/Files/2019/11/13/1218537/sua-tuoi-nguyen-kem-la-gi-khac-gi-voi-nhung-loai-sua-tuoi-khac-201911132145296954.jpg",
    },
    // Dành cho bình thường
    {
      id: 3,
      name: "Salad trứng và rau củ",
      category: "bình thường",
      calories: "220 kcal",
      price: 30000,
      image:
        "https://shop.annam-gourmet.com/pub/media/wysiwyg/t_c_d_ng_c_a_n_salad_rau_tr_n.jpg",
    },
    {
      id: 4,
      name: "Cá hấp gừng",
      category: "bình thường",
      calories: "180 kcal",
      price: 40000,
      image:
        "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/ca_dieu_hong_hap_gung_hanh_thumb_fe99917af3.jpg",
    },
    // Dành cho thừa cân
    {
      id: 5,
      name: "Soup bí đỏ chay",
      category: "thừa cân",
      calories: "130 kcal",
      price: 25000,
      image:
        "https://cdn.tgdd.vn/2020/06/CookRecipe/GalleryStep/thanh-pham-42.jpg",
    },
    {
      id: 6,
      name: "Ức gà luộc + rau luộc",
      category: "thừa cân",
      calories: "180 kcal",
      price: 35000,
      image:
        "https://images2.thanhnien.vn/528068263637045248/2025/7/24/uc-ga-rau-xanh-17533263671251950811382.png",
    },
    // Dành cho béo phì
    {
      id: 7,
      name: "Salad rau xanh mix quả",
      category: "béo phì",
      calories: "110 kcal",
      price: 30000,
      image:
        "https://shop.annam-gourmet.com/pub/media/wysiwyg/t_c_d_ng_c_a_n_salad_rau_tr_n.jpg",
    },
    {
      id: 8,
      name: "Sinh tố cần tây + táo",
      category: "béo phì",
      calories: "90 kcal",
      price: 25000,
      image:
        "https://bizweb.dktcdn.net/100/421/036/files/sinh-to-can-tay-tao.jpg?v=1657766241100",
    },
  ];

  // Hàm tính BMI
  const calculateBMI = (e) => {
    e.preventDefault();
    if (!height || !weight) return;

    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    const result = (w / (h * h)).toFixed(1);
    setBmi(result);

    if (result < 18.5) setStatus("gầy");
    else if (result >= 18.5 && result < 24.9) setStatus("bình thường");
    else if (result >= 25 && result < 29.9) setStatus("thừa cân");
    else setStatus("béo phì");
  };

  // Thêm vào giỏ hàng
  const addToCart = (item) => {
    setCart((prev) => {
      if (prev.find((p) => p.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  // Lọc sản phẩm phù hợp
  const filtered =
    status === "" ? [] : products.filter((p) => p.category === status);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">
          🧍‍♀️ Đo chỉ số BMI của bạn
        </h1>
        <p className="text-slate-600 text-sm">
          BMI (Body Mass Index) giúp bạn biết mình đang gầy, bình thường, hay
          thừa cân, để lựa chọn thực phẩm phù hợp.
        </p>

        <form
          onSubmit={calculateBMI}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <input
            type="number"
            placeholder="Chiều cao (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full sm:w-1/3 rounded-3xl border border-slate-200 p-3 focus:ring-2 focus:ring-green-400"
          />
          <input
            type="number"
            placeholder="Cân nặng (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full sm:w-1/3 rounded-3xl border border-slate-200 p-3 focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="w-full sm:w-auto rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600"
          >
            Tính BMI
          </button>
        </form>

        {bmi && (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-5 mt-4">
            <p className="text-lg font-semibold text-green-700">
              Kết quả BMI: {bmi}
            </p>
            <p className="text-slate-700 mt-1">
              Tình trạng cơ thể:{" "}
              <span className="font-semibold text-green-800 uppercase">
                {status}
              </span>
            </p>
          </div>
        )}
      </section>

      {/* Sản phẩm gợi ý */}
      {status && (
        <section className="mt-8 space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">
            🥗 Gợi ý thực phẩm phù hợp cho người {status}
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((item) => {
              const inCart = cart.some((c) => c.id === item.id);
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="text-lg font-semibold text-slate-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-1">
                    Năng lượng: {item.calories}
                  </p>
                  <p className="text-green-600 font-medium">
                    {formatVND(item.price)}
                  </p>
                  <button
                    onClick={() => addToCart(item)}
                    disabled={inCart}
                    className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      inCart
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    <IconCart className="h-4 w-4" />
                    {inCart ? "Đã thêm" : "Thêm vào giỏ"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Giỏ hàng */}
          {cart.length > 0 && (
            <div className="rounded-[32px] border border-green-200 bg-green-50 p-6 shadow-sm mt-8">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                🛍 Giỏ hàng của bạn
              </h3>
              <ul className="list-disc ml-5 text-slate-700 text-sm">
                {cart.map((item) => (
                  <li key={item.id}>
                    {item.name} — {formatVND(item.price)}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-semibold text-green-700">
                Tổng cộng:{" "}
                {cart
                  .reduce((s, x) => s + x.price, 0)
                  .toLocaleString("vi-VN")}
                đ
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default BMI;
