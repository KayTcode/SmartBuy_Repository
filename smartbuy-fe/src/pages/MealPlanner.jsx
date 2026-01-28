import { useState } from 'react';
import { IconCart, IconSearch } from '../components/icons.jsx';
import { formatVND } from '../utils/currency.js';
import { callGeminiAPI } from '../services/gemini.service.js';

function MealPlanner({ products = [], loading: productsLoading = false }) {
  const [prompt, setPrompt] = useState('');
  const [show, setShow] = useState(false);
  const [cart, setCart] = useState([]);
  const [aiPlan, setAiPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Kiểm tra nếu chưa có sản phẩm
  if (!products || products.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm text-center">
          <p className="text-slate-600">
            {productsLoading ? 'Đang tải sản phẩm...' : 'Chưa có sản phẩm. Vui lòng thử lại sau.'}
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // LOGIC GIỎ HÀNG
  // ======================================================
  const addToCart = (p) => {
    setCart((prev) => {
      if (prev.find((x) => x.id === p.id)) return prev;
      return [...prev, p];
    });
  };

  // ======================================================
  // XỬ LÝ SUBMIT
  // ======================================================
  const handleGenerate = async (userPrompt) => {
    if (!userPrompt.trim()) return;
    setError('');
    setLoading(true);
    setShow(false);
    setAiPlan(null);
    setCart([]);

    try {
      const plan = await callGeminiAPI(userPrompt, products);
      setAiPlan(plan);
      setShow(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gemini key hết hạn hoặc lỗi');
      setShow(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleGenerate(prompt);
  };

  const handleQuickPrompt = async (text) => {
    setPrompt(text);
    await handleGenerate(text);
  };

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Ô NHẬP */}
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">
          Hôm nay ăn gì?
        </h1>
        <p className="text-slate-600 text-sm">
          Nhập bất kỳ yêu cầu nào về bữa ăn của bạn. Smart Buy sẽ hiểu và gợi ý phù hợp!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Nhập tự do: 'ăn gì hôm nay?', 'bữa tối 50k cho 4 người', 'combo healthy cho 2 người', 'món nhanh dưới 30k', 'ăn chay đủ chất', 'nhiều rau ít thịt'..."
            className="w-full rounded-3xl border border-slate-200 p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-pulse">Đang suy nghĩ...</span>
            ) : (
              <>
                <IconSearch className="h-4 w-4" />
                Gợi ý ngay
              </>
            )}
          </button>
        </form>

        {/* GỢI Ý NHANH */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500">💡 Gợi ý nhanh (click để thử):</p>
          <div className="flex flex-wrap gap-2 text-sm">
            <button
              type="button"
              onClick={() =>
                handleQuickPrompt("ăn gì hôm nay?")
              }
              className="rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-green-500 hover:bg-green-50 hover:text-green-600"
            >
              Ăn gì hôm nay?
            </button>
            <button
              type="button"
              onClick={() =>
                handleQuickPrompt("bữa tối 50k cho gia đình 4 người")
              }
              className="rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-green-500 hover:bg-green-50 hover:text-green-600"
            >
              Bữa tối 50k cho 4 người
            </button>
            <button
              type="button"
              onClick={() =>
                handleQuickPrompt("combo giá rẻ cho học sinh sinh viên dưới 35k")
              }
              className="rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-green-500 hover:bg-green-50 hover:text-green-600"
            >
              Combo giá rẻ sinh viên
            </button>
            <button
              type="button"
              onClick={() =>
                handleQuickPrompt("combo healthy eat clean cho 2 người, ít dầu mỡ, nhiều rau")
              }
              className="rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-green-500 hover:bg-green-50 hover:text-green-600"
            >
              Combo healthy
            </button>
            <button
              type="button"
              onClick={() =>
                handleQuickPrompt("bữa ăn đủ chất nhưng nấu siêu nhanh trong 15 phút")
              }
              className="rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-green-500 hover:bg-green-50 hover:text-green-600"
            >
              Combo siêu nhanh 15 phút
            </button>
            <button
              type="button"
              onClick={() =>
                handleQuickPrompt("ăn chay đủ chất cho 1 người")
              }
              className="rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-green-500 hover:bg-green-50 hover:text-green-600"
            >
              Ăn chay đủ chất
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">⚠️ {error}</p>
          </div>
        )}
      </section>

      {/* GỢI Ý TỪ AI */}
      {show && aiPlan && aiPlan.menus && (
        <section className="mt-10 space-y-10">
          {aiPlan.summary && (
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
              <strong>Tổng quan: </strong>
              {aiPlan.summary}
            </div>
          )}

          {aiPlan.menus.map((menu) => (
            <div
              key={menu.id}
              className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm space-y-6"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {menu.title}
              </h2>

              {/* Mô tả */}
              {menu.description && (
                <div className="space-y-1 text-sm text-slate-700 leading-relaxed">
                  {menu.description.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              )}

              {/* Công thức nấu */}
              {menu.recipeSteps && menu.recipeSteps.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-sm text-emerald-700">
                    👩‍🍳 Công thức nấu ăn:
                  </p>
                  <ul className="list-disc ml-5 text-sm text-slate-700">
                    {menu.recipeSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Danh sách mua sắm */}
              {menu.shoppingList && menu.shoppingList.length > 0 && (
                <>
                  <p className="mt-3 font-semibold text-sm text-emerald-700">
                    🛒 Danh sách mua sắm (Dự trù):
                  </p>
                  <ul className="list-disc ml-5 text-sm text-slate-700">
                    {menu.shoppingList.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* SẢN PHẨM LIÊN QUAN LẤY THEO productIds */}
              {menu.productIds && menu.productIds.length > 0 && (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {menu.productIds.map((id, idx) => {
                    const p = products.find((x) => x.id === id);
                    if (!p) return null;
                    const inCart = cart.find((c) => c.id === p.id);

                    return (
                      <div
                        key={`${p.id}-${idx}`}
                        className="rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                        <h3 className="text-lg font-semibold text-slate-800">
                          {p.name}
                        </h3>
                        <p className="text-green-600 font-medium mt-1">
                          {formatVND(p.price)}
                        </p>
                        <button
                          onClick={() => addToCart(p)}
                          disabled={inCart}
                          className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${inCart
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
              )}
            </div>
          ))}

          {/* GIỎ HÀNG */}
          {cart.length > 0 && (
            <div className="rounded-[32px] border border-green-200 bg-green-50 p-6 shadow-sm">
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

export default MealPlanner;
