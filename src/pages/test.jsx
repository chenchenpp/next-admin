import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import Button from "@/components/button";
import { getWinWidth } from "@/service/win";
import request from "@/utils/request";
export default function Test() {
  //页面加载状态
  const [pageshow, setPageShow] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const userIdRef = useRef();
  const wid = getWinWidth();

  useEffect(() => {
    //设置页面加载完成
    console.log(location);
    if (location.host.includes("idc")) {
      setShowToken(false);
    } else {
      setShowToken(true);
    }
    setPageShow(true);
    // init();
  }, []);
  async function getUserId() {
    let token = userIdRef?.current?.value || '';
    const res = await request.get("/getUserId?token=" + token);
    return Promise.resolve(res);
  }
  async function downloadHandle() {
    if (showToken && !userIdRef.current.value) {
      alert(
        "token不能为空: 登录门户网站后，f11打开控制台 -> Application选项 -> Cookies选项 -> 找到.idc1.fn选项中的s98r5h2s6v1m37o的value填写到输入框中"
      );
      return;
    }
    const userInfoRes = await getUserId();
    const usr_id = userInfoRes.body.res_data.user.usr;
    const usr_name = userInfoRes.body.res_data.user.usr_name;
    let year = dayjs().year();
    let month = dayjs().month() + 1;
    if (month === 1) {
      year -= 1;
      month = 12;
    } else {
      month -= 1;
    }
    const yearMonth = `${year}-${month}`;
    const days = dayjs(yearMonth).daysInMonth();
    const sdate = dayjs(`${yearMonth}-01`).format("YYYY-MM-DD");
    const edate = dayjs(`${yearMonth}-${days}`).format("YYYY-MM-DD");
    const res = await request.post(
      "/downExcel",
      {
        usr_id,
        sdate,
        edate,
        usr_name
      },
      "file"
    );
    console.log(res);

    if (res.code == "404") {
      return;
    }
    const link = document.createElement("a");

    link.style.display = "none";
    // a 标签的 download 属性就是下载下来的文件名
    link.download = "报销明细.xlsx";
    var blob = new Blob([res], { type: "application/octet-stream" });
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    // 释放的 URL 对象以及移除 a 标签
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  }
  async function getFiledDataHandle() {
    const res = await request.get("/downExcel");
    console.log(res);
  }
  // 未加载完成不展示页面，缺点是服务端渲染无法处理更多内容
  if (!pageshow) return null;
  return (
    <div>
      <h1>生成报销表格</h1>
      <div style={{ color: "red" }}>
        tip: 目前只支持guest wifi, 如果电脑不能连接此wifi，请使用手机
      </div>
      <div>
        获取当前登录的用户信息，由于安全问题暂不可使用，需要设置hosts代理：
      </div>
      <Button onClick={getUserId}>用户信息</Button>

      <div>生成报销文件:</div>
      {showToken && (
        <div>
          <div>填写token: </div>
          <p style={{ color: "red" }}>
            {
              "登录门户网站后，f11打开控制台 -> Application选项 -> Cookies选项 -> 找到.idc1.fn选项中的s98r5h2s6v1m37o的value填写到输入框中"
            }
          </p>
          <div>
            token: <input type="text" ref={userIdRef} />
          </div>
        </div>
      )}

      <Button onClick={downloadHandle}>下载报销文件</Button>

      <Button onClick={getFiledDataHandle}>获取文件数据</Button>
      <div>宽度：{window.document.body.offsetWidth}</div>
    </div>
  );
}
