import { Button, Card, Col, Modal, Row, Upload } from "antd";
import request from "@/utils/request";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { useState } from "react";
import Image from "next/image";
import type { UploadFile } from "antd/es/upload/interface";

export default function UploadPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const [formDataImg, setFormDataImg] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  async function singleUploadFormData(options: RcCustomRequestOptions) {
    const { file } = options;
    let formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);
    const { code, body, msg } = await request.post(
      "/upload_single",
      formData,
      "formData"
    );
    if (code === "200") {
      console.log(body);
      fileList.push(body);
      setFileList([...fileList]);
    }
  }
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file: UploadFile) => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj as RcFile);
    // }
    console.log(file);
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name);
  };
  function removeFileHandle(file: UploadFile) {
    const { uid } = file;
    const index = fileList.findIndex((item) => item.uid === uid);
    fileList.splice(index, 1);
    setFileList([...fileList]);
  }
  return (
    <div>
      <Row gutter={[16, 16]} wrap>
        <Col xl={6} sm={24} md={12} lg={8}>
          <Card title="单一文件上传-formData">
            <div>
              <Upload
                accept="image/png, image/jpeg, image/jpg"
                listType="picture-card"
                customRequest={singleUploadFormData}
                fileList={fileList}
                onPreview={handlePreview}
                onRemove={removeFileHandle}
              >
                <Button type="primary">上传文件</Button>
              </Upload>
            </div>
            <p className="mt-10">
              只能上传png/jpg/jpeg格式图片，且大小不超过2MB
            </p>
            {/* <div>
            <Image
              src={formDataImg}
              alt="formData"
              width={100}
              height={100}
            ></Image>
          </div> */}
          </Card>
        </Col>
        <Col xl={6} sm={24} md={12} lg={8}>
          <Card title="单一文件上传-base64">
            <div>
              <Button type="primary">上传文件</Button>
            </div>
            <p className="mt-10">
              只能上传png/jpg/jpeg格式图片，且大小不超过2MB
            </p>
          </Card>
        </Col>
        <Col xl={6} sm={24} md={12} lg={8}>
          <Card title="单一文件上传-进度管控">
            <div>
              <Button type="primary">上传文件</Button>
            </div>
          </Card>
        </Col>
        <Col xl={6} sm={24} md={12} lg={8}>
          <Card title="多文件上传">
            <div>
              <Button className="mr-10">选择文件</Button>
              <Button type="primary">上传到服务器</Button>
            </div>
          </Card>
        </Col>
        <Col xl={6} sm={24} md={12} lg={8}>
          <Card title="大文件上传">
            <div>
              <Button type="primary">上传图片</Button>
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <Image alt="example" width={100} height={100} src={previewImage} />
      </Modal>
    </div>
  );
}
