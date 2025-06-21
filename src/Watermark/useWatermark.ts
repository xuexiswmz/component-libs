import type { WatermarkProps } from "./index";
import { useEffect, useRef, useState } from "react";
import { merge } from "lodash-es";

// 定义WatermarkProps类型，Omit表示排除className、style、children属性
export type WatermarkOptions = Omit<
  WatermarkProps,
  "className" | "style" | "children"
>;

// 判断一个对象是否为数字类型
export function isNumber(obj: unknown): obj is number {
  return (
    Object.prototype.toString.call(obj) === "[object Number]" && obj === obj
  );
}
// 将字符串或数字转换为数字，如果转换失败则返回默认值
const toNumber = (value?: string | number, defaultValue?: number) => {
  if (!value) {
    return defaultValue;
  }
  if (isNumber(value)) {
    return value;
  }
  const numberVal = parseFloat(value);
  return isNumber(numberVal) ? numberVal : defaultValue;
};
// 默认配置
const defaultOptions = {
  rotate: -20,
  zIndex: 1,
  width: 100,
  gap: [100, 100],
  fontStyle: {
    fontSize: "16px",
    color: "rgba(0,0,0,0.15)",
    fontFamily: "sans-serif",
    fontWeight: "normal",
  },
  getContainer: () => document.body,
};
// 合并配置
// 获取合并后的选项
const getMergedOptions = (o: Partial<WatermarkOptions>) => {
  // 如果传入的选项为空，则使用默认选项
  const options = o || {};
  // 合并后的选项
  const mergedOptions = {
    // 使用传入的选项，如果没有传入则使用默认选项
    ...options,
    rotate: options.rotate || defaultOptions.rotate,
    zIndex: options.zIndex || defaultOptions.zIndex,
    fontStyle: { ...defaultOptions.fontStyle, ...options.fontStyle },
    // 如果传入的选项中有图片，则使用默认宽度，否则使用传入的宽度
    width: toNumber(
      options.width,
      options.image ? defaultOptions.width : undefined
    ),
    // 使用传入的高度，如果没有传入则使用默认高度
    height: toNumber(options.height, undefined)!,
    // 使用传入的容器
    getContainer: options.getContainer!,
    // 使用传入的间距，如果没有传入则使用默认间距
    gap: [
      toNumber(options.gap?.[0], defaultOptions.gap[0]),
      toNumber(options.gap?.[1] || options.gap?.[0], defaultOptions.gap[1]),
    ],
  } as Required<WatermarkOptions>;

  // 获取合并后的X轴偏移量
  const mergedOffsetX = toNumber(mergedOptions.offset?.[0], 0)!;
  // 获取合并后的Y轴偏移量
  const mergedOffsetY = toNumber(
    mergedOptions.offset?.[1] || mergedOptions.offset?.[0],
    0
  )!;

  // 将合并后的偏移量赋值给mergedOptions
  mergedOptions.offset = [mergedOffsetX, mergedOffsetY];
  // 返回合并后的选项
  return mergedOptions;
};

// 定义一个函数，用于测量文本大小
const measureTextSize = (
  // 传入一个CanvasRenderingContext2D对象
  ctx: CanvasRenderingContext2D,
  // 传入一个字符串数组
  content: string[],
  // 传入一个旋转角度
  rotate: number
) => {
  // 定义一个变量，用于存储文本的宽度
  let width = 0;
  // 定义一个变量，用于存储文本的高度
  let height = 0;
  // 定义一个数组，用于存储每一行的文本大小
  const lineSize: Array<{ width: number; height: number }> = [];

  // 遍历字符串数组
  content.forEach((item) => {
    // 获取文本的宽度
    const {
      width: textWidth,
      fontBoundingBoxAscent,
      fontBoundingBoxDescent,
    } = ctx.measureText(item);

    // 获取文本的高度
    const textHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;

    // 如果文本宽度大于当前宽度，则更新宽度
    if (textWidth > width) {
      width = textWidth;
    }
    // 累加文本高度
    height += textHeight;

    // 将每一行的文本大小添加到数组中
    lineSize.push({ width: textWidth, height: textHeight });
  });

  // 将旋转角度转换为弧度
  const angle = (rotate * Math.PI) / 180;

  // 返回文本的大小和每一行的文本大小
  return {
    originWidth: width,
    originHeight: height,
    width: Math.ceil(
      // 计算旋转后的宽度
      Math.abs(Math.sin(angle) * height) + Math.abs(Math.cos(angle) * width)
    ),
    height: Math.ceil(
      // 计算旋转后的高度
      Math.abs(Math.sin(angle) * width) + Math.abs(Math.cos(angle) * height)
    ),
    lineSize,
  };
};

// 定义一个异步函数，用于获取canvas数据
const getCanvasData = async (
  options: Required<WatermarkOptions>
): Promise<{ width: number; height: number; base64Url: string }> => {
  // 解构出传入的参数
  const { fontStyle, content, image, rotate, gap } = options;
  // 创建一个canvas元素
  const canvas = document.createElement("canvas");
  // 获取canvas的上下文
  const ctx = canvas.getContext("2d")!;
  // 获取设备的像素比例
  const ratio = window.devicePixelRatio;

  // 定义一个函数，用于配置canvas的大小
  const configCanvas = (size: { width: number; height: number }) => {
    // 计算canvas的宽度和高度
    const canvasWidth = gap[0] + size.width;
    const canvasHeight = gap[1] + size.height;

    // 设置canvas的宽度和高度
    canvas.setAttribute("width", `${canvasWidth * ratio}px`);
    canvas.setAttribute("height", `${canvasHeight * ratio}px`);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    // 设置canvas的坐标原点为画布中心
    ctx.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2);
    // 设置canvas的缩放比例
    ctx.scale(ratio, ratio);

    // 计算旋转角度
    const RotateAngle = (rotate * Math.PI) / 180;
    // 旋转canvas
    ctx.rotate(RotateAngle);
  };

  // 定义一个函数，用于绘制文本
  const drawText = () => {
    // 解构出文本样式
    const { fontSize, color, fontWeight, fontFamily } = fontStyle;
    // 获取字体大小
    const realFontSize = toNumber(fontSize, 0) || fontStyle.fontSize;

    // 设置字体样式
    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
    // 获取文本的尺寸
    const measureSize = measureTextSize(ctx, [...content], rotate);

    // 获取文本的宽度和高度
    const width = options.width || measureSize.width;
    const height = options.height || measureSize.height;

    // 配置canvas的大小
    configCanvas({ width, height });

    // 设置填充颜色
    ctx.fillStyle = color!;
    // 设置字体样式
    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
    // 设置文本基线
    ctx.textBaseline = "top";

    // 遍历内容
    [...content].forEach((item, index) => {
      // 获取每一行的宽度和高度
      const { height: lineHeight, width: lineWidth } =
        measureSize.lineSize[index];

      // 计算每一行的起始点
      const xStartPoint = -lineWidth / 2;
      const yStartPoint =
        -(options.height || measureSize.originHeight) / 2 + lineHeight * index;

      // 绘制文本
      ctx.fillText(
        item,
        xStartPoint,
        yStartPoint,
        options.width || measureSize.originWidth
      );
    });

    // 返回Promise，返回canvas的base64Url
    return Promise.resolve({ base64Url: canvas.toDataURL(), height, width });
  };

  // 绘制图片
  function drawImage() {
    // 返回Promise
    return new Promise<{ width: number; height: number; base64Url: string }>(
      (resolve) => {
        // 创建Image对象
        const img = new Image();
        // 设置跨域
        img.crossOrigin = "anonymous";
        // 设置引用策略
        img.referrerPolicy = "no-referrer";

        // 设置图片路径
        img.src = image;
        // 图片加载完成
        img.onload = () => {
          // 获取图片的宽度和高度
          let { width, height } = options;
          // 如果没有设置宽度和高度，则根据图片的宽高比计算
          if (!width || !height) {
            if (width) {
              height = (img.height / img.width) * +width;
            } else {
              width = (img.width / img.height) * +height;
            }
          }
          // 配置canvas
          configCanvas({ width, height });

          // 绘制图片
          ctx.drawImage(img, -width / 2, -height / 2, width, height);
          // 返回Promise，返回canvas的base64Url
          return resolve({ base64Url: canvas.toDataURL(), width, height });
        };
        // 图片加载失败
        img.onerror = () => {
          // 绘制文本
          return drawText();
        };
      }
    );
  }
  // 如果有图片，则绘制图片，否则绘制文本
  return image ? drawImage() : drawText();
};

// 使用水印
// 导出一个默认函数，用于生成水印
export default function useWatermark(params: WatermarkOptions) {
  // 使用useState钩子，初始化options为传入的params，或者为空对象
  const [options, setOptions] = useState(params || {});

  // 调用getMergedOptions函数，获取合并后的options
  const mergedOptions = getMergedOptions(options);
  // 使用useRef钩子，创建一个watermarkDiv引用
  const watermarkDiv = useRef<HTMLDivElement>();

  const mutationObserver = useRef<MutationObserver>();

  // 获取合并后的options中的container、zIndex、gap属性
  const container = mergedOptions.getContainer();
  const { zIndex, gap } = mergedOptions;

  // 定义一个函数，用于绘制水印
  function drawWatermark() {
    // 如果没有container，则返回
    if (!container) {
      return;
    }

    // 调用getCanvasData函数，获取canvas数据
    getCanvasData(mergedOptions).then(({ base64Url, width, height }) => {
      // 获取合并后的options中的offset属性
      const offsetLeft = mergedOptions.offset[0] + "px";
      const offsetTop = mergedOptions.offset[1] + "px";

      // 定义水印的样式
      const wmStyle = `width:calc(100% - ${offsetLeft});
    height:calc(100% - ${offsetTop});
      position:absolute;
      top:${offsetTop};
      left:${offsetLeft};
      bottom:0;
      right:0;
      pointer-events: none;
      z-index:${zIndex};
      background-position: 0 0;
      background-size:${gap[0] + width}px ${gap[1] + height}px;
      background-repeat: repeat;
      background-image:url(${base64Url})`;

      // 如果watermarkDiv引用不存在，则创建一个新的div，并将其添加到container中
      if (!watermarkDiv.current) {
        const div = document.createElement("div");
        watermarkDiv.current = div;
        container.append(div);
        container.style.position = "relative";
      }

      // 设置watermarkDiv的样式
      watermarkDiv.current?.setAttribute("style", wmStyle.trim());

      // 如果container存在
      if (container) {
        // 断开当前的mutationObserver
        mutationObserver.current?.disconnect();
        // 创建一个新的mutationObserver
        mutationObserver.current = new MutationObserver((mutations) => {
          // 遍历mutations
          const isChanged = mutations.some((mutation) => {
            let flag = false;
            // 如果mutation.removedNodes的长度不为0
            if (mutation.removedNodes.length) {
              // 将mutation.removedNodes转换为数组，并使用some方法判断数组中是否存在watermarkDiv.current
              flag = Array.from(mutation.removedNodes).some(
                (node) => node === watermarkDiv.current
              );
            }
            // 如果mutation.type等于attributes并且mutation.target等于watermarkDiv.current
            if (
              mutation.type === "attributes" &&
              mutation.target === watermarkDiv.current
            ) {
              flag = true;
            }
            // 返回flag
            return flag;
          });
          // 如果isChanged为true
          if (isChanged) {
            // 将watermarkDiv.current设置为undefined
            watermarkDiv.current = undefined;
            // 调用drawWatermark函数
            drawWatermark();
          }
        });
        // 监听container的变化
        mutationObserver.current.observe(container, {
          attributes: true,
          subtree: true,
          childList: true,
        });
      }
    });
  }

  // 使用useEffect钩子，在options变化时调用drawWatermark函数
  useEffect(() => {
    drawWatermark();
  }, [options]);

  // 返回一个对象，包含generateWatermark和destory方法
  return {
    generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
      // 调用setOptions函数，更新options
      setOptions(merge({}, options, newOptions));
    },
    // 销毁函数
    destory: () => {
      // 断开观察者
      mutationObserver.current?.disconnect();
      // 移除水印div
      watermarkDiv.current?.remove();
      // 将水印div置为undefined
      watermarkDiv.current = undefined;
    },
  };
}
