'use client';
import { useEffect, useState } from 'react';
import {
  FieldNumberOutlined,
  HomeOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { key: '/', label: '首页', icon: <HomeOutlined /> },
  { key: '/ranks', label: '排行榜', icon: <FieldNumberOutlined /> },
];

const LayoutHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isFixed, setIsFixed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > window.innerHeight * 0.2);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (key: string) => {
    router.push(key);
    setMobileMenuOpen(false);
  };

  return (
    <div
      className={`w-full z-[10] transition-all ${isFixed ? 'fixed top-0 shadow-lg' : ''}`}
      style={{
        background: 'linear-gradient(135deg, #e29464, #c2734d)',
      }}>
      <div className="custom-pc:w-[80%] custom-mobile:w-[95%] m-auto flex items-center justify-between h-[56px]">
        {/* Brand */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleNav('/')}>
          <span className="text-white text-[20px] font-bold tracking-wide">
            SF轻小说数据网
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden custom-pc:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.key;
            return (
              <div
                key={item.key}
                onClick={() => handleNav(item.key)}
                className="relative px-4 py-2 cursor-pointer text-white/90 hover:text-white transition-colors group">
                <span className="flex items-center gap-1.5 text-[15px]">
                  {item.icon}
                  {item.label}
                </span>
                {/* Active / hover underline */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-white rounded transition-all ${
                    isActive
                      ? 'w-[60%]'
                      : 'w-0 group-hover:w-[60%]'
                  }`}
                />
              </div>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <div
          className="custom-pc:hidden text-white text-[20px] cursor-pointer p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="custom-pc:hidden border-t border-white/20">
          {navItems.map((item) => {
            const isActive = pathname === item.key;
            return (
              <div
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`px-6 py-3 cursor-pointer text-white/90 hover:bg-white/10 transition-colors flex items-center gap-2 ${
                  isActive ? 'bg-white/15 text-white font-medium' : ''
                }`}>
                {item.icon}
                {item.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default LayoutHeader;
