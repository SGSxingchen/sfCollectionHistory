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

const getRankColor = (rank: number) => {
  if (rank === 1) return '#FFA500';
  if (rank === 2) return '#A0A0A0';
  if (rank === 3) return '#CD7F32';
  return undefined;
};

const getMetricValue = (item: BookRank, sortType: SortType): string => {
  const val = item[sortType as keyof BookRank];
  if (typeof val === 'number') return val.toLocaleString();
  return String(val ?? '');
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
      <div className="flex flex-col gap-1 min-h-[120px]">
        {ranks.map((item) => (
          <div
            onClick={() => router.push('/detail?bookId=' + item.b_id)}
            className="flex items-center gap-3 cursor-pointer hover:bg-[#faf5ee] rounded-lg px-2 py-1.5 transition-colors"
            key={item.id}>
            {/* Rank number */}
            <span
              className="w-6 text-center text-sm font-bold flex-shrink-0"
              style={{ color: getRankColor(item.rank) || '#999' }}>
              {item.rank}
            </span>
            {/* Cover */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-[36px] h-[48px] rounded object-cover flex-shrink-0"
              alt={item.book_name}
              src={item.cover_url}
            />
            {/* Book name */}
            <span className="flex-1 text-sm truncate text-gray-800">
              {item.book_name}
            </span>
            {/* Metric value */}
            <span className="text-xs text-gray-400 flex-shrink-0">
              {getMetricValue(item, sortType)}
            </span>
          </div>
        ))}
      </div>
    </Spin>
  );
};
export default RankingFilter;
