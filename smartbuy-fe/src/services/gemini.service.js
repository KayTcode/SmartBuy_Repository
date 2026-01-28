const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Xử lý lỗi từ Gemini API response
 * @param {Response} res - Response object từ fetch
 * @returns {Promise<Error>} Error với message đã được format
 */
const handleGeminiError = async (res) => {
  const text = await res.text();
  let errorMessage = 'Gemini key hết hạn hoặc lỗi';
  
  try {
    const errorData = JSON.parse(text);
    if (errorData?.error?.code === 403 || errorData?.error?.status === 'PERMISSION_DENIED') {
      errorMessage = 'Gemini key hết hạn hoặc lỗi';
    }
  } catch (e) {
    // Nếu không parse được JSON, dùng message mặc định
  }
  
  return new Error(errorMessage);
};

/**
 * Build prompt để gửi lên Gemini API
 * @param {string} userPrompt - Yêu cầu của người dùng
 * @param {Array} products - Danh sách sản phẩm
 * @returns {string} Prompt đã được format
 */
export const buildGeminiPrompt = (userPrompt, products) => {
  const catalog = products
    .map((p) => `${p.id} - ${p.name} - ${p.price} VND`)
    .join('\n');

  return `
Bạn là trợ lý lập kế hoạch bữa ăn thông minh cho ứng dụng Smart Buy. Nhiệm vụ của bạn là hiểu yêu cầu tự do của người dùng và đề xuất các combo bữa ăn phù hợp.

🎯 CÁCH HOẠT ĐỘNG:
- Phân tích yêu cầu của người dùng một cách linh hoạt và sáng tạo
- Đề xuất 2-4 combo bữa ăn phù hợp với nhu cầu
- Mỗi combo bao gồm: tiêu đề, mô tả, công thức nấu, danh sách mua sắm, và danh sách ID sản phẩm

📦 DANH SÁCH SẢN PHẨM CÓ SẴN:
${catalog}

🧑‍🍳 YÊU CẦU CỦA NGƯỜI DÙNG (nhập tự do):
"${userPrompt}"

Hãy phân tích yêu cầu trên và đề xuất các combo bữa ăn phù hợp. Bạn có thể:
- Hiểu ngữ cảnh (ví dụ: "ăn gì hôm nay" = gợi ý bữa ăn hôm nay)
- Hiểu ngân sách (ví dụ: "50k", "dưới 100k")
- Hiểu số người (ví dụ: "cho 4 người", "gia đình")
- Hiểu sở thích (ví dụ: "healthy", "ăn chay", "nhiều thịt")
- Hiểu thời gian (ví dụ: "nhanh", "15 phút", "ăn tối")

📋 ĐỊNH DẠNG JSON TRẢ VỀ (BẮT BUỘC):
{
  "summary": "Mô tả ngắn gọn về các gợi ý (tiếng Việt)",
  "menus": [
    {
      "id": "m1",
      "title": "Tên combo (có thể có emoji)",
      "description": ["Mô tả dòng 1", "Mô tả dòng 2"],
      "recipeSteps": ["Bước 1: ...", "Bước 2: ...", "Bước 3: ..."],
      "shoppingList": ["Tên nguyên liệu - giá", "Tên nguyên liệu - giá"],
      "productIds": [1, 2, 3]
    }
  ]
}

⚠️ QUY TẮC:
- Chỉ dùng productIds từ catalog trên
- productIds là mảng số (ví dụ: [1, 5, 12])
- Trả về CHỈ JSON hợp lệ, không text thêm
- Sáng tạo nhưng thực tế với nguyên liệu có sẵn
`;
};
  
/**
 * Gọi Gemini API để tạo kế hoạch bữa ăn
 * @param {string} userPrompt - Yêu cầu của người dùng
 * @param {Array} products - Danh sách sản phẩm
 * @returns {Promise<Object>} Kế hoạch bữa ăn từ AI
 */
export const callGeminiAPI = async (userPrompt, products) => {
  if (!GEMINI_API_KEY) {
    throw new Error(
      'Chưa cấu hình GEMINI_API_KEY. Hãy thêm vào file .env (VITE_GEMINI_API_KEY hoặc REACT_APP_GEMINI_API_KEY).'
    );
  }

  const fullPrompt = buildGeminiPrompt(userPrompt, products);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }]
          }
        ],
        // Gợi ý Gemini trả thẳng JSON
        generationConfig: {
          response_mime_type: 'application/json'
        }
      })
    }
  );

  if (!res.ok) {
    throw await handleGeminiError(res);
  }

  const data = await res.json();

  // Gemini sẽ trả JSON ở content.parts[0].text (đã là chuỗi JSON)
  const raw =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    data?.candidates?.[0]?.content?.parts?.[0]?.json;

  if (!raw) {
    throw new Error('Không đọc được dữ liệu trả về từ Gemini.');
  }

  // Nếu Gemini đã trả object JSON thì dùng luôn, nếu trả string thì parse
  let parsed;
  if (typeof raw === 'string') {
    parsed = JSON.parse(raw);
  } else {
    parsed = raw;
  }

  return parsed;
};

/**
 * Phân tích ảnh món ăn bằng Gemini Vision API
 * @param {string} base64 - Base64 string của ảnh (có thể kèm data URL prefix)
 * @returns {Promise<Object>} Kết quả phân tích từ AI
 */
export const callGeminiVision = async (base64) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini key hết hạn hoặc lỗi');
  }

  // Tự phát hiện MIME
  const mime = base64.substring(
    base64.indexOf(':') + 1,
    base64.indexOf(';')
  );
  const pureBase64 = base64.split(',')[1];

  const prompt = `
Phân tích món ăn trong ảnh. 
HÃY TRẢ VỀ DUY NHẤT JSON hợp lệ, không có văn bản thừa, không giải thích.

Nếu không phân tích được, trả về:
{
  "error": "cannot_analyze"
}

Nếu phân tích được, trả về JSON với cấu trúc:
{
  "calories": number,
  "carb": number,
  "fat": number,
  "protein": number,
  "oil_level": "thấp" | "vừa" | "cao",
  "is_eatclean": boolean,
  "warnings": string[],
  "short_summary": string,
  "suggest_replacements": string[]
}
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mime,
                  data: pureBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          response_mime_type: 'application/json',
        }
      }),
    }
  );

  if (!res.ok) {
    throw await handleGeminiError(res);
  }

  const json = await res.json();
  
  // Gemini có thể trả về text hoặc json object trực tiếp
  let raw =
    json?.candidates?.[0]?.content?.parts?.[0]?.text ||
    json?.candidates?.[0]?.content?.parts?.[0]?.json;

  if (!raw) {
    throw new Error('Không đọc được dữ liệu trả về từ Gemini.');
  }

  // Nếu là string, xử lý markdown code blocks và parse
  if (typeof raw === 'string') {
    // Google đôi khi trả JSON kèm dấu ```json … ```
    raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      return JSON.parse(raw);
    } catch {
      throw new Error('AI không trả về JSON hợp lệ.');
    }
  }

  // Nếu đã là object thì trả về luôn
  return raw;
};

/**
 * Phân tích BMI bằng Gemini API
 * @param {Object} bmiData - Dữ liệu BMI (height, weight, waist, bellyFat, activity, goal)
 * @param {number} simpleBmi - BMI đã tính sẵn
 * @returns {Promise<Object>} Kết quả phân tích BMI từ AI
 */
export const callBmiAI = async (bmiData, simpleBmi) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini key hết hạn hoặc lỗi');
  }

  const fullPrompt = `
Bạn là chuyên gia dinh dưỡng & sức khỏe. Dựa trên thông tin sau:

- Chiều cao: ${bmiData.height} cm
- Cân nặng: ${bmiData.weight} kg
- Vòng bụng (waist): ${bmiData.waist || 'không cung cấp'} cm
- Mức mỡ bụng dưới (user tự đánh giá): ${bmiData.bellyFat}
- Mức độ vận động: ${bmiData.activity}
- Mục tiêu sức khỏe: ${bmiData.goal}
- BMI tính sơ bộ: ${simpleBmi.toFixed(1)}

Hãy ước tính:
- body_fat % (mỡ cơ thể)
- visceral_fat_level: "thấp" | "trung bình" | "cao"
- calories_burn: năng lượng ước tính tiêu hao mỗi ngày (kcal)
- risk_level: "thấp" | "vừa" | "cao"
- health_risks: danh sách các nguy cơ sức khỏe chính
- nutrition_advice: gồm 3 mảng: eat_more, avoid, habits (mỗi mảng là string[])
- summary: đoạn mô tả ngắn (~3-4 câu) bằng tiếng Việt

Trả về JSON với cấu trúc:

{
  "bmi": number,
  "body_fat": number,
  "visceral_fat_level": "thấp" | "trung bình" | "cao",
  "calories_burn": number,
  "risk_level": "thấp" | "vừa" | "cao",
  "health_risks": string[],
  "nutrition_advice": {
    "eat_more": string[],
    "avoid": string[],
    "habits": string[]
  },
  "summary": string
}

Không thêm giải thích bên ngoài JSON.
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }],
          },
        ],
        generationConfig: {
          response_mime_type: 'application/json',
        },
      }),
    }
  );

  if (!res.ok) {
    throw await handleGeminiError(res);
  }

  const json = await res.json();
  
  // Gemini có thể trả về text hoặc json object trực tiếp
  let raw =
    json?.candidates?.[0]?.content?.parts?.[0]?.text ||
    json?.candidates?.[0]?.content?.parts?.[0]?.json;

  if (!raw) {
    throw new Error('Không đọc được dữ liệu trả về từ Gemini.');
  }

  let parsed;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
  } else {
    parsed = raw;
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('AI không phân tích được chỉ số BMI.');
  }

  // Đảm bảo luôn có bmi
  if (!parsed.bmi) {
    parsed.bmi = simpleBmi;
  }

  return parsed;
};

/**
 * Tạo meal plan 7 ngày bằng Gemini API
 * @param {Object} mealPlanData - Dữ liệu cho meal plan (bmi, goal, activity)
 * @returns {Promise<Object>} Meal plan 7 ngày từ AI
 */
export const callMealPlanAI = async (mealPlanData) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini key hết hạn hoặc lỗi');
  }

  const fullPrompt = `
Bạn là chuyên gia dinh dưỡng. Hãy tạo thực đơn EatClean 7 ngày cho người dùng với thông tin:

- BMI: ${mealPlanData.bmi.toFixed(1)}
- Mục tiêu: ${mealPlanData.goal}
- Mức vận động: ${mealPlanData.activity}

Yêu cầu:
- Mỗi ngày có 3 bữa: breakfast, lunch, dinner.
- Mỗi bữa ghi rõ tên món (tiếng Việt) + calories + protein + carb + fat.
- Tập trung nguyên liệu dễ mua ở siêu thị Việt Nam (gà, cá, trứng, rau xanh, khoai lang, yến mạch...).
- Tổng năng lượng cả ngày ~ 1500–1900 kcal (tùy BMI & mục tiêu).

Trả về JSON với cấu trúc:

{
  "days": {
    "day1": {
      "breakfast": { "name": string, "calories": number, "protein": number, "carb": number, "fat": number },
      "lunch":     { ... },
      "dinner":    { ... }
    },
    "day2": { ... },
    ...
    "day7": { ... }
  },
  "shopping_list": {
    // key là tên nguyên liệu (tiếng Việt), value là số lượng + đơn vị, ví dụ:
    // "Ức gà": "1.2kg",
    // "Bông cải xanh": "7 cây"
  }
}

Không thêm giải thích ngoài JSON.
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }],
          },
        ],
        generationConfig: {
          response_mime_type: 'application/json',
        },
      }),
    }
  );

  if (!res.ok) {
    throw await handleGeminiError(res);
  }

  const json = await res.json();
  
  // Gemini có thể trả về text hoặc json object trực tiếp
  let raw =
    json?.candidates?.[0]?.content?.parts?.[0]?.text ||
    json?.candidates?.[0]?.content?.parts?.[0]?.json;

  if (!raw) {
    throw new Error('Không đọc được dữ liệu trả về từ Gemini.');
  }

  let parsed;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
  } else {
    parsed = raw;
  }

  if (!parsed || typeof parsed !== 'object' || !parsed.days) {
    throw new Error('AI không tạo được kế hoạch 7 ngày.');
  }

  return parsed;
};
