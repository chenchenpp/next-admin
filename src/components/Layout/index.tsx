import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, theme } from "antd";
// todo: 图标ts报错，缺少rev属性，需要保持react与types/react保持一致是因为https://github.com/ant-design/ant-design/issues/43247
import {
  DownloadOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Styles from "./index.module.less";

const { Header, Sider, Content } = Layout;
const PageLayout: React.FC<{ children: any }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const menuData = [
    {
      key: "1",
      icon: <DownloadOutlined />,
      label: "加班报销",
    },
  ];
  const [pageshow, setPageShow] = useState(false);

  useEffect(() => {
    //设置页面加载完成
    setPageShow(true);
    // init();
  }, []);
  if (!pageshow) return null;
  return (
    <Layout className={Styles.layoutContainer}>
      {window.document.body.offsetWidth > 1200 && (
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={menuData}
          />
        </Sider>
      )}

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined rev={undefined} />
              ) : (
                <MenuFoldOutlined />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
