---
url: https://t.cj.sina.com.cn/articles/view/1823348853/6cae1875020016gl5
title: Obsidian 网页剪藏 - 简悦  Local REST API
date: 2023-03-07 23:35:51
banner: https://n.sinaimg.cn/sinakd20221221s/121/w600h321/20221221/713f-e7333f198ff42ac9f6938e49eed077aa.png
banner_icon: 🔖
tags:
  - 转载
  - obsidian
  - 简悦
dg-publish: true
created: 2023-03-07T23:35:51.000+08:00
updated: 2024-09-23T15:56:30.443+08:00
---
> 原文链接：[Obsidian 网页剪藏 - 简悦 + Local REST API](https://t.cj.sina.com.cn/articles/view/1823348853/6cae1875020016gl5)

作者：不大专业的酱酒打工仔

上篇说了 Obsidian 的安装与插件，大家也可以看下

一开始使用 Obsidian 的时候，有一个特别纠结的问题，就是没有自带的网页剪藏插件，网页剪藏基本占据我笔记的三分之一！然后在网上看到大神一些教程，了解到一个简藏的插件 "简悦"。这个插件可以把网页转换 md 格式，简单的编辑，再进行剪藏。

前期准备

- 简悦网页插件（2.0+） https://simpread.pro/
- 简悦配置库 https://www.yuque.com/kenshin/simpread/psugef

    内置 Obsidian 插件：
- Banners
- Dataview
- Local REST API

图片本地保存插件 local images 去插件库下载即可

- 简悦网页插件 (建议 2.0 以上)

![](../../Z-Others/assets/713f-e7333f198ff42ac9f6938e49eed077aa.png)
- 简悦配置库（极速版即可，文件名：obsidian@little.zip）

![](../../Z-Others/assets/a10d-3573af0b96ad6bc193d0ff2adc91fcbf.png)

## 一、简悦插件安装配置（谷歌浏览器示例）

1. 解压插件

![](../../Z-Others/assets/5ee5-c42ff5ec77578312640d885e80fd3c86.png)
2. 安装插件

![](../../Z-Others/assets/90bb-1ec3e3b932fc2f8d68e213de856d309a.png)
![](../../Z-Others/assets/bba8-abcfb80bf99d7af2457a597c2b312ee0.png)
![](../../Z-Others/assets/c9b8-891c4cd0b89ffb94bd10adb86c39d929.png)
3. 导入插件配置，导入`obsidian@little`文件夹内的`simpread_config.json`

![](../../Z-Others/assets/48f0-8dc8af1b064ae9352a78993e8bf2efe6.png)
![](../../Z-Others/assets/e76d-1db7dc547613e775e3dd2d132632701f.png)
4. 导入插件

![](../../Z-Others/assets/c007-357f232c5c5f3805cdd396bc8ab35047.png)
5. 插件配置，插件变红后点击，然后可以根据你习惯进行修改，我喜欢用的是`assets/1 网页`。官方给出的建议是用 Local REST API，但是我发现 SimpRead Sync 更好用（但是 SimpRead Sync 插件 github 链接发不出来）。所以还是用 Local REST API，Token 在 Obsidian 插件 Local REST API 的第一个 key 里面，修改完毕保存后刷新。（我这里）

![](../../Z-Others/assets/ac76-f70db0c32d3f2755503dfb6457df9a30.png)
![](../../Z-Others/assets/b746-38c761c64cc17fba8ed5bba2c4378e00.png)
![](../../Z-Others/assets/85e0-57b661b03335b0664d39e94578335fe6.png)
![](../../Z-Others/assets/92f9-79da26dfe7487437af2daf5b66b7b5d7.png)
## 二、Obsidian 设置
1. 把`obsidian@little/Obsidian@simpread/.obsidian/plugins`的三个插件复制到 Obsidian 插件文件夹内，`obsidian@little/Obsidian@simpread/.obsidian`是隐藏文件夹

![](../../Z-Others/assets/50ee-c7305ae42b1cd0e8421f151eda841e4b.png)
2. 把下载的 simpRead Sync 插件（simpread-obsidian-plugin-main.zip）解压复制到 Obsidian 插件内，重启 Obsidian。

![](../../Z-Others/assets/b1b1-9ac71cf454800626bc51eb9702b5d66e.png)
3. 打开全部插件，然后设置 Local REST API 插件，把 key 复制到插件的 Token。
![](../../Z-Others/assets/f850-ddef91c016ddd9ed5407977568987bd0.png)
## 三、一键剪藏
1. 打开 Obsidian 软件
2. 浏览器打开一个内容页面，等待插件简悦插件变红后点击
3. 点击剪藏

![](../../Z-Others/assets/2c71-0beb69d076f4dd4cd3a6810ecd2eb106.png)
4. 完成剪藏

![](../../Z-Others/assets/b555-015185568a4e3595a3a6730cff52db06.png)
5. 图片保存到本地，下载图片保存插件 local images

  - 设置好保存附件文件夹就好。有条件的可以的可以压缩一下。

![](../../Z-Others/assets/f766-a251a4863706dc56e9a7dcfe65693eff.png)
- 使用：打开命令面板 - 输入 `local images`，选择第二个即可。

![](../../Z-Others/assets/5ab9-20df0ab0b32b4f935245fb80cb753211.png)
![](../../Z-Others/assets/97fe-f8941b8f97ee5a39cda10edd3a2423b3.png)
![](../../Z-Others/assets/46e5-89e5a0e0b67149cd4191041065f897a7.png)


