'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { DatePicker, Select, Button, Spin, message, Tabs } from 'antd';
import { getBookDetail, getBookDetailHistory } from '@/client_api/detail';
import { BookInfo } from '@/types/book';
import { alignBookData } from '@/untils';
import { CHART_TABS } from '@/types/charts';
import DataLineCharts from '@/components/DataLineCharts';
import BookInfoStatCard from '@/components/BookInfoStatCard';
import dayjs from 'dayjs';
import BookSelect from '@/components/BookSelect';
import SuspenseSpin from '@/components/SuspenseSpin';
import {
  CalendarOutlined,
  SearchOutlined,
  SwapOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const getChartX = (books: BookInfo[]) => {
  return books.map((book: BookInfo) => book.created_time);
};

const getChartService = (name: string, books: BookInfo[], key: PropertyKey) => {
  return {
    name,
    type: 'line',
    data: books.map((book: any) => book[key]),
  };
};

const BookDetailPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const query = useSearchParams();
  const [datePicker, setDatePicker] = useState<any>([
    dayjs().subtract(365, 'day'),
    dayjs(),
  ]);
  const [otherBookId, setOtherBookId] = useState('');
  const [otherBookDetail, setOtherBookDetail] = useState<BookInfo | null>(null);
  const [bookDetail, setBookDetail] = useState<BookInfo | null>(null);
  const [booksHistory, setBooksHistory] = useState<BookInfo[]>([]);
  const [otherBooksHistory, setOtherBooksHistory] = useState<BookInfo[]>([]);
  const [groupType, setGroupType] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const loadBookDetail = async () => {
    const bookId = query.get('bookId');
    if (bookId) {
      setLoading(true);
      try {
        const data = await getBookDetail(bookId);
        if (data.code === 'success') {
          setBookDetail(data.data as BookInfo);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: any) {
        messageApi.error('获取作品信息失败, 请前往提交入口, 提交收录');
      } finally {
        setLoading(false);
      }
    } else {
      message.error('Book not found');
    }
  };
  const loadOtherBookDetail = async () => {
    if (otherBookId) {
      setLoading(true);
      try {
        const data = await getBookDetail(otherBookId);
        if (data.code === 'success') {
          setOtherBookDetail(data.data as BookInfo);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: any) {
        messageApi.error('获取作品信息失败, 请前往提交入口, 提交收录');
      } finally {
        setLoading(false);
      }
    } else {
      message.error('Book not found');
    }
  };
  const loadHistory = async (bookId: string) => {
    setLoading(true);
    try {
      const data = await getBookDetailHistory({
        b_id: Number(bookId),
        group_type: groupType,
        start_date: dayjs(datePicker[0]).format('YYYY-MM-DD'),
        end_date: dayjs(datePicker[1]).format('YYYY-MM-DD'),
      });
      if (data.code === 'success') {
        setBooksHistory(data.data as BookInfo[]);
      } else {
        message.error('Failed to load book history');
      }
    } finally {
      setLoading(false);
    }
  };
  const loadOtherHistory = async () => {
    if (!otherBookId) {
      return;
    }
    setLoading(true);
    try {
      const data = await getBookDetailHistory({
        b_id: Number(otherBookId),
        group_type: groupType,
        start_date: dayjs(datePicker[0]).format('YYYY-MM-DD'),
        end_date: dayjs(datePicker[1]).format('YYYY-MM-DD'),
      });
      if (data.code === 'success') {
        setOtherBooksHistory(data.data as BookInfo[]);
      } else {
        message.error('Failed to load book history');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookDetail();
    const bookId = query.get('bookId');
    if (bookId) {
      loadHistory(bookId);
    }
  }, []);

  const getBookDataLine = useCallback(
    (key: string, label: string) => {
      if (otherBooksHistory.length > 0 && otherBookId) {
        const { alignedArr1, alignedArr2 } = alignBookData(
          booksHistory,
          otherBooksHistory,
        );
        return (
          <DataLineCharts
            xData={getChartX(alignedArr1)}
            title={label}
            height={450}
            seriesData={[
              getChartService(bookDetail?.book_name ?? '', alignedArr1, key),
              getChartService(
                otherBookDetail?.book_name ?? '',
                alignedArr2,
                key,
              ),
            ]}
          />
        );
      } else {
        return (
          <DataLineCharts
            xData={getChartX(booksHistory)}
            title={label}
            height={450}
            seriesData={[
              getChartService(bookDetail?.book_name ?? '', booksHistory, key),
            ]}
          />
        );
      }
    },
    [booksHistory, bookDetail, otherBooksHistory, otherBookDetail],
  );

  return (
    <div>
      {contextHolder}
      <h1 className="sf-section-title mb-2">作品详情 / 历史数据</h1>
      <div className="text-sm text-grayLine space-y-1 mb-4">
        <p>
          注意: 连载作品超过30天未更新, 状态视为太监,
          数据将不再进行维护。完结作品数据, 也将不再维护。
        </p>
        <p>
          默认最大查询时间范围为: 1年；按年查询, 范围最大5年。
        </p>
      </div>

      {/* Query Card */}
      <div className="sf-card mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-primary" />
            <span className="text-sm text-gray-500 w-[70px]">时间范围:</span>
            <RangePicker
              value={datePicker}
              onChange={(dates) => setDatePicker(dates)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-[70px]">分组类型:</span>
            <Select value={groupType} onChange={setGroupType}>
              <Option value={1}>天</Option>
              <Option value={2}>月</Option>
              <Option value={3}>年</Option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <SwapOutlined className="text-primary" />
            <span className="text-sm text-gray-500 w-[70px]">对比作品:</span>
            <BookSelect
              className={'w-[200px]'}
              value={otherBookId}
              onChange={setOtherBookId}
            />
          </div>
          <Button
            type={'primary'}
            icon={<SearchOutlined />}
            onClick={() => {
              loadHistory(query.get('bookId') as string);
              loadOtherHistory();
              loadOtherBookDetail();
            }}>
            查询
          </Button>
        </div>
      </div>

      <Spin spinning={loading}>
        {/* Book Info Stat Card */}
        <BookInfoStatCard bookDetail={bookDetail} />

        {/* Charts in Tabs */}
        <div className="sf-card mt-6">
          <Tabs
            defaultActiveKey="tap_num"
            items={CHART_TABS.map((tab) => ({
              key: tab.key,
              label: tab.label,
              children: getBookDataLine(tab.key, tab.label),
            }))}
          />
        </div>
      </Spin>
    </div>
  );
};

const DetailPage = () => {
  return (
    <Suspense fallback={<SuspenseSpin />}>
      <BookDetailPage />
    </Suspense>
  );
};
export default DetailPage;
