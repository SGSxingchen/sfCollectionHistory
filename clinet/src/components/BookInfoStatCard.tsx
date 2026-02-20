'use client';
import React from 'react';
import { Statistic, Tag, Tooltip } from 'antd';
import { BookInfo } from '@/types/book';
import { bookIsEunuch } from '@/untils';
import {
  EyeOutlined,
  LikeOutlined,
  StarOutlined,
  CommentOutlined,
  TrophyOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

interface BookInfoStatCardProps {
  bookDetail: BookInfo | null;
}

const BookInfoStatCard: React.FC<BookInfoStatCardProps> = ({ bookDetail }) => {
  if (!bookDetail) return null;

  const isEunuch = bookIsEunuch(bookDetail.last_update_time, bookDetail.finish);

  const bookStatus = isEunuch ? (
    <Tooltip title="已太监, 作品数据将不再维护, 恢复更新后, 请手动提交维护。">
      <Tag color="red" bordered={false}>已太监</Tag>
    </Tooltip>
  ) : bookDetail.finish === 1 ? (
    <Tooltip title="完结作品数据将不再维护, 状态如有更新, 请手动提交维护。">
      <Tag color="green" bordered={false}>已完结</Tag>
    </Tooltip>
  ) : (
    <Tag color="blue" bordered={false}>连载中</Tag>
  );

  const stats = [
    { title: '点击', value: bookDetail.tap_num, icon: <EyeOutlined /> },
    { title: '点赞', value: bookDetail.like_num, icon: <LikeOutlined /> },
    { title: '收藏', value: bookDetail.collect_num, icon: <StarOutlined /> },
    { title: '评论', value: bookDetail.comment_num, icon: <CommentOutlined /> },
    { title: '月票', value: bookDetail.monthly_pass, icon: <TrophyOutlined /> },
    { title: '字数', value: bookDetail.word_count, icon: <FileTextOutlined /> },
  ];

  return (
    <div className="sf-card">
      <div className="flex gap-5 custom-mobile:flex-col">
        {/* Cover */}
        <div className="w-[140px] flex-shrink-0 custom-mobile:w-full custom-mobile:flex custom-mobile:justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-[140px] rounded-lg shadow-sm"
            src={bookDetail.cover_url}
            alt={bookDetail.book_name}
          />
        </div>

        {/* Info & Stats */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Book Name & Status */}
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-primary text-[22px] font-bold m-0">
              {bookDetail.book_name}
            </h2>
            {bookStatus}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-grayLine">
            <span>类型: {bookDetail.book_type}</span>
            {bookDetail.label_type && <span>征文: {bookDetail.label_type}</span>}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 custom-mobile:grid-cols-2 gap-3 mt-2">
            {stats.map((stat) => (
              <div key={stat.title} className="bg-[#faf5ee] rounded-lg p-3">
                <Statistic
                  title={
                    <span className="text-grayLine text-xs flex items-center gap-1">
                      {stat.icon} {stat.title}
                    </span>
                  }
                  value={stat.value}
                  valueStyle={{ color: '#5a3e2b', fontSize: '18px', fontWeight: 600 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookInfoStatCard;
