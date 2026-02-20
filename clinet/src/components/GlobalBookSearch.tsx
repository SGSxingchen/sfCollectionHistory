'use client';
import React, { useState, useCallback } from 'react';
import { AutoComplete, Input } from 'antd';
import { getRankRecord } from '@/client_api/rank';
import { BookRank } from '@/types/book';
import { debounce } from 'lodash';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface GlobalBookSearchProps {
  size?: 'small' | 'middle';
  placeholder?: string;
  className?: string;
}

const GlobalBookSearch: React.FC<GlobalBookSearchProps> = ({
  size = 'middle',
  placeholder = '搜索作品...',
  className,
}) => {
  const router = useRouter();
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async (keyword: string) => {
    if (!keyword) {
      setOptions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await getRankRecord({
        current: 1,
        size: 10,
        book_name: keyword,
        sort_type: 'collect_num',
        label_type: '',
      });
      if (response.code === 'success' && response?.data?.list) {
        setOptions(
          response.data.list.map((book: BookRank) => ({
            value: String(book.b_id),
            label: book.book_name,
          })),
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchBooks, 300), []);

  const handleSelect = (value: string) => {
    router.push(`/detail?bookId=${value}`);
  };

  return (
    <AutoComplete
      className={className}
      options={options}
      onSearch={debouncedFetch}
      onSelect={handleSelect}
      popupMatchSelectWidth={280}
    >
      <Input
        size={size}
        placeholder={placeholder}
        prefix={loading ? <LoadingOutlined className="text-gray-400" /> : <SearchOutlined className="text-gray-400" />}
        allowClear
      />
    </AutoComplete>
  );
};

export default GlobalBookSearch;
