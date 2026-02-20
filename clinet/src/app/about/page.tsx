import { Tooltip } from 'antd';
import {
  HeartOutlined,
  QqOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* About Section */}
      <div className="sf-card">
        <div className="sf-card-title">
          <InfoCircleOutlined style={{ color: '#e29464' }} />
          关于本站
        </div>
        <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
          <p>
            SF轻小说数据网是一个面向菠萝包轻小说(SFACG)平台的作品数据分析工具。
            我们定期采集作品的公开数据，为作者和读者提供直观的数据趋势分析。
          </p>
          <p>
            本站数据来源于SF轻小说公开信息，数据仅供参考，不代表官方立场，也不构成任何建议。
          </p>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="sf-card">
        <div className="sf-card-title">
          <BookOutlined style={{ color: '#e29464' }} />
          使用说明
        </div>
        <div className="text-sm text-gray-600 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-[#5a3e2b]">如何收录作品？</h4>
            <ol className="list-decimal list-inside space-y-1 text-grayLine">
              <li>在首页的「提交入口」中，搜索并选择你的作品</li>
              <li>点击「提交」按钮，即可收录</li>
              <li>收录后，系统将定期采集作品数据</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-[#5a3e2b]">如何查看数据？</h4>
            <ol className="list-decimal list-inside space-y-1 text-grayLine">
              <li>使用顶部搜索栏或排行榜找到目标作品</li>
              <li>进入作品详情页，查看各项数据的历史趋势图表</li>
              <li>可选择时间范围和分组类型，还可以与其他作品进行数据对比</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-[#5a3e2b]">关于「太监」状态</h4>
            <p className="text-grayLine">
              连载作品超过30天未更新，系统将自动标记为「太监」状态，并停止数据维护。
              如果作品恢复更新，请在首页的「恢复维护」入口手动提交，即可恢复数据采集。
            </p>
          </div>
        </div>
      </div>

      {/* Sponsor Section */}
      <div className="sf-card">
        <div className="sf-card-title">
          <HeartOutlined style={{ color: '#e29464' }} />
          赞助支持
        </div>
        <p className="text-grayLine text-sm mb-4">
          开发不易，服务器运维需要成本，如果觉得本站有用，欢迎赞助支持。
        </p>
        <div className="flex gap-6 items-start">
          <div className="text-center">
            <Tooltip title="微信赞助">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-[120px] rounded-lg shadow-sm"
                src="/img/IMG_20241220_234004.png"
                alt="微信赞助"
              />
            </Tooltip>
            <p className="text-xs text-grayLine mt-2">微信</p>
          </div>
          <div className="text-center">
            <Tooltip title="支付宝赞助">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-[120px] rounded-lg shadow-sm"
                src="/img/IMG_20241220_234038.jpg"
                alt="支付宝赞助"
              />
            </Tooltip>
            <p className="text-xs text-grayLine mt-2">支付宝</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="sf-card">
        <div className="sf-card-title">
          <QqOutlined style={{ color: '#e29464' }} />
          联系我们
        </div>
        <div className="flex items-center gap-3">
          <a
            className="text-primary hover:text-secondary transition-colors font-medium"
            href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=_NZERm3fGETb7y1GM4gPsLxLPLrDDZe5&authKey=TvhtgSEdswRDdeMspCpD6O8ubPecckM5Sk0znzlViXzi%2FUg7IgXPIjTKq93uuy6X&noverify=0&group_code=996997193"
            target="_blank">
            加入QQ群 (996997193)
          </a>
        </div>
        <p className="text-grayLine text-sm mt-3">
          如果有问题和建议反馈，请加入群聊交流。暂无其它反馈渠道。
        </p>
      </div>

      {/* FAQ */}
      <div className="sf-card">
        <div className="sf-card-title">
          <QuestionCircleOutlined style={{ color: '#e29464' }} />
          常见问题
        </div>
        <div className="space-y-4">
          <div className="border-b border-[#f0e6dd] pb-4">
            <h4 className="font-medium text-[#5a3e2b] mb-2">数据多久更新一次？</h4>
            <p className="text-sm text-grayLine">
              系统每天定时采集一次数据，具体时间可能因服务器负载而有所浮动。
            </p>
          </div>
          <div className="border-b border-[#f0e6dd] pb-4">
            <h4 className="font-medium text-[#5a3e2b] mb-2">为什么搜不到我的作品？</h4>
            <p className="text-sm text-grayLine">
              如果在排行榜和搜索中找不到你的作品，说明该作品尚未被收录。请在首页的「提交入口」中搜索并提交收录。
            </p>
          </div>
          <div className="border-b border-[#f0e6dd] pb-4">
            <h4 className="font-medium text-[#5a3e2b] mb-2">数据和官方不一致怎么办？</h4>
            <p className="text-sm text-grayLine">
              本站数据为定期采集的快照，可能与实时数据存在差异，仅供参考。如发现严重偏差，请在QQ群中反馈。
            </p>
          </div>
          <div className="pb-2">
            <h4 className="font-medium text-[#5a3e2b] mb-2">如何恢复已太监作品的数据维护？</h4>
            <p className="text-sm text-grayLine">
              在首页的「恢复维护」入口中搜索你的作品并提交即可。系统会重新开始采集该作品的数据。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
