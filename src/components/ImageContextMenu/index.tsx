import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect
} from "react";
import { Button, message, Select, Divider } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContextMenu from "../ContextMenu";
// import { downloadFile } from '@/utils/utils'
// import TagContentMenu from '../tagContextMenu';
import "./index.less";
import { SelectValue } from "antd/lib/select";

export interface MenuProps {
  image: any;
  tagsData: any;
  position: { left: number; top: number };
  onOk: (value: SelectValue) => void;

  [propsName: string]: any;
}

const RIGHT_POSITION_STYLE = {
  width: "100%",
  position: "absolute",
  right: "-180px",
  top: 0,
  border: "1px solid #d9d9d9"
};

const LEFT_POSITION_STYLE = {
  width: "100%",
  position: "absolute",
  left: "-180px",
  top: 0,
  border: "1px solid #d9d9d9"
};

const ImageContextMenu: React.FC<any> = forwardRef((props, ref) => {
  const { image, tagsData, position, onOk, selectedTags } = props;

  const imageMenuRef = useRef<any>(null);
  const tagsRef = useRef<any>(null);
  const selectRef = useRef<any>(null);

  const [menuVisible, setMenuVislble] = useState<boolean>(false);
  const [selectValue, setSclectValue] = useState<SelectValue>([]);
  const [selectVisible, setSelectVisible] = useState<boolean>(false);
  const [positionStyle, setPositionStyle] = useState<any>(RIGHT_POSITION_STYLE);

  const onCopy = (text: string, msg?: string) => {
    message.destroy();
    message.info(`ε€εΆζε: ${text}`);
  };

  const closeSelect = () => {
    setSelectVisible(false);
  };

  const getPositionStyle = (event: any) => {
    const clientWidth = document?.documentElement?.clientWidth;
    // const clientHeight = document?.documentElement?.clientHeight;
    const clientX = event?.clientX;
    // const clientY = event?.clientY;

    const menuWidth = document.getElementById("context-menu")?.clientWidth;
    // const menuHeight = document.getElementById('context-menu')?.clientHeight;

    const selectWidth = document.getElementById("select-tag")?.clientWidth;
    // const selectHeight = document.getElementById('select-tag')?.clientHeight;

    if (
      clientWidth &&
      clientX &&
      menuWidth &&
      selectWidth &&
      clientWidth - clientX < menuWidth + selectWidth
    ) {
      setPositionStyle(LEFT_POSITION_STYLE);
    } else {
      setPositionStyle(RIGHT_POSITION_STYLE);
    }
    return positionStyle;
  };

  useEffect(() => {
    getPositionStyle(imageMenuRef.current.event);
  }, [selectVisible]);

  useImperativeHandle(ref, () => ({
    imageMenuRef,
    tagsRef,
    closeSelect
  }));

  return (
    <>
      <ContextMenu
        ref={imageMenuRef}
        menuVisble={menuVisible}
        targetElementClassName="img-cover"
        visibleWithClass={[
          "ant-select",
          "demo-option-label-item",
          "li-tagging",
          "tagging"
        ]}
        menu={null}
      >
        <ul>
          <li>
            <CopyToClipboard
              onCopy={() => onCopy(image?.fileName, "ε€εΆζδ»Άε")}
              text={image?.fileName}
            >
              <span>ε€εΆζδ»Άε</span>
            </CopyToClipboard>
          </li>
          <li>
            <CopyToClipboard
              onCopy={() => onCopy(image?.modelPath, "ε€εΆθ·―εΎ")}
              text={image?.modelPath}
            >
              <span>ε€εΆθ·―εΎ</span>
            </CopyToClipboard>
          </li>
          <li>
            <a href={`/resource/download/file?file=${image?.previewPath}`}>
              δΈθ½½ι’θ§εΎ
            </a>
          </li>
          <li className="li-tagging">
            <span
              className="tagging"
              onMouseEnter={(
                e: React.MouseEvent<HTMLSpanElement, MouseEvent>
              ) => {
                setSelectVisible(true);
              }}

              // onContextMenu={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
              //   tagsRef.current.handleContextMenu(e)
              // }}
            >
              ζζ η­Ύ
            </span>
            <RightOutlined className="iconRight" />
            {selectVisible && (
              <div id="select-tag" ref={selectRef} style={positionStyle}>
                <Select
                  allowClear
                  showArrow
                  showSearch
                  placeholder="θ―·ιζ©ζ η­Ύ"
                  className="tagsSelect"
                  defaultValue={selectedTags.map((item: any) => item.id)}
                  onClick={() => {
                    setMenuVislble(true);
                  }}
                  onFocus={() => {
                    // setIsClickClose(false)
                    setMenuVislble(true);
                    // tagsRef.current.openMenu()
                  }}
                  onChange={(value: SelectValue) => {
                    // setIsClickClose(false)
                    setSclectValue(value);
                  }}
                  mode="multiple"
                  style={{ width: "100%" }}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "10px 0" }} />
                      <div className="selectCustomRender">
                        <Button
                          type="default"
                          size="small"
                          onClick={(e) => {
                            // setMenuVislble(false)
                            // imageMenuRef.current.closeMenu()
                            // tagsRef.current.closeMenu()
                            setSclectValue([]);
                            setSelectVisible(false);
                          }}
                        >
                          εζΆ
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => {
                            setMenuVislble(false);
                            setSelectVisible(false);
                            onOk && onOk(selectValue);
                          }}
                        >
                          η‘?ε?
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {tagsData?.length > 0 &&
                    tagsData.map((item: any) => (
                      <Select.Option key={item.id} value={item.id}>
                        <div className="demo-option-label-item">
                          <span
                            style={{
                              display: "inline-block",
                              backgroundColor: item.color,
                              padding: "0 10px",
                              borderRadius: 6
                            }}
                          >
                            {item.name}
                          </span>
                        </div>
                      </Select.Option>
                    ))}
                </Select>
              </div>
            )}
          </li>
        </ul>
      </ContextMenu>
    </>
  );
});

export default ImageContextMenu;
