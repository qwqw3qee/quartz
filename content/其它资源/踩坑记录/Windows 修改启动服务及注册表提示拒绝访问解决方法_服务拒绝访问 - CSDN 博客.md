---
url: https://blog.csdn.net/jimmyxing001/article/details/140890369
title: Windows 修改启动服务及注册表提示拒绝访问解决方法_服务拒绝访问 - CSDN 博客
date: 2025-04-28 10:53:52
tags:
  - 转载
banner: https://images.unsplash.com/photo-1743945968054-088cff86a63a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0Njc1ODd8MHwxfHJhbmRvbXx8fHx8fHwxfHwxNzQ1ODA4ODMzfA&ixlib=rb-4.0.3&q=85&fit=crop&w=1258&max-h=540
banner_icon: 🔖
created: 2025-04-28T10:53:52.000+08:00
updated: 2025-04-28T10:54:28.269+08:00
dg-publish: true
---
> 原文链接： [Windows 修改启动服务及注册表提示拒绝访问解决方法_服务拒绝访问 - CSDN 博客]( https://blog.csdn.net/jimmyxing001/article/details/140890369)

在 Windows 服务中修改服务启动类型时候弹出 “**拒绝访问**”，比如将 “**启动类型**” 配置为 “**手动**”

![[../../Z-Others/assets/187d271cae3fe98b28f1dd6e9c2e7c00_MD5.jpg|187d271cae3fe98b28f1dd6e9c2e7c00_MD5]]

![[../../Z-Others/assets/823f9a0854d3f6984eaa8609d65e574e_MD5.jpg|823f9a0854d3f6984eaa8609d65e574e_MD5]]

进行这一步配置时候有可能会出现如下图所示的 “**拒绝访问**” 选项。

![[../../Z-Others/assets/ceb06d8db338b9760a9e8cd5bfe91fb8_MD5.jpg|ceb06d8db338b9760a9e8cd5bfe91fb8_MD5]]

针对这一种情况，我们进而加以解决。首先，还是同时按下`Windows徽标`键与`R`键，并输入`regedit`，打开[注册表编辑器](https://so.csdn.net/so/search?q=%E6%B3%A8%E5%86%8C%E8%A1%A8%E7%BC%96%E8%BE%91%E5%99%A8&spm=1001.2101.3001.7020)。

随后，在弹出的窗口中，依次找到服务对应的[注册表项](https://so.csdn.net/so/search?q=%E6%B3%A8%E5%86%8C%E8%A1%A8%E9%A1%B9&spm=1001.2101.3001.7020)， `\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\wuauserv` 这一栏，并右键选择 “**权限**” 选项；如下图所示。

![[../../Z-Others/assets/bbff83dda36863f22fc4f5f35ef17a6d_MD5.jpg|bbff83dda36863f22fc4f5f35ef17a6d_MD5]]

随后，我们选择`Administrators`用户，并在下方的 “**完全控制**” 处加以勾选，如下图所示。

![[../../Z-Others/assets/3559efd2087b9234ac14c1545738dc5e_MD5.jpg|3559efd2087b9234ac14c1545738dc5e_MD5]]

可是，有可能又会出现如下图所示的情况，即出现一个新的 “**拒绝访问**” 的报错提示。

![[../../Z-Others/assets/cb5cf2d1b27b36494a42e813c70003e3_MD5.jpg|cb5cf2d1b27b36494a42e813c70003e3_MD5]]

我们再针对这一情况加以解决。首先，我们还是进入刚刚配置权限的窗口中，选择 “**高级**” 选项。

![[../../Z-Others/assets/7fba5f85c2c114144901428ed67c09d3_MD5.jpg|7fba5f85c2c114144901428ed67c09d3_MD5]]

随后，在弹出的窗口中选择 “**审核**”→“**更改**” 选项。

![[../../Z-Others/assets/4e9a740cbbd8f4f0c0fa7dffdd6f5599_MD5.jpg|4e9a740cbbd8f4f0c0fa7dffdd6f5599_MD5]]

接下来，在弹出的窗口中，选择 “**高级**” 选项，并在新的窗口中选择 “**立即查找**”，如下图所示。

![[../../Z-Others/assets/008474230024a8a86bb5b05c3b3e5aa0_MD5.jpg|008474230024a8a86bb5b05c3b3e5aa0_MD5]]

随后，我们找到`Administrators`用户，选中并选择 “**确定**”。

![[../../Z-Others/assets/c58610191c3624d7a6c0229649371f04_MD5.jpg|c58610191c3624d7a6c0229649371f04_MD5]]

随后，我们选择 “**添加**” 选项。

![[../../Z-Others/assets/260a9db2eb210573da3c1c98b33c8bed_MD5.jpg|260a9db2eb210573da3c1c98b33c8bed_MD5]]

并如下图所示，依次选择 “**选择主体**”→“**高级**”→“**立即查找**”，找到`Administrators`用户后再点击 “**确定**”。

![[../../Z-Others/assets/52d4cdf9ef2211d763bb5e50d6ce6cd3_MD5.jpg|52d4cdf9ef2211d763bb5e50d6ce6cd3_MD5]]

随后，在如下图所示的窗口中，将 “**完全控制**” 选项勾选中。

![[../../Z-Others/assets/50d3956a051e6aaec43645ce01b8f7c7_MD5.jpg|50d3956a051e6aaec43645ce01b8f7c7_MD5]]

接下来点击 “**应用**” 并选择 “**确定**”。

此时，我们就可以在前述的属性款中，将`Administrators`用户的 “**完全控制**” 选项勾选中了。

接下来，我们就可以在如下图所示的窗口中，将 “**启动类型**” 可以正常修改为 “**手动**” 了。

![[../../Z-Others/assets/686c43675e37c9ad24b7921236810b45_MD5.jpg|686c43675e37c9ad24b7921236810b45_MD5]]