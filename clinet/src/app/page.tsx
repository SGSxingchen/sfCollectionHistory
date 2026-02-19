import RankingFilter from '@/components/RankingFilter';
import SuspenseSpin from '@/components/SuspenseSpin';
import { Suspense } from 'react';
import { Divider, Tooltip } from 'antd';
import {
  HeartOutlined,
  QqOutlined,
  SendOutlined,
} from '@ant-design/icons';
import InclusionEntrance from '@/components/InclusionEntrance';
import InclusionMaintenance from '@/components/InclusionMaintenance';
export default function Home() {
  return (
    <div className={'flex flex-col gap-6'}>
      {/* Sponsor Card */}
      <div className="sf-card">
        <div className="sf-card-title">
          <HeartOutlined style={{ color: '#e29464' }} />
          我很可爱请给我钱
        </div>
        <p className={'text-grayLine text-sm mb-4'}>
          开发不易, 服务器运维需要成本, 有能力请赞助。
        </p>
        <div className="flex gap-6 items-start">
          <div className="text-center">
            <Tooltip title={'微信赞助'}>
              <img
                className={'w-[120px] rounded-lg shadow-sm'}
                src={'/img/IMG_20241220_234004.png'}
                alt={'微信赞助'}
              />
            </Tooltip>
            <p className="text-xs text-grayLine mt-2">微信</p>
          </div>
          <div className="text-center">
            <Tooltip title={'支付宝赞助'}>
              <img
                className={'w-[120px] rounded-lg shadow-sm'}
                src={'/img/IMG_20241220_234038.jpg'}
                alt={'支付宝赞助'}
              />
            </Tooltip>
            <p className="text-xs text-grayLine mt-2">支付宝</p>
          </div>
        </div>
      </div>

      {/* QQ Group Card */}
      <div className="sf-card">
        <div className="sf-card-title">
          <QqOutlined style={{ color: '#e29464' }} />
          官方群
        </div>
        <div className="flex items-center gap-3">
          <a
            className={'text-primary hover:text-secondary transition-colors font-medium'}
            href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=_NZERm3fGETb7y1GM4gPsLxLPLrDDZe5&authKey=TvhtgSEdswRDdeMspCpD6O8ubPecckM5Sk0znzlViXzi%2FUg7IgXPIjTKq93uuy6X&noverify=0&group_code=996997193"
            target={'_blank'}>
            加入QQ群
          </a>
        </div>
        <p className={'text-grayLine text-sm mt-3'}>
          如果有问题和建议反馈, 请加入群聊交流。暂无其它反馈渠道。
        </p>
      </div>

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

      {/* Rankings */}
      <Suspense fallback={<SuspenseSpin />}>
        <div className="sf-card">
          <div className="sf-card-title">打赏排名</div>
          <RankingFilter labelType={''} sortType={'reward_ranking'} />
        </div>
        <div className="sf-card">
          <div className="sf-card-title">月票排名</div>
          <RankingFilter labelType={''} sortType={'monthly_pass'} />
        </div>
        <div className="sf-card">
          <div className="sf-card-title">作品评论排名</div>
          <RankingFilter labelType={''} sortType={'comment_num'} />
        </div>
      </Suspense>
    </div>
  );
}
