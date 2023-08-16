import { Button, Card, Col, Modal, Row, Upload } from "antd";
import request from "@/utils/request";
import type {
  UploadRequestOption as RcCustomRequestOptions,
  RcFile,
} from "rc-upload/lib/interface";
import { useState } from "react";

export default function LargeUpload() {
  const SIZE = 1 * 1024 * 1024;
  const [fileList, setFileList] = useState([]);
  let fileName = "";
  
  async function upLoadHandle(options: RcCustomRequestOptions) {
    const file = options.file as RcFile;
    const { size, name, type, uid } = file;
    const hash = uid;
    fileName = options.filename || "默认名称";

    const local = localStorage.getItem(hash);
    // 进度
    let uploaded = local ? Number(local) : 0;
    while (uploaded < size) {
      const chunk = file.slice(uploaded, uploaded + SIZE, type);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      formData.append("size", size + "");
      formData.append("file", chunk);
      formData.append("hash", hash);
      formData.append("offset", uploaded + "");
      try {
        await request.post("/upload_large", formData, "formData");
      } catch (err) {
        console.log("上传失败");
      }
      uploaded += chunk.size;
      localStorage.setItem(hash, uploaded + "");
    }
  }

  function handlePreview() {}
  function removeHandle() {}
  return (
    <Upload
      listType="picture-card"
      customRequest={upLoadHandle}
      fileList={fileList}
      onPreview={handlePreview}
      onRemove={removeHandle}
    >
      <Button type="primary">大文件上传</Button>
    </Upload>
  );
}
