'use client';
import React, { useEffect, useState } from 'react';
import { getRankRecord } from '@/client_api/rank';
import { BookRank } from '@/types/book';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
export type SortType =
  | 'like_num'
  | 'collect_num'
  | 'comment_num'
  | 'comment_long_num'
  | 'tap_num'
  | 'monthly_pass'
  | 'monthly_ticket_ranking'
  | 'reward_ranking';
interface RankingFilterProps {
  sortType: SortType;
  labelType: string;
}

const getBadgeStyle = (rank: number) => {
  if (rank === 1) return { background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#fff' };
  if (rank === 2) return { background: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)', color: '#fff' };
  if (rank === 3) return { background: 'linear-gradient(135deg, #CD7F32, #A0522D)', color: '#fff' };
  return { background: 'rgba(0,0,0,0.55)', color: '#fff' };
};

const RankingFilter: React.FC<RankingFilterProps> = ({
  sortType,
  labelType,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ranks, setRanks] = useState<BookRank[]>([]);
  const loadRankRecord = async () => {
    try {
      setLoading(true);
      const rankRes = await getRankRecord({
        current: 1,
        size: 10,
        sort_type: sortType,
        label_type: labelType,
        book_name: '',
      });
      if (rankRes.code === 'success') {
        setRanks(rankRes?.data?.list ?? []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadRankRecord();
  }, []);
  return (
    <Spin spinning={loading}>
      <div
        className={
          'book-ranks min-h-[120px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4'
        }>
        {ranks.map((item) => (
          <div
            onClick={() => router.push('/detail?bookId=' + item.b_id)}
            className="group cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white"
            key={item.id}>
            {/* Cover with overlay */}
            <div className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                alt={item.book_name}
                src={item.cover_url}
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/70 to-transparent" />
              {/* Rank badge */}
              <div
                className="absolute top-2 left-2 w-[28px] h-[28px] rounded-lg flex items-center justify-center text-[13px] font-bold shadow-md"
                style={getBadgeStyle(item.rank)}>
                {item.rank}
              </div>
              {/* Book name on cover */}
              <div className="absolute bottom-0 inset-x-0 p-2.5">
                <span className="text-white text-[13px] font-medium leading-tight line-clamp-2 drop-shadow-md">
                  {item.book_name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Spin>
  );
};
export default RankingFilter;
