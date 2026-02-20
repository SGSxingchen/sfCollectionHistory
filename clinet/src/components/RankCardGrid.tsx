'use client';
import React from 'react';
import { BookRank } from '@/types/book';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { sortTypes } from '@/types/enums';

interface RankCardGridProps {
  data: BookRank[];
  loading: boolean;
  sortType: string;
}

const getBadgeStyle = (rank: number) => {
  if (rank === 1) return { background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#fff' };
  if (rank === 2) return { background: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)', color: '#fff' };
  if (rank === 3) return { background: 'linear-gradient(135deg, #CD7F32, #A0522D)', color: '#fff' };
  return { background: 'rgba(0,0,0,0.55)', color: '#fff' };
};

const RankCardGrid: React.FC<RankCardGridProps> = ({ data, loading, sortType }) => {
  const router = useRouter();

  const sortLabel = sortTypes.find((s) => s.value === sortType)?.label ?? sortType;

  return (
    <Spin spinning={loading}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(`/detail?bookId=${item.b_id}`)}
            className="group cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white"
          >
            {/* Cover */}
            <div className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                alt={item.book_name}
                src={item.cover_url}
              />
              <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/70 to-transparent" />
              {/* Rank badge */}
              <div
                className="absolute top-2 left-2 w-[28px] h-[28px] rounded-lg flex items-center justify-center text-[13px] font-bold shadow-md"
                style={getBadgeStyle(item.rank)}
              >
                {item.rank}
              </div>
              {/* Book name */}
              <div className="absolute bottom-0 inset-x-0 p-2.5">
                <span className="text-white text-[13px] font-medium leading-tight line-clamp-2 drop-shadow-md">
                  {item.book_name}
                </span>
              </div>
            </div>

            {/* Data below cover */}
            <div className="p-3">
              <div className="text-xs text-grayLine">
                {item.word_count.toLocaleString()} 字
              </div>
              <div className="text-primary text-sm font-bold mt-1">
                {sortLabel}: {((item as any)[sortType] ?? 0).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Spin>
  );
};

export default RankCardGrid;
