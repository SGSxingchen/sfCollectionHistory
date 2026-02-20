'use client';
import RankingFilter from '@/components/RankingFilter';
import { Tabs } from 'antd';
import {
  GiftOutlined,
  LikeOutlined,
  CommentOutlined,
} from '@ant-design/icons';

const rankConfigs = [
  { key: 'reward_ranking', title: '打赏排名', icon: <GiftOutlined style={{ color: '#e29464' }} /> },
  { key: 'monthly_pass', title: '月票排名', icon: <LikeOutlined style={{ color: '#e29464' }} /> },
  { key: 'comment_num', title: '评论排名', icon: <CommentOutlined style={{ color: '#e29464' }} /> },
] as const;

const RankingsSection = () => {
  return (
    <>
      {/* PC: 3 columns */}
      <div className="hidden custom-pc:grid custom-pc:grid-cols-3 gap-6">
        {rankConfigs.map((config) => (
          <div className="sf-card" key={config.key}>
            <div className="sf-card-title">
              {config.icon}
              {config.title}
            </div>
            <RankingFilter labelType="" sortType={config.key} />
          </div>
        ))}
      </div>

      {/* Mobile: Tabs */}
      <div className="custom-pc:hidden">
        <div className="sf-card">
          <Tabs
            defaultActiveKey="reward_ranking"
            items={rankConfigs.map((config) => ({
              key: config.key,
              label: (
                <span className="flex items-center gap-1">
                  {config.icon}
                  {config.title}
                </span>
              ),
              children: (
                <RankingFilter labelType="" sortType={config.key} />
              ),
            }))}
          />
        </div>
      </div>
    </>
  );
};

export default RankingsSection;
