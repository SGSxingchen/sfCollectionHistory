'use client';
import { Button, Input, Pagination, Select, Segmented, Table, Tag, Tooltip } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { sortTypes } from '@/types/enums';
import LabelTypeSearchSelecter from '@/components/LabelTypeSearchSelecter';
import { getRankRecord } from '@/client_api/rank';
import { BookRank } from '@/types/book';
import lodash from 'lodash';
import { useRouter } from 'next/navigation';
import { bookIsEunuch } from '@/untils';
import {
  SearchOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import RankCardGrid from '@/components/RankCardGrid';

const Ranks = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const [bookName, setBookName] = useState('');
  const [sortType, setSortType] = useState('collect_num');
  const [labelType, setLabelType] = useState('');
  const [tableData, setTableData] = useState<BookRank[]>([]);
  const [current, setCurrent] = useState(1);
  const [size, setSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  const columns = useMemo(() => {
    const cols = [
      {
        width: 80,
        title: '排名',
        dataIndex: 'rank',
        fixed: true,
        key: 'rank',
        render(value: number) {
          if (value <= 3) {
            const colors: Record<number, string> = { 1: 'gold', 2: '#aaa', 3: '#cd7f32' };
            return (
              <span
                className="inline-flex items-center justify-center w-[28px] h-[28px] rounded-lg text-white text-[13px] font-bold"
                style={{ background: colors[value] }}>
                {value}
              </span>
            );
          }
          return <span className="text-gray-500 font-medium">{value}</span>;
        },
      },
      {
        width: 150,
        title: '书名',
        dataIndex: 'book_name',
        key: 'book_name',
        render(value: string, item: BookRank) {
          return (
            <div
              onClick={() => {
                router.push(`/detail?bookId=${item.b_id}`);
              }}
              className={'text-primary cursor-pointer hover:text-secondary transition-colors font-medium'}>
              {value}
            </div>
          );
        },
      },
      {
        width: 70,
        title: '类型',
        dataIndex: 'book_type',
        key: 'book_type',
      },
      {
        width: 150,
        title: '征文类型',
        dataIndex: 'label_type',
        key: 'label_type',
      },
      {
        width: 150,
        title: '标签',
        dataIndex: 'tags',
        key: 'tags',
        render(value: string, item: BookRank) {
          const isMoreThan30DaysOld = bookIsEunuch(
            item.last_update_time,
            item.finish,
          );
          const tags = value.split(',');
          const tagsMap = tags.map((tag, idx) => (
            <Tag
              className={'ml-1 mb-1'}
              color={'blue'}
              bordered={false}
              key={`${tag}-${idx}`}>
              {tag}
            </Tag>
          ));
          if (item.finish === 1) {
            tagsMap.push(
              <Tooltip
                key={'完结'}
                title={
                  '作品已完结, 数据不再维护, 状态如有更新, 请手动提交维护，'
                }>
                <Tag
                  className={'ml-1 mb-1'}
                  color={'success'}
                  bordered={false}>
                  完结
                </Tag>
              </Tooltip>,
            );
          } else if (isMoreThan30DaysOld) {
            tagsMap.push(
              <Tooltip
                key={'太监'}
                title={
                  '超过30天未更新, 将不再维护作品数据。作品恢复更新后, 请手动提交维护。'
                }>
                <Tag
                  className={'ml-1 mb-1'}
                  color={'red'}
                  bordered={false}>
                  太监
                </Tag>
              </Tooltip>,
            );
          } else {
            tagsMap.push(
              <Tooltip
                key={'连载中'}
                title={
                  '正常连载中, 如果30天未更新, 作品将会太监, 数据不再正常维护。'
                }>
                <Tag
                  className={'ml-1 mb-1'}
                  color={'success'}
                  bordered={false}>
                  连载中
                </Tag>
              </Tooltip>,
            );
          }
          return tagsMap;
        },
      },
      {
        width: 150,
        title: '封面',
        dataIndex: 'cover_url',
        key: 'cover_url',
        render: (coverUrl: string) => (
          <img
            src={coverUrl}
            alt="cover"
            className="rounded-md shadow-sm"
            style={{ width: '100px', height: 'auto' }}
          />
        ),
      },
      {
        width: 150,
        title: '字数',
        dataIndex: 'word_count',
        key: 'word_count',
        render(value: number) {
          return value.toLocaleString();
        },
      },
      {
        width: 150,
        title: '点击数',
        dataIndex: 'tap_num',
        key: 'tap_num',
        render(value: number) {
          return value.toLocaleString();
        },
      },
      {
        width: 150,
        title: '点赞数',
        dataIndex: 'like_num',
        key: 'like_num',
        render(value: number) {
          return value.toLocaleString();
        },
      },
      {
        width: 150,
        title: '收藏数',
        dataIndex: 'collect_num',
        key: 'collect_num',
        render(value: number) {
          return value.toLocaleString();
        },
      },
      {
        width: 150,
        title: '评论数',
        dataIndex: 'comment_num',
        key: 'comment_num',
        render(value: number) {
          return value.toLocaleString();
        },
      },
      {
        width: 150,
        title: '长评数',
        dataIndex: 'comment_long_num',
        key: 'comment_long_num',
        render(value: number) {
          return value.toLocaleString();
        },
      },
      {
        width: 150,
        title: '月票',
        dataIndex: 'monthly_pass',
        key: 'monthly_pass',
        render(value: number) {
          return value.toLocaleString();
        },
      },
      {
        width: 150,
        title: '主站月票排名',
        dataIndex: 'monthly_ticket_ranking',
        key: 'monthly_ticket_ranking',
      },
      {
        width: 150,
        title: '主站打赏排名',
        dataIndex: 'reward_ranking',
        key: 'reward_ranking',
      },
      {
        width: 120,
        title: '数据刷新时间',
        dataIndex: 'created_time',
        key: 'created_time',
      },
      {
        width: 160,
        title: '作品最后更新时间',
        dataIndex: 'last_update_time',
        key: 'last_update_time',
      },
    ];
    for (const index in cols) {
      const col = cols[index];
      if (col.key === sortType) {
        const colClone = lodash.cloneDeep(col);
        cols.splice(Number(index), 1);
        cols.splice(6, 0, colClone);
        break;
      }
    }
    return cols;
  }, [tableData]);
  const loadTableData = async (newPage?: number, newSize?: number) => {
    setLoading(true);
    try {
      const data = await getRankRecord({
        current: newPage || current,
        size: newSize || size,
        sort_type: sortType,
        label_type: labelType,
        book_name: bookName,
      });
      if (data.code === 'success' && data?.data) {
        setTableData(data.data?.list);
        setTotal(data.data.total_num);
        if (newPage && newSize) {
          setCurrent(newPage);
          setSize(newSize);
        }
        setLoading(false);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
    } catch (err: never) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    loadTableData(1, 20);
  }, []);
  return (
    <div className={'w-full h-full flex flex-col books-rank'}>
      <h1 className="sf-section-title mb-4">排行榜</h1>

      {/* Query Card */}
      <div className="sf-card mb-6">
        <div className="flex flex-wrap custom-mobile:flex-col gap-4 items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-[70px]">书名:</span>
            <Input
              className="w-[180px]"
              placeholder="搜索书名"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-[70px]">排序方式:</span>
            <Select
              className={'w-[120px]'}
              options={sortTypes}
              onChange={(value) => setSortType(value)}
              value={sortType}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-[70px]">征文类型:</span>
            <LabelTypeSearchSelecter
              placeholder={'请选择征文类型'}
              className={'w-[210px]'}
              onChange={(value) => setLabelType(value)}
              value={labelType}
            />
          </div>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => {
              loadTableData(1, size);
            }}>
            查询
          </Button>
        </div>
      </div>

      {/* View Toggle + Count */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-grayLine">
          共 {total} 部作品
        </div>
        <Segmented
          options={[
            { label: '表格', value: 'table', icon: <UnorderedListOutlined /> },
            { label: '卡片', value: 'card', icon: <AppstoreOutlined /> },
          ]}
          value={viewMode}
          onChange={(value) => setViewMode(value as 'table' | 'card')}
        />
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <div className="sf-card p-0 overflow-hidden">
          <div
            ref={tableRef}
            className="h-[80vh] relative w-full overflow-hidden">
            <div className={'absolute w-full h-full'}>
              <Table
                loading={loading}
                tableLayout={'fixed'}
                pagination={false}
                scroll={{
                  x: columns.reduce((count, item) => {
                    count += item?.width as number;
                    return count;
                  }, 0),
                  y: 'calc(80vh - 100px)',
                }}
                columns={columns}
                className={'w-full'}
                bordered
                dataSource={tableData}
                rowKey="id"
                rowClassName={(_, index) =>
                  index % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]'
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="sf-card">
          <RankCardGrid data={tableData} loading={loading} sortType={sortType} />
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Pagination
          onChange={(page, size) => {
            loadTableData(page, size);
          }}
          current={current}
          total={total}
          pageSize={size}
        />
      </div>
    </div>
  );
};
export default Ranks;
