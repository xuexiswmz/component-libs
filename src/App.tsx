import "./App.css";
import Space from "./Space";
import { ConfigProvider } from "./Space/ConfigProvider";

export default function App() {
  return (
    <ConfigProvider space={{ size: 100 }}>
      <Space direction="horizontal">
        <div className="box">1</div>
        <div className="box">2</div>
        <div className="box">3</div>
      </Space>
      <Space direction="vertical">
        <div className="box">1</div>
        <div className="box">2</div>
        <div className="box">3</div>
      </Space>
    </ConfigProvider>
  );
}
