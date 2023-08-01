import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { Button, Input, InputRef } from "antd";
import { getWinWidth } from "@/service/win";
import request from "@/utils/request";
export default function Test() {
  //页面加载状态
  const [pageshow, setPageShow] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const userIdRef = useRef<InputRef>(null);
  const router = useRouter();
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
    let token = userIdRef?.current?.input?.value || "";
    const res = await request.get("/getUserId?token=" + token);
    return Promise.resolve(res);
  }
  async function downloadHandle() {
    let token = userIdRef?.current?.input?.value || "";
    if (showToken && !token) {
      alert(
        "token不能为空: 登录门户网站后，f11打开控制台 -> Application选项 -> Cookies选项 -> 找到.idc1.fn选项中的s98r5h2s6v1m37o的value填写到输入框中"
      );
      return;
    }
    const userInfoRes = await getUserId();
    const usr_id = userInfoRes.body.res_data.user.usr;
    const usr_name = userInfoRes.body.res_data.user.usr_name;
    const store_no = userInfoRes.body.res_data.user.store_no;
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
        usr_name,
        store_no,
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

  async function downloadPdfHandle() {
    const res = await request.get("/downPdf");
  }

  async function getFiledDataHandle() {
    const res = await request.get("/downExcel");
    console.log(res);
  }
  function goLoginHandle() {
    router.push("/login");
  }
  // 未加载完成不展示页面，缺点是服务端渲染无法处理更多内容
  if (!pageshow) return null;
  return (
    <div className="p-10">
      <h1 className="text-lg">生成报销表格</h1>
      <div style={{ color: "red" }} className="pt-10">
        tip: 目前只支持guest wifi, 如果电脑不能连接此wifi，请使用手机
      </div>
      <div className="pt-10">
        获取当前登录的用户信息，由于安全问题暂不可使用，需要设置hosts代理：
      </div>
      <Button className="mt-10" type="primary" onClick={getUserId}>
        用户信息
      </Button>

      <div className="my-10">生成报销文件:</div>
      {showToken && (
        <div className="mt-2">
          <div>填写token: </div>
          <p style={{ color: "red" }}>
            {
              "登录门户网站后，f12打开控制台 -> Application选项 -> Cookies选项 -> 找到.idc1.fn选项中的s98r5h2s6v1m37o的value填写到输入框中"
            }
          </p>
          <div className="flex items-center pt-2 pb-2">
            token: <Input type="text" className="w-1/2" ref={userIdRef} />
          </div>
        </div>
      )}
      <Button type="primary" onClick={downloadHandle} className="mr-10">
        下载报销excel文件
      </Button>

      {/* <Button type="primary" onClick={downloadPdfHandle} className="mr-1">
        下载报销pdf文件
      </Button> */}

      <Button type="primary" onClick={getFiledDataHandle}>
        获取文件数据
      </Button>

      {/* <div>宽度：{window.document.body.offsetWidth}</div> */}
    </div>
  );
}
