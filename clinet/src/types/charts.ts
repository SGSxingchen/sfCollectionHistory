export interface ChartTabConfig {
  key: string;
  label: string;
}

export const CHART_TABS: ChartTabConfig[] = [
  { key: 'tap_num', label: '点击数据' },
  { key: 'like_num', label: '点赞数据' },
  { key: 'collect_num', label: '收藏数据' },
  { key: 'comment_num', label: '评论数据' },
  { key: 'comment_long_num', label: '长评数据' },
  { key: 'monthly_pass', label: '月票数据' },
  { key: 'word_count', label: '字数数据' },
];
