import { useEffect, useState, useRef } from "react";
export default function Login() {
  //页面加载状态
  const [pageshow, setPageShow] = useState(false);

  useEffect(() => {
    setPageShow(true);
    // init();
  }, []);
  // 未加载完成不展示页面，缺点是服务端渲染无法处理更多内容
  if (!pageshow) return null;
  return <div className="p-10">登录页面</div>;
}
