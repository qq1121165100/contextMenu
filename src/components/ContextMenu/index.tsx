import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";
import "./index.less";

interface MenuData {}

export interface MenuProps {
  targetElementClassName?: string;
  isAutoListenEvent?: boolean;
  menu?: React.ReactNode;
  menuData?: MenuData[];
  position?: { left: number; top: number };
  style?: { [propsName: string]: any };
  visibleWithClass?: string[]; // 元素的class name，点击当前元素时，菜单不隐藏
  [propsName: string]: any;
}

const ContextMenu: React.FC<MenuProps> = forwardRef((props, ref) => {
  const menuRef = useRef<any>(null);

  const {
    targetElementClassName,
    isAutoListenEvent = true,
    menu,
    menuVisible,
    position,
    style,
    visibleWithClass = []
  } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  const handleContextMenu = (event: MouseEvent, position?: any) => {
    setCurrentEvent(event);

    const className = (event.target as any)?.className;

    if (
      !(
        targetElementClassName &&
        className &&
        className.includes(targetElementClassName)
      )
    ) {
      return;
    }

    event.preventDefault();

    setVisible(true);

    //获取可视区宽度
    var winWidth = function () {
      return document.documentElement.clientWidth || document.body.clientWidth;
    };
    //获取可视区高度
    var winHeight = function () {
      return (
        document.documentElement.clientHeight || document.body.clientHeight
      );
    };

    const menu = menuRef.current;
    let l = event.clientX;
    let t = event.clientY;

    if (position) {
      l = position.left;
      t = position.top;
    }

    if (l >= winWidth() - menu?.offsetWidth) {
      l = winWidth() - menu?.offsetWidth;
    } else {
      l = l;
    }
    if (t > winHeight() - menu?.offsetHeight) {
      t = winHeight() - menu?.offsetHeight;
    } else {
      t = t;
    }

    if (menu) {
      menu.style.left = l + "px";
      menu.style.top = t + "px";
    }

    return false;
  };

  const closeMenu = () => {
    setVisible(false);
  };
  const openMenu = () => {
    setVisible(true);
  };

  const handleClick = (event: any, visible?: boolean) => {
    const className = event.target?.className;
    const parentNode = event.target?.parentNode;

    for (let i = 0; i < visibleWithClass.length; i++) {
      const name = visibleWithClass[i];

      if (
        (className && className?.startsWith(name)) ||
        parentNode?.className?.startsWith(name)
      ) {
        return;
      }
    }

    setVisible(false);
  };
  const handleScroll = (event: any) => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    menuRef,
    visible,
    event: currentEvent,
    handleContextMenu,
    closeMenu,
    openMenu
  }));

  useEffect(() => {
    if (isAutoListenEvent) {
      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("click", (e) => handleClick(e, menuVisible));
      document.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [menuVisible]);

  return visible ? (
    <div
      className="menu"
      id="context-menu"
      ref={menuRef}
      style={style ? style : {}}
    >
      {props.children || menu}
    </div>
  ) : (
    <></>
  );
});

export default ContextMenu;
