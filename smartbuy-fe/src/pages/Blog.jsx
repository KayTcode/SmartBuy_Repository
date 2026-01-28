import { useLocale } from '../i18n/LocaleContext.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { IconArrowRight } from '../components/icons.jsx';

const blogPosts = [
  {
    id: 1,
    title: '5 loại nước ép giúp thanh lọc cơ thể trong 7 ngày',
    excerpt: 'Khởi động ngày mới với nước ép xanh từ rau củ hữu cơ giúp detox cơ thể nhẹ nhàng. Các loại nước ép từ cần tây, dưa chuột, rau chân vịt không chỉ cung cấp vitamin mà còn hỗ trợ quá trình đào thải độc tố tự nhiên.',
    category: 'Sống khỏe',
    date: '15/01/2024',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
    readTime: '5 phút đọc'
  },
  {
    id: 2,
    title: 'Trọn bộ thực đơn eat clean dễ làm cho gia đình',
    excerpt: 'Kết hợp rau củ theo mùa cùng protein thực vật giúp cân bằng dinh dưỡng hằng ngày. Thực đơn eat clean không chỉ tốt cho sức khỏe mà còn dễ dàng chuẩn bị, phù hợp với cuộc sống bận rộn của gia đình hiện đại.',
    category: 'Công thức',
    date: '12/01/2024',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    readTime: '8 phút đọc'
  },
  {
    id: 3,
    title: 'Làm sao để bảo quản rau củ luôn tươi giòn?',
    excerpt: 'Học ngay mẹo bảo quản rau củ trong tủ lạnh giúp giữ độ tươi lâu hơn 3 ngày. Từ cách phân loại, đóng gói đến nhiệt độ bảo quản phù hợp, tất cả sẽ giúp bạn tiết kiệm và luôn có nguyên liệu tươi ngon cho bữa ăn.',
    category: 'Bí quyết bếp',
    date: '10/01/2024',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
    readTime: '6 phút đọc'
  },
  {
    id: 4,
    title: 'Dinh dưỡng hợp lý cho người tập thể dục',
    excerpt: 'Chế độ ăn uống đúng cách là yếu tố quan trọng để đạt hiệu quả tập luyện tốt nhất. Tìm hiểu cách kết hợp carbohydrate, protein và chất béo lành mạnh để cung cấp năng lượng và phục hồi cơ bắp sau mỗi buổi tập.',
    category: 'Dinh dưỡng',
    date: '08/01/2024',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    readTime: '7 phút đọc'
  },
  {
    id: 5,
    title: 'Thực phẩm hữu cơ: Lợi ích và cách nhận biết',
    excerpt: 'Thực phẩm hữu cơ không chỉ tốt cho sức khỏe mà còn thân thiện với môi trường. Bài viết này sẽ giúp bạn hiểu rõ về tiêu chuẩn hữu cơ, cách nhận biết sản phẩm thật và lợi ích lâu dài cho gia đình.',
    category: 'Kiến thức',
    date: '05/01/2024',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80',
    readTime: '10 phút đọc'
  }
];

function Blog() {
  const { t } = useLocale();

  return (
    <div className="space-y-16">
      <section className="mx-auto max-w-7xl px-4 pt-10">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Blog
          </span>
          <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
            {t('home.news.title')}
          </h1>
          <p className="text-base leading-relaxed text-slate-600 md:text-lg">
            {t('home.news.description')}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-[0_20px_40px_rgba(59,183,126,0.15)]"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{post.date}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
                  {post.excerpt}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-dark"
                  onClick={(e) => {
                    e.preventDefault();
                    // Có thể thêm chức năng đọc chi tiết sau
                  }}
                >
                  {t('home.news.readMore')}
                  <IconArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Newsletter />
    </div>
  );
}

export default Blog;
