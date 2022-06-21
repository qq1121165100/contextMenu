import "./styles.css";
import { useRef } from "react";
import "antd/dist/antd.css";
import { SelectValue } from "antd/lib/select";
import ImageContextMenu from "./components/ImageContextMenu";
import { tagsData, imageData } from "./constant";
export default function App() {
  const menuRef = useRef<any>(null);

  return (
    <div className="App">
      <h1>自定义右键菜单</h1>
      <ImageContextMenu
        ref={menuRef}
        image={imageData}
        tagsData={tagsData}
        selectedTags={[]}
        onOk={(value: SelectValue) => {}}

        // position={position}
      />

      <img
        alt=""
        width={200}
        src="https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg"
        onContextMenu={(e: any) => {
          menuRef.current.closeSelect();
        }}
        className="img-cover"
      />
    </div>
  );
}
