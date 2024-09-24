---
tags:
  - obsidian
  - 资源
  - 数字花园
  - enveloppe
  - quartz
dg-publish: true
created: 2024-09-19T16:43:56.000+08:00
updated: 2024-09-24T15:10:52.043+08:00
---
## 官方publish插件
核心插件，启用发布功能即可，需要官方订阅。
## Digital Garden
> [!info] 
> - 项目地址：[GitHub - oleeskild/obsidian-digital-garden](https://github.com/oleeskild/obsidian-digital-garden)
> - 演示/说明文档：[Digital Garden - Publish Obsidian Notes For Free](https://dg-docs.ole.dev/)

优点：
1. 配置简单，除了部署，日常所需配置均可在插件中修改，就算不会用git也能上手。
2. 发布灵活，真一键发布，发布中心界面友好，修改删除情况一目了然。
3. 对本地笔记空间侵入性小，通常情况只需添加`dg-publish: true`属性即可完成发布配置，几乎不污染本地笔记。

不足：
1. 中文支持欠佳。
2. bug较多，一些影响体验的bug也是由于对中文支持不好引起的（非ascii字符导致的各种问题）。
3. 对obsidian的功能支持有限，比如页面嵌入效果是在上传时做了转换实现的，处在能用但是还可以优化的更好的水平。
4. 页面不太舒服，上传本地的主题配置无法完全生效，还需要手动上传自定义的css文件。
## Quartz
> [!info]
> - 项目地址：[GitHub - jackyzha0/quartz: 🌱 a fast, batteries-included static-site generator that transforms Markdown content into fully functional websites](https://github.com/jackyzha0/quartz)
> - 演示/说明文档：[Welcome to Quartz 4](https://quartz.jzhao.xyz/)
> - 相关站点：[Quartz Showcase](https://quartz.jzhao.xyz/showcase)

优点：
1. 界面美观流畅，对obsidian笔记兼容性~~较好~~极好（赞👍）。
2. 自定义程度较高，项目结构清晰，即使非专业人士也能很快上手按自己喜好调整配置以及简单修改样式。
3. 扩展性好，支持自定义插件，未来可期。

不足：
1. 略微存在门槛，需要具备一定开发基础。
2. 需要单独维护笔记库，相当于使用obsidian作为编辑器的纯博客项目（使用场景问题，单纯作为静态博客使用反而是优点）。
3. 社区内容分散，资源基本都在discord的讨论中，虽然有分区但是不够方便，第三方插件需要从别人的仓库中东拼西凑复制，
## Enveloppe
> [!info]
> - 项目地址：[GitHub - Enveloppe/obsidian-enveloppe: Enveloppe helps you to publish your notes on a GitHub repository from your Obsidian Vault, for free!](https://github.com/Enveloppe/obsidian-enveloppe)
> - 演示/说明文档：[Home](https://enveloppe.github.io/)

优点：
1. 静态博客通用解决方案，支持[[obsidian发布工具#Quartz|Quartz]]，具体操作参考Quartz+Enveloppe搭建数字花园。
2. 支持本地与发布博客分离的工作流，==配置完成后==使用体验类似[[obsidian发布工具#Digital Garden|Digital Garden]]。

不足：
1. 配置起来略微繁琐，文档解释不够清晰，理解起来有点困难。
2. 检查所有笔记较为耗时，管理方面有所欠缺，不过可以理解，毕竟是个通用的发布框架。

## 参考链接
- [Obsidian实现免费第三方发布的安逸方案\_服务软件\_什么值得买](https://post.smzdm.com/p/90924/)