import { Button } from "antd";
import { useEffect, useState, useLayoutEffect } from "react";
import request from "@/utils/request";
import { DDLogin_goto } from "@/config/constant";
import loginMessageHandle from "@/utils/scanLoginMessage";
export default function Login() {
  //页面加载状态
  const [pageshow, setPageShow] = useState(false);

  useEffect(() => {
    setPageShow(true);
  }, []);
  /**
   * 获取二维码
   * todo Next.js: document is not defined : 
   * https://stackoverflow.com/questions/60629258/next-js-document-is-not-defined
   */
  useEffect(() => {
    if (DDLogin && document.getElementById("login_container")) {
      DDLogin({
        id: "login_container", //这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
        goto: DDLogin_goto, //请参考注释里的方式
        style: "border:none;background-color:#FFFFFF;",
        width: "365",
        height: "400",
      });
      loginMessageHandle();
    }
  }, [pageshow]);
  async function getAccessToken() {
    const res = await request.get("/getAccessToken");
  }
  async function getQrCodeHandle() {
    const res = await request.post("/createQrCode", {
      type: 0,
    });
    console.log(res, "res");
  }
  if (!pageshow) return null;

  return (
    <div className="p-10">
      <div id="login_container"></div>
      <Button onClick={getAccessToken}>获取AccessToken</Button>
      <Button onClick={getQrCodeHandle}>获取二维码</Button>
    </div>
  );
}
