import React from 'react';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';
interface SFConfigProviderProps {
  children: React.ReactNode;
}
const SFConfigProvider: React.FC<SFConfigProviderProps> = ({ children }) => {
  return (
    <ConfigProvider locale={zhCN}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#e29464',
            borderRadius: 8,
            colorBgContainer: '#ffffff',
          },
          components: {
            Button: {
              borderRadius: 8,
              controlHeight: 36,
            },
            Input: {
              borderRadius: 8,
              controlHeight: 36,
            },
            Select: {
              borderRadius: 8,
              controlHeight: 36,
            },
            Table: {
              headerBg: '#faf5ee',
              headerColor: '#5a3e2b',
              rowHoverBg: '#fdf5ed',
              borderColor: '#f0e6dd',
            },
            Card: {
              borderRadiusLG: 12,
            },
          },
        }}>
        {children}
      </ConfigProvider>
    </ConfigProvider>
  );
};
export default SFConfigProvider;
