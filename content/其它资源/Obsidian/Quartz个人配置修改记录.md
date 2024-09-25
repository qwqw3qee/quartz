---
created: 2024-09-23T11:35:56.000+08:00
updated: 2024-09-26T01:46:53.714+08:00
tags:
  - quartz
  - obsidian
dg-publish: true
---
## 纯配置修改
### 修改网站标题
在`quartz.config.ts`中找到以下内容进行修改。
```ts title="quartz.config.ts"
const config: QuartzConfig = {
configuration: {
  pageTitle: "你想要的网站标题", 
```
### 修改地区和网站域名
修改地区后可以让网站中的元素以中文形式显示。
修改域名这个是可选操作，根据官方文档的说法，这个功能主要是为RSS功能服务的，其它功能基本不会依赖这个配了。Quartz 4会尽可能避免使用此功能，并尽可能使用相对URL，以确保网站无论实际部署在哪里都能正常工作。
```ts title="quartz.config.ts"
    locale: "zh-CN", //设置为中文
    baseUrl: "xxx.com", //你的域名
```
### 修改链接处理
此插件解析链接并处理它们以指向正确的位置，详细说明参考[官方文档](https://quartz.jzhao.xyz/plugins/CrawlLinks)。这里应改成相对路径，不然在不同文件夹下点击笔记跳转时会出现问题。此外，可以开启懒加载选项，优化浏览体验。
```ts  title="quartz.config.ts"
      Plugin.CrawlLinks({ markdownLinkResolution: "relative", lazyLoad: true }),
```
### 关闭严格换行模式
启用`HardLineBreaks`插件即可，参考[官方文档](https://quartz.jzhao.xyz/plugins/HardLineBreaks)。
```ts title="quartz.config.ts" hl:6 {6}
  plugins: {
    transformers: [
      // ...
      Plugin.Latex({ renderEngine: "katex" }),
      // 以下是新增内容
      Plugin.HardLineBreaks(),
      // 以上是新增内容
    ],
    // ...
```
### 代码高亮
调整代码高亮背景色为高亮方案主题色，参考[官方文档](https://quartz.jzhao.xyz/plugins/SyntaxHighlighting)。
```ts title="quartz.config.ts" hl:7 {7}
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        // 以下是新增内容
        keepBackground: true,
        // 以上是新增内容
      }),
```
### 替换网站图标
替换`./quartz/static/icon.png`即可。
###  添加自定义高亮方案
在`./quartz/styles/custom.scss`添加如下内容：
```css title="custom.scss"
/* 图片居中 */
img {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
/* 高亮美化 */
.text-highlight {
	background-color:#3463ffce;
    color: white;
	border-radius: 5px;
	padding: 2px;
}
```
### 添加最近笔记组件
此组件为官方组件，详细说明参考[官方文档](https://quartz.jzhao.xyz/features/recent-notes)。在合适的位置添加如下代码即可。如果想桌面端与移动端分别处理，可在外面套上`Component.DesktopOnly()`或`Component.MobileOnly()`。
```ts  title="quartz.config.ts"
Component.RecentNotes({
  title: "最近更新",
  showTags: false,
  limit: 4,
  filter: (f) => {
    if (f.filePath?.endsWith("index.md")) {
      return false
    }
    return true
  },
  sort: (f1, f2) => {
    if (f1.dates && f2.dates) {
      if (Math.abs(f2.dates.modified.getDay() - f1.dates.modified.getDay())<=3) {
        return f2.dates.created.getTime() - f1.dates.created.getTime()
      }
      return f2.dates.modified.getTime() - f1.dates.modified.getTime()
    } else if (f1.dates && !f2.dates) {
      return -1
    }
    return 1
  }
})
```
这里的配置是关闭了tag显示，限制笔记数量为4条，过滤规则为排除掉以`index.md`结尾的文件（即首页或文件夹主页），并编写了一条自定义排序规则（综合考虑了修改时间和创建时间，瞎写的）。
### 启用Giscus评论系统
#### 预先准备
根据[giscus](https://giscus.app/zh-CN)说明，设置Github并生成配置信息。
#### 配置修改
在`quartz.layout.ts`中添加以下内容：
```ts title="quartz.layout.ts" hl:3-27 {3-27}
  afterBody: [
    // 以下是新增内容
    Component.Comments({
      provider: 'giscus',
      options: {
        // from data-repo
        repo: 'xxx',
        // from data-repo-id
        repoId: 'xxx',
        // from data-category
        category: 'Announcements',
        // from data-category-id
        categoryId: 'xxx',
        // how to map pages -> discussions
        // defaults to 'url'
        mapping: "pathname",
        // use strict title matching
        // defaults to true
        strict: false,
        // whether to enable reactions for the main post
        // defaults to true
        reactionsEnabled: true,
        // where to put the comment input box relative to the comments
        // defaults to 'bottom'
        inputPosition: "top",
      }
    }),
    // 以上是新增内容
  ],
```
### 回到顶部按钮（纯配置修改）
```ts title="quartz.layout.ts" hl:6 {6}
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
       // 以下是新增内容
      "Scroll to top ↑": "#",
       // 以上是新增内容
    },
  }),
```
## 引入插件或组件修改
所有引入插件或组件均存放在[quartz/quartz/extra at v4 · qwqw3qee/quartz · GitHub](https://github.com/qwqw3qee/quartz/tree/v4/quartz/extra)。
### 移动端导航目录
#### 添加文件
插件代码：[quartz-site/extra at main · MikeKneeB/quartz-site · GitHub](https://github.com/MikeKneeB/quartz-site/tree/main/extra)
代码放在`./quartz/extra/`目录下，目录结构：
```plain
├─components
│  │  index.ts
│  │  OverlayExplorer.tsx
│  │  
│  ├─scripts
│  │      overlayexplorer.inline.ts
│  │
│  └─styles
│          overlayexplorer.scss
│
└─static
        icon.png
        og-image.png
```
主要修改如下，代码详见本站仓库：
1. 修改导包路径问题。
2. 调整图标文件夹链接的图标为<svg width="20" height="12" xmlns="http://www.w3.org/2000/svg" class="lucide lucide-navigation" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="currentColor" fill="none"><polygon transform="rotate(25.5735 7.26917 4.48399)" stroke="null" id="svg_1" points="0.26425468921661377,4.115314036607742 14.274086892604828,-2.5209226310253143 7.637851655483246,11.488909751176834 6.1631311774253845,5.590032607316971 0.26425468921661377,4.115314036607742 " /></svg>。
#### 修改配置
修改`quartz.config.ts`，将组件添加到合适的位置
```ts title="quartz.config.ts" hl:10,25 {10,25}
import * as ExtraComponent from "./quartz/extra/components"
//...

export const defaultContentPageLayout: PageLayout = {
  // ...
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    // 以下是新增代码
    Component.MobileOnly(ExtraComponent.OverlayExplorer()),
    // 以上是新增代码
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  //...
}

export const defaultListPageLayout: PageLayout = {
  // ...
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    // 以下是新增代码
    Component.MobileOnly(ExtraComponent.OverlayExplorer()),
    // 以上是新增代码
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  // ...
}
```
## 侵入性修改
### 回到首页+随机文章（未使用）
#### 添加文件
代码放在`./quartz/extra/`目录下，目录结构：
```plain
└─components
   │  index.ts
   │  ScrollToTop.tsx
   │
   ├─scripts
   │      randomPage.inline.ts
   │
   └─styles
           scrollToTop.scss

```
主要修改如下，代码详见本站仓库：
- 修改导包路径问题。
#### 修改项目代码
修改`./quartz/components/Footer.tsx`，改动如下：
```tsx title="./quartz/components/Footer.tsx" hl:17-29 {17-29}
const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
  const year = new Date().getFullYear()
  const links = opts?.links ?? []
  return (
    <footer class={`${displayClass ?? ""}`}>
      <p>
        {i18n(cfg.locale).components.footer.createdWith}{" "}
        <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a> © {year}
      </p>
      <ul>
        {Object.entries(links).map(([text, link]) => (
          <li>
            <a href={link}>{text}</a>
          </li>
        ))}
      </ul>
      <p></p> 
      <ul>
        <li>
          <a href="#">
          Scroll to top ↑
          </a> 
        </li>
        <li>
          <a id="random-page-button">
          Random Page 🎲
          </a>
        </li>
      </ul>
    </footer>
  )
}

```
### 显示文章创建和修改时间
主要变动如下：
1、增加修改时间和修改记录显示
2、增加图标表示

修改`./quartz/plugins/transformers/lastmod.ts`，增加对属性`created`的解析。
```ts title="lastmod.ts" hl:4 {4}
			// ...
              } else if (source === "frontmatter" && file.data.frontmatter) {
                // 以下是新增代码
                created ||= file.data.frontmatter.created as MaybeDate
                // 以上是新增代码
				created ||= file.data.frontmatter.date as MaybeDate
          // ...
```
修改`./quartz/components/Date.tsx`，给日期格式化函数增加时间显示。（也可以不修改，在`ContentMeta.tsx`中自行编写格式化函数）：
```tsx title="Date.tsx" hl:6-7 {6-7}
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    // 以下是新增代码
    hour: "2-digit",
    minute: "2-digit",
    // 以上是新增代码
  })
```
修改`./quartz/components/ContentMeta.tsx`，将时间显示分为创建时间和修改时间，并在后面添加修改历史链接，这里直接嵌入了svg格式的[lucide](https://lucide.dev/)图标：
```tsx title="ContentMeta.tsx" hl:4-20,29-32,36-43 {4-20,29-32,36-43}
  if (text) {
    const segments: (string | JSX.Element)[] = []
	//以下是修改代码
    if (fileData.dates && fileData.slug !== "index") {
      if (fileData.dates.created) {
        segments.push(
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" style="position:relative; top:2px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-plus"><path d="M8 2v4"/><path d="M16 2v4"/><path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M3 10h18"/><path d="M16 19h6"/><path d="M19 16v6"/></svg> 创建于 {formatDate(fileData.dates.created,cfg.locale)}
          </span>,
        )
      }

      if (fileData.dates.modified) {
        segments.push(
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" style="position:relative; top:2px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-clock"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><path d="M17.5 17.5 16 16.3V14"/><circle cx="16" cy="16" r="6"/></svg> 更新于 {formatDate(fileData.dates.modified,cfg.locale)}
          </span>,
        )
      }
    }
	// 以上是修改代码
    // Display reading time if enabled
    if (options.showReadingTime && fileData.slug !== "index") {
      const { minutes, words: _words } = readingTime(text)
      const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
        minutes: Math.ceil(minutes),
      })
      // 以下是修改代码
      segments.push(
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" style="position:relative; top:2px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hourglass"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg> {displayedTime}
        </span>)
        // 以上是修改代码
    }
	// 以下是修改代码
    segments.push(
      <a
        href={`https://github.githistory.xyz/qwqw3qee/quartz/commits/v4/${fileData.filePath}`}
        target="_blank"
      >
        <svg xmlns="http://www.w3.org/2000/svg" style="position:relative; top:2px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg> 修改历史
      </a>,
    )
    // 以上是修改代码
    const segmentsElements = segments.map((segment) => <span>{segment}</span>)

    return (
      <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
        {segmentsElements}
      </p>
    )
  } else {
    return null
  }
```






