import LayoutHeader from '@/components/LayoutHeader';
import SuspenseSpin from '@/components/SuspenseSpin';
import { Suspense } from 'react';

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
      <footer className="custom-pc:w-[80%] custom-mobile:w-[95%] m-auto py-6 text-center text-sm text-grayLine">
        <p>SF轻小说数据网 - 数据仅供参考</p>
      </footer>
    </>
  );
};
export default DefaultLayout;
