import { createFrontIconfont } from "./Icon/createFrontIconfont";
import { IconAdd } from "./Icon/Icons/IconAdd";
import { IconEmail } from "./Icon/Icons/IconEmail";

const IconFont = createFrontIconfont(
  "//at.alicdn.com/t/c/font_4953382_3nkc3bdqxuo.js"
);

export default function App() {
  return (
    <div style={{ padding: "50px" }}>
      <IconAdd spin size="100px" />
      <IconEmail style={{ color: "#7f7f7f" }} size="100px" spin />
      <IconFont type="icon-fanhui" fill="red" spin size="100px" />
    </div>
  );
}
