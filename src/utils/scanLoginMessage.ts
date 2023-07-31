import request from "@/utils/request";

export default function loginMessageHandle() {
  var handleMessage = async function (event: any) {
    var origin = event.origin;
    console.log("origin", event);
    if (origin == "https://login.dingtalk.com") {
      //判断是否来自ddLogin扫码事件。
      var loginTmpCode = event.data;
      //获取到loginTmpCode后就可以在这里构造跳转链接进行跳转了
      const res = await request.get(
        "/getUserInfo?tmpAuthCode=" + loginTmpCode
      );
      console.log("loginTmpCode", res);
    }
  };
  if (typeof window.addEventListener != "undefined") {
    window.addEventListener("message", handleMessage, false);
  } else if (typeof window.attachEvent != "undefined") {
    window.attachEvent("onmessage", handleMessage);
  }
}
