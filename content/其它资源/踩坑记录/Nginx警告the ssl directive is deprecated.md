---
created: 2024-09-28T13:00:28.000+08:00
updated: 2024-09-28T13:05:42.129+08:00
tags:
  - nginx
dg-publish: true
---
## 警告信息
```shell
 [warn] 722099#722099: the "ssl" directive is deprecated, use the "listen ... ssl" directive instead in  ...
```
## 解释
这个警告信息表明你在Nginx配置文件中使用了ssl指令，但这个指令已经不再被推荐使用了。在较新版本的Nginx中，ssl指令已经被listen指令的特定参数所取代。
## 解决方法
你需要将配置文件中的ssl指令替换为listen指令相应的参数。例如，如果你的配置文件中有这样的行：
```nginx
listen 443;
ssl on;
```
替换为：
```nginx
listen 443 ssl;
```
这里，ssl参数告诉Nginx在443端口上进行安全的HTTPS监听，并启用SSL。

请确保你的配置文件中不再使用ssl指令，并且你使用的是支持这些参数的Nginx版本。如果你不确定如何更新Nginx或者不确定配置文件中其他部分的兼容性，你可以查看Nginx官方文档中关于SSL配置的最新指导。