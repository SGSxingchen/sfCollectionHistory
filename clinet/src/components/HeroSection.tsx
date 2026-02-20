'use client';
import GlobalBookSearch from '@/components/GlobalBookSearch';

const HeroSection = () => {
  return (
    <div
      className="rounded-xl py-12 px-6 text-center"
      style={{
        background: 'linear-gradient(135deg, #e29464, #c2734d)',
      }}>
      <h1 className="text-white text-[28px] custom-mobile:text-[22px] font-bold mb-2">
        SF轻小说数据分析助手
      </h1>
      <p className="text-white/80 text-sm mb-6">
        查看作品排行、历史数据趋势、多作品对比分析
      </p>
      <div className="max-w-[500px] w-full m-auto">
        <GlobalBookSearch
          size="middle"
          placeholder="输入书名，搜索作品数据..."
          className="w-full"
        />
      </div>
    </div>
  );
};

export default HeroSection;
