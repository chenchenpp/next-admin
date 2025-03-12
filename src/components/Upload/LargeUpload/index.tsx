import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import request from "@/utils/request";
import type {
  UploadRequestOption as RcCustomRequestOptions,
  RcFile,
} from "rc-upload/lib/interface";
import { useState } from "react";

export default function LargeUpload() {
  const SIZE = 1 * 1024 * 1024;
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  let fileName = "";

  const handleChange: UploadProps["onChange"] = (info) => {
    let newFileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    newFileList = newFileList.slice(-2);

    // 2. Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);
  };

  async function upLoadHandle(options: RcCustomRequestOptions) {
    const file = options.file as RcFile;
    const { size, name, type, uid } = file;
    // 哈希标识，区分文件唯一
    const hash = uid;
    fileName = options.filename || "默认名称";
    const local = localStorage.getItem(hash);
    // 已上传的文件大小
    let uploaded = local ? Number(local) : 0;
    while (uploaded < size) {
      const chunk = file.slice(uploaded, uploaded + SIZE, type);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      // 总文件大小
      formData.append("size", size + "");
      // 当前需要上传部分切片
      formData.append("file", chunk);
      formData.append("hash", hash);
      formData.append("offset", uploaded + "");
      try {
        await request.post("/upload_large", formData, "formData");
      } catch (err) {
        console.log("上传失败");
      }
      uploaded += chunk.size;
      // 处理进度条
      const percent = (uploaded / size) * 100;
      const copyFileList = JSON.parse(JSON.stringify(fileList));
      copyFileList.forEach((item: any) => {
        item.percent = percent;
        if (percent === 100) {
          item.status = "done";
        }
      });
      setFileList(copyFileList);
      localStorage.setItem(hash, uploaded + "");
    }
  }

  function handlePreview() {}
  function removeHandle() {}
  return (
    <Upload
      customRequest={upLoadHandle}
      fileList={fileList}
      onPreview={handlePreview}
      onRemove={removeHandle}
      onChange={handleChange}
    >
      <Button type="primary">大文件上传</Button>
    </Upload>
  );
}
