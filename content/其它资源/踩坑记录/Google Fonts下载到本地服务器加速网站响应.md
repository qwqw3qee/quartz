---
created: 2024-09-26T16:55:17.000+08:00
updated: 2024-09-27T00:55:24.635+08:00
tags:
  - quartz
  - 字体
  - obsidian
dg-publish: true
---
部署Quartz到静态网站托管服务后，由于服务商在国外，网站响应和加载速度一直不理想，起初也没在意。配置时发现网站使用Google Fonts，每次加载时都会从谷歌下载字体，必然会拖慢国内用户的访问速度。Quartz可以直接配置使用服务器本地字体，但是我又不想下载完整字体，于是萌生了把从Google Fonts加载的字体下载下来的念头，从网上搜了下确实可行，于是便有了本文。下面是修改步骤。
## 找到导入Google Fonts的CSS的链接
在Quartz项目中，`./quartz/util/theme.ts`定义了css的链接。
`
```ts title="theme.ts" hl:3 {3}
export function googleFontHref(theme: Theme) {
  const { code, header, body } = theme.typography
  return `https://fonts.googleapis.com/css2?family=${code}&family=${header}:wght@400;700&family=${body}:ital,wght@0,400;0,600;1,400;1,600&display=swap`
}
```
其中几个变量的定义在配置文件`quartz.config.ts`中。
```ts title="quartz.config.ts" hl:5-7 {5-7}
theme: {
fontOrigin: "googleFonts",
cdnCaching: true,
typography: {
  header: "Schibsted Grotesk",
  body: "Source Sans Pro",
  code: "IBM Plex Mono",
},
```
这里的链接为
```url
https://fonts.googleapis.com/css2?family=IBM%20Plex%20Mono&family=Schibsted%20Grotesk:wght@400;700&family=Source%20Sans%20Pro:ital,wght@0,400;0,600;1,400;1,600&display=swap
```
## 打开链接，下载CSS与字体
链接内容示例如下，此处临时将其保存为`local.google.fonts.css`。

```css title="local.google.fonts.css" 
/* cyrillic-ext */
@font-face {
  font-family: 'IBM Plex Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/ibmplexmono/v19/-F63fjptAgt5VM-kVkqdyU8n1iIq129k.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'IBM Plex Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/ibmplexmono/v19/-F63fjptAgt5VM-kVkqdyU8n1isq129k.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* ...以下省略 */
```
使用下载工具将文件中`url()`内的链接下载下来，并放到网站的静态资源目录中，Quartz中放到`./quartz/static/fonts/`目录中。
> [!tip]
> 可以使用支持正则表达式的文本编辑器中批量提取链接。查找内容为`https:\/\/[a-z0-9\-\/].*\.woff2`，仅供参考。
> 


## 修改CSS
将刚才保存的`local.google.fonts.css`文件中所有的字体的url替换为服务器静态资源的路径，即由`url(http://...)`修改为`url(/xxx/xxx)`的形式，Quartz修改的路径为`url('/static/fonts/xxx.woff')`。

```css
/*替换前*/
src: url(https://fonts.gstatic.com/s/ibmplexmono/v19/-F63fjptAgt5VM-kVkqdyU8n1iIq129k.woff2) format('woff2');
/*替换后*/
src: url('/static/fonts/-F63fjptAgt5VM-kVkqdyU8n1iIq129k.woff2') format('woff2');
```

> [!tip]
> 可以使用支持正则表达式的文本编辑器中批量替换，查找内容为：`(https:\/\/[a-z0-9\-\/].*\/)([a-z0-9\-\/].*\.woff2)`，替换内容为：`'/static/fonts/$2'`

## 修改加载方式
将项目中原有的导入Google Fonts的地方替换为修改后的`local.google.fonts.css`即可。
在Quartz中，可以将配置文件`quartz.config.ts`中`fontOrigin: "googleFonts"`改为`fontOrigin: "local"`，并在自定义样式表中导入新的CSS即可。具体方法为修改将`local.google.fonts.css`放入`./quartz/styles/`目录中，然后修改`./quartz/styles/custom.scss`文件，添加如下代码：
```scss title="custom.scss" 
@use "local.google.fonts.css";
```

## 其它说明
经过测试，在Quartz中，使用在线的Google Fonts时，从谷歌网站上加载其css响应时间极长；使用本地字体后，页面加载时会直接避免从谷歌上下载css所带来的延迟，另外使用本地字体的情况下切换笔记页面时，不会重新触发字体的加载，因而切换页面操作的体验提升很明显。
此外整个修改流程比较机械化，感觉可以写个脚本自动处理，有时间看看吧。
## 参考链接
- [google fonts 使用方案，解决引入fonts.googleapis.com/css字体网页响应缓慢问题\_fonts.googleapis 在线字体-CSDN博客](https://blog.csdn.net/deng_xj/article/details/88544617)