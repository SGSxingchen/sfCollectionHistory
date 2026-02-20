import LayoutHeader from '@/components/LayoutHeader';
import SuspenseSpin from '@/components/SuspenseSpin';
import { Suspense } from 'react';
import Link from 'next/link';

interface DefaultLayoutProps {
  children: React.ReactNode;
}
const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <>
      <header>
        <Suspense fallback={<SuspenseSpin />}>
          <LayoutHeader />
        </Suspense>
      </header>
      <main
        className={
          'custom-pc:w-[80%] custom-mobile:w-[95%] m-auto my-6 p-6 bg-white rounded-xl shadow-sm flex-1'
        }>
        {children}
      </main>
      <footer className="bg-[#f5ebe0] border-t border-[#f0e6dd]">
        <div className="custom-pc:w-[80%] custom-mobile:w-[95%] m-auto py-8">
          <div className="grid custom-pc:grid-cols-3 custom-mobile:grid-cols-1 gap-8">
            {/* Column 1: Site Info */}
            <div>
              <h3 className="text-[#5a3e2b] font-bold text-base mb-3">
                SF轻小说数据网
              </h3>
              <p className="text-grayLine text-sm leading-relaxed">
                菠萝包轻小说作品数据分析平台，提供作品排行榜、历史数据趋势分析、作品对比等功能，助力作者了解作品表现。
              </p>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h3 className="text-[#5a3e2b] font-bold text-base mb-3">
                快速导航
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-grayLine hover:text-primary transition-colors">首页</Link>
                </li>
                <li>
                  <Link href="/ranks" className="text-grayLine hover:text-primary transition-colors">排行榜</Link>
                </li>
                <li>
                  <Link href="/about" className="text-grayLine hover:text-primary transition-colors">关于本站</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Disclaimer */}
            <div>
              <h3 className="text-[#5a3e2b] font-bold text-base mb-3">
                联系与声明
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=_NZERm3fGETb7y1GM4gPsLxLPLrDDZe5&authKey=TvhtgSEdswRDdeMspCpD6O8ubPecckM5Sk0znzlViXzi%2FUg7IgXPIjTKq93uuy6X&noverify=0&group_code=996997193"
                    target="_blank"
                    className="text-grayLine hover:text-primary transition-colors">
                    QQ群: 996997193
                  </a>
                </li>
                <li className="text-grayLine">数据来源于SF轻小说公开信息</li>
                <li className="text-grayLine">数据仅供参考，不构成任何建议</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-4 border-t border-[#e6d5c7] text-center text-xs text-grayLine">
            SF轻小说数据网 &copy; {new Date().getFullYear()} - 数据仅供参考
          </div>
        </div>
      </footer>
    </>
  );
};
export default DefaultLayout;
