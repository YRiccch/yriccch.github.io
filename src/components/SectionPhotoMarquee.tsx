// 引入 React 核心钩子
import { useState } from "react";
// 引入国际化翻译钩子
import { useTranslation } from "react-i18next";
// 引入 motion 动画库及其减少动画偏好检测钩子
import { motion, useReducedMotion } from "motion/react";
// 引入相册标签数据及其类型
import { GALLERY_TAGS, type GalleryTag } from "../data/gallery";
// 引入相册数据获取函数及其数据类型
import { getGalleryItems, type GalleryItem } from "../data/galleryItems";
// 引入本地化钩子
import { useLocale } from "../hooks/useLocale";
// 引入灯箱组件（用于放大查看照片）
import GalleryLightbox from "./GalleryLightbox";
// 引入 3D 字母切换动画组件
import { Letter3DSwap } from "./Letter3DSwap";
// 引入本地化内容切换组件
import { LocaleSwap } from "./LocaleSwap";
// 引入堆叠卡片容器组件及卡片项组件
import StackingCards, { StackingCardItem } from "./fancy/StackingCards";
import AnimatedAlbumBackdrop from "./fancy/AnimatedAlbumBackdrop";

// 每个相册预览最多显示的照片数量
const PREVIEW_PHOTO_LIMIT = 4;

// 相册预览数据类型：包含标签信息和照片列表
type AlbumPreview = {
  tag: GalleryTag;       // 相册标签，包含名称、描述等信息
  photos: readonly GalleryItem[];  // 只读照片数组
};

// 照片布局配置类型：定义单张照片的位置和动画参数
type PhotoLayout = {
  className: string;  // Tailwind CSS 类名，用于定位和尺寸
  x: number;          // 水平方向浮动位移（像素）
  y: number;          // 垂直方向浮动位移（像素）
  rotate: number;     // 基础旋转角度（度）
  tilt: number;       // 浮动时的倾斜角度增量（度）
};

// 根据所有相册标签生成预览数据，每个相册截取前几张照片
const albumPreviews: readonly AlbumPreview[] = GALLERY_TAGS.flatMap((tag) => {
  // 获取该标签下的照片并截取指定数量
  const photos = getGalleryItems(tag.key).slice(0, PREVIEW_PHOTO_LIMIT);
  // 只返回有照片的相册
  return photos.length > 0 ? [{ tag, photos }] : [];
});

// 预设的 4 种照片布局方案，分别对应左上角、右上角、左下角、右下角位置
type PhotoComposition = readonly PhotoLayout[];

// Each composition was balanced by hand. The selected composition is stable
// for an album, so layouts vary without shifting on every render.
const photoCompositions: Readonly<Record<number, readonly PhotoComposition[]>> = {
  2: [
    [
      { className: "left-[6%] top-[12%] w-[41%]", x: 4, y: -6, rotate: -3.5, tilt: 1 },
      { className: "right-[6%] bottom-[10%] w-[42%]", x: -5, y: 6, rotate: 3.5, tilt: -1.1 },
    ],
    [
      { className: "left-[5%] bottom-[9%] w-[44%]", x: 5, y: -5, rotate: -2.5, tilt: 0.9 },
      { className: "right-[7%] top-[10%] w-[39%]", x: -4, y: 6, rotate: 3, tilt: -1 },
    ],
    [
      { className: "left-[8%] top-[20%] w-[38%]", x: 4, y: -5, rotate: -4, tilt: 1.1 },
      { className: "right-[5%] top-[7%] w-[46%]", x: -5, y: 5, rotate: 2.5, tilt: -0.9 },
    ],
  ],
  3: [
    [
      { className: "left-[4%] top-[17%] w-[40%]", x: 4, y: -6, rotate: -4, tilt: 1.1 },
      { className: "right-[5%] top-[8%] w-[42%]", x: -5, y: 6, rotate: 3, tilt: -1 },
      { className: "bottom-[5%] left-[29%] w-[37%]", x: 5, y: -5, rotate: -1.5, tilt: 0.8 },
    ],
    [
      { className: "left-[5%] bottom-[8%] w-[42%]", x: 5, y: -5, rotate: -3, tilt: 1 },
      { className: "right-[4%] top-[9%] w-[41%]", x: -5, y: 6, rotate: 3.5, tilt: -1.1 },
      { className: "left-[31%] top-[6%] w-[34%]", x: 3, y: -4, rotate: -1, tilt: 0.7 },
    ],
    [
      { className: "left-[6%] top-[8%] w-[38%]", x: 4, y: -6, rotate: -3.5, tilt: 1 },
      { className: "right-[5%] bottom-[8%] w-[43%]", x: -5, y: 5, rotate: 3, tilt: -1 },
      { className: "bottom-[4%] left-[29%] w-[35%]", x: 4, y: -4, rotate: -1.5, tilt: 0.7 },
    ],
  ],
  4: [
    [
      { className: "left-[4%] top-[14%] w-[36%]", x: 4, y: -6, rotate: -4, tilt: 1.1 },
      { className: "right-[5%] top-[7%] w-[39%]", x: -5, y: 6, rotate: 3.5, tilt: -1 },
      { className: "bottom-[6%] left-[9%] w-[30%]", x: 4, y: -5, rotate: -2, tilt: 0.8 },
      { className: "bottom-[8%] right-[10%] w-[29%]", x: -3, y: 5, rotate: 4, tilt: -1.1 },
    ],
    [
      { className: "left-[5%] top-[6%] w-[37%]", x: 4, y: -5, rotate: -3.5, tilt: 1 },
      { className: "right-[4%] top-[18%] w-[36%]", x: -4, y: 6, rotate: 3, tilt: -1 },
      { className: "bottom-[6%] left-[12%] w-[28%]", x: 4, y: -4, rotate: -1.5, tilt: 0.7 },
      { className: "bottom-[7%] right-[9%] w-[30%]", x: -3, y: 5, rotate: 4.5, tilt: -1.2 },
    ],
    [
      { className: "left-[5%] top-[21%] w-[35%]", x: 4, y: -6, rotate: -4, tilt: 1.1 },
      { className: "right-[6%] top-[6%] w-[39%]", x: -5, y: 6, rotate: 3.5, tilt: -1 },
      { className: "bottom-[5%] left-[5%] w-[27%]", x: 3, y: -4, rotate: -1.5, tilt: 0.7 },
      { className: "bottom-[6%] right-[17%] w-[26%]", x: -3, y: 5, rotate: 4, tilt: -1.1 },
    ],
  ],
};

const EMPTY_PHOTO_COMPOSITION: PhotoComposition = [];

function stableHash(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function getPhotoComposition(album: AlbumPreview): PhotoComposition {
  const compositions = photoCompositions[album.photos.length];
  if (!compositions?.length) return EMPTY_PHOTO_COMPOSITION;

  const compositionIndex = stableHash(
    `${album.tag.key}:${album.photos.length}`,
  ) % compositions.length;

  return compositions[compositionIndex] ?? EMPTY_PHOTO_COMPOSITION;
}

/**
 * 单张照片瓦片组件
 * 展示带有浮动动画效果的照片，点击可打开灯箱
 */
function PhotoTile({
  item,        // 照片数据对象
  alt,         // 图片替代文本（无障碍访问）
  layout,      // 布局配置参数
  index,       // 照片索引，用于动画延迟和层级
  className,   // 自定义类名（可选）
  onOpen,      // 点击照片时的回调函数
}: {
  item: GalleryItem;
  alt: string;
  layout: PhotoLayout;
  index: number;
  className?: string;
  onOpen: (item: GalleryItem) => void;
}) {
  // 检测用户是否开启了「减少动画」系统偏好设置
  const reduceMotion = useReducedMotion();
  // 根据索引计算浮动动画周期，索引越大周期越长，产生错落感
  const floatDuration = 11 + index * 1.8;

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(item)}  // 点击时触发打开灯箱回调
      aria-label={alt}              // 无障碍标签
      title={alt}                   // 悬停提示
      // 初始状态：完全透明、向下偏移 12px、带有基础旋转角度
      initial={{ opacity: 0, y: 12, rotate: layout.rotate }}
      // 动画目标状态
      animate={
        reduceMotion
          // 如果用户偏好减少动画：只做简单的淡入和复位
          ? { opacity: 1, x: 0, y: 0, rotate: layout.rotate }
          // 否则：持续循环的浮动动画
          : {
              opacity: 1,
              x: [0, layout.x, 0],                   // X 轴往返浮动
              y: [0, layout.y, 0],                   // Y 轴往返浮动
              rotate: [                              // 旋转角度往返倾斜
                layout.rotate,
                layout.rotate + layout.tilt,
                layout.rotate,
              ],
            }
      }
      // 动画过渡配置
      transition={
        reduceMotion
          // 减少动画模式：快速淡入
          ? { duration: 0.2 }
          // 正常模式：各属性独立配置动画参数
          : {
              opacity: { duration: 0.28, delay: index * 0.08 }, // 淡入，依次延迟
              x: {
                duration: floatDuration,
                ease: "easeInOut",
                repeat: Infinity,  // 无限循环
              },
              y: {
                duration: floatDuration * 0.88,  // Y 轴周期略短，产生不规则浮动
                ease: "easeInOut",
                repeat: Infinity,
              },
              rotate: {
                duration: floatDuration * 1.08,  // 旋转周期略长，更显自然
                ease: "easeInOut",
                repeat: Infinity,
              },
            }
      }
      // 样式类：按钮重置样式 + 点击光标 + 布局定位
      className={`m-0 block cursor-pointer border-0 bg-transparent p-0 text-left ${className ?? layout.className}`}
      style={{ zIndex: index + 1 }}  // 层级随索引递增，后渲染的在上层
    >
      <img
        src={item.url}
        alt={alt}
        loading="lazy"          // 懒加载，优化页面性能
        decoding="async"        // 异步解码，避免阻塞主线程
        draggable={false}       // 禁止拖拽
        // 圆角 + 阴影样式，指针事件透传给父 button
        className="pointer-events-none block h-auto w-full rounded-md shadow-[0_16px_36px_-18px_rgba(0,0,0,0.62)]"
      />
    </motion.button>
  );
}

/**
 * 照片墙组件
 * 根据相册照片数量决定使用单图居中模式还是多图散落拼贴模式
 */
function PhotoWall({
  album,    // 相册预览数据
  onOpen,   // 照片打开回调
}: {
  album: AlbumPreview;
  onOpen: (item: GalleryItem) => void;
}) {
  const { L } = useLocale();
  // 生成图片 alt 文本：优先使用照片自带标题，否则使用相册标签名
  const altFor = (item: GalleryItem) =>
    item.caption ? L(item.caption) : L(album.tag.label);
  // 判断是否只有一张照片
  const singlePhoto = album.photos.length === 1 ? album.photos[0] : null;
  const layouts = getPhotoComposition(album);

  // 单张照片模式：居中显示
  if (singlePhoto) {
    return (
      <div className="flex min-h-[18rem] items-center justify-center px-5 py-6 max-[700px]:min-h-[15rem]">
        <PhotoTile
          item={singlePhoto}
          alt={altFor(singlePhoto)}
          index={0}
          // 单图使用独立的布局参数
          layout={{ className: "", x: 3, y: -6, rotate: -1.5, tilt: 0.7 }}
          className="relative w-[min(72%,17rem)]"  // 响应式宽度
          onOpen={onOpen}
        />
      </div>
    );
  }

  // 多张照片模式：使用绝对定位散落拼贴
  return (
    <div className="relative min-h-[18rem] max-[700px]:min-h-[15rem]">
      {album.photos.map((item, index) => {
        const layout = layouts[index];
        if (!layout) return null;

        return (
          <PhotoTile
            key={item.fileName}
            item={item}
            alt={altFor(item)}
            index={index}
            layout={layout}
            className={`absolute ${layout.className}`}
            onOpen={onOpen}
          />
        );
      })}
    </div>
  );
}

/**
 * 相册卡片组件
 * 左侧展示相册信息（标题、描述、照片数量），右侧展示照片墙
 */
function AlbumCard({
  album,    // 相册预览数据
  onOpen,   // 照片打开回调
}: {
  album: AlbumPreview;
  onOpen: (item: GalleryItem) => void;
}) {
  const { L, locale } = useLocale();
  const photoCount = album.photos.length;
  // 根据语言环境生成照片数量标签文本
  const countLabel =
    locale === "zh"
      ? `${photoCount} 张照片`  // 中文格式
      : `${photoCount} photo${photoCount === 1 ? "" : "s"}`;  // 英文格式（单复数）

  return (
    <article
      aria-labelledby={`life-album-${album.tag.key}`}  // 无障碍关联标题
      // 网格布局：左栏信息（0.82fr），右栏照片（1.18fr），小屏幕改为单列
      className="grid min-h-[20rem] grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] overflow-hidden rounded-lg border border-line bg-card max-[700px]:grid-cols-1"
    >
      {/* 左栏：相册文字信息区 */}
      <div className="flex min-h-full flex-col justify-between px-7 py-8 max-[700px]:px-6 max-[700px]:py-6">
        <div>
          {/* 高亮装饰线 */}
          <span
            className="mb-5 block h-1 w-8 rounded-full bg-highlight"
            aria-hidden="true"
          />
          {/* 相册标题，使用 3D 字母切换动画 */}
          <h3
            id={`life-album-${album.tag.key}`}
            className="m-0 text-[1.15rem] font-semibold leading-tight text-fg-strong"
          >
            <Letter3DSwap text={L(album.tag.label)} />
          </h3>
          {/* 相册描述文本 */}
          <p className="m-0 mt-3 max-w-[22ch] text-[0.9rem] leading-[1.7] text-fg-secondary">
            <LocaleSwap className="block">
              {L(album.tag.description)}
            </LocaleSwap>
          </p>
        </div>
        {/* 底部：照片数量统计 */}
        <p className="m-0 mt-8 text-xs text-fg-tertiary">
          <LocaleSwap>{countLabel}</LocaleSwap>
        </p>
      </div>
      {/* 右栏：照片展示区，带分隔边框和高亮背景 */}
      <div
        className="relative isolate overflow-hidden border-l border-line max-[700px]:border-l-0 max-[700px]:border-t"
      >
        <AnimatedAlbumBackdrop />
        <div className="relative z-10">
          <PhotoWall album={album} onOpen={onOpen} />
        </div>
      </div>
    </article>
  );
}

/**
 * 生活相册滚动展示区主组件
 * 使用堆叠卡片效果展示各个相册，点击照片可弹出灯箱大图查看
 */
export default function SectionPhotoMarquee() {
  const { t } = useTranslation();  // 国际化翻译函数
  const { L } = useLocale();       // 本地化文本函数
  // 灯箱状态：当前选中的照片对象，null 表示灯箱关闭
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  // 如果没有任何相册数据，不渲染组件
  if (albumPreviews.length === 0) return null;

  // 获取灯箱中照片的标题文本
  const lightboxCaption = lightbox?.caption ? L(lightbox.caption) : "";

  return (
    <section aria-label="Life albums" className="mt-20">
      {/* 屏幕阅读器专用标题，视觉上隐藏 */}
      <div className="life-stack-heading">
        <h2 className="m-0 text-[1.35rem] font-semibold leading-[1.15] text-fg-strong">
          <Letter3DSwap text={t("life.title")} />
        </h2>
      </div>
      {/* 堆叠卡片容器：实现卡片依次向下堆叠的滚动效果 */}
      <StackingCards totalCards={albumPreviews.length} className="relative">
        {albumPreviews.map((album, index) => (
          <StackingCardItem
            key={album.tag.key}
            index={index}
            // 每张卡片的顶部位置：基础偏移 + 索引递增偏移，形成层次感
            topPosition={`calc(var(--life-stack-pin-top) + ${index * 0.9}rem)`}
            className="life-stack-item !h-[20rem] max-[700px]:!h-[28rem]"
          >
            {/* 渲染相册卡片内容 */}
            <AlbumCard album={album} onOpen={setLightbox} />
          </StackingCardItem>
        ))}
        {/* 底部占位元素：为堆叠卡片提供足够的滚动空间 */}
        <div aria-hidden="true" className="h-48 max-[700px]:h-56" />
      </StackingCards>
      {/* 灯箱组件：大图查看器 */}
      <GalleryLightbox
        item={lightbox}
        caption={lightboxCaption}
        closeLabel={t("life.close")}  // 关闭按钮的国际化文本
        onClose={() => setLightbox(null)}  // 关闭灯箱回调
      />
    </section>
  );
}
