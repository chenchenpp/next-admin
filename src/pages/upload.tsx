import { Button, Card, Col, Row } from "antd";

export default function Upload() {
  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card title="单一文件上传-formData">
          <div>
            <Button className="mr-10">选择文件</Button>
            <Button type="primary">上传文件</Button>
          </div>
          <p className="mt-10">只能上传png/jpg/jpeg格式图片，且大小不超过2MB</p>
        </Card>
      </Col>
      <Col span={6}>
        <Card title="单一文件上传-base64">
          <div>
            <Button type="primary">上传文件</Button>
          </div>
          <p className="mt-10">只能上传png/jpg/jpeg格式图片，且大小不超过2MB</p>
        </Card>
      </Col>
      <Col span={6}>
        <Card title="单一文件上传-进度管控">
          <div>
            <Button type="primary">上传文件</Button>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card title="多文件上传">
          <div>
            <Button className="mr-10">选择文件</Button>
            <Button type="primary">上传到服务器</Button>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card title="大文件上传">
          <div>
            <Button type="primary">上传图片</Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
