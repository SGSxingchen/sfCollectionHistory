'use client';
import { Suspense } from 'react';
import { Divider } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import SuspenseSpin from '@/components/SuspenseSpin';
import HeroSection from '@/components/HeroSection';
import RankingsSection from '@/components/RankingsSection';
import InclusionEntrance from '@/components/InclusionEntrance';
import InclusionMaintenance from '@/components/InclusionMaintenance';

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      {/* Hero Section */}
      <HeroSection />

      {/* Submission Card */}
      <div className="sf-card">
        <div className="sf-card-title">
          <SendOutlined style={{ color: '#e29464' }} />
          提交入口
        </div>
        <Suspense fallback={<SuspenseSpin />}>
          <InclusionEntrance />
        </Suspense>
        <Divider style={{ margin: '16px 0' }} />
        <Suspense fallback={<SuspenseSpin />}>
          <InclusionMaintenance />
        </Suspense>
      </div>

      {/* Rankings Section */}
      <Suspense fallback={<SuspenseSpin />}>
        <RankingsSection />
      </Suspense>
    </div>
  );
}
