---
url: https://blog.csdn.net/m0_60416689/article/details/135522645
title: 本地安装 nvm 实现 nodejs 多版本管理及切换版本
date: 2024-10-11 00:21:48
tags:
  - 转载
banner: https://images.unsplash.com/photo-1727709350469-5fde916217a8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0Njc1ODd8MHwxfHJhbmRvbXx8fHx8fHwxfHwxNzI4NTc3MjYxfA&ixlib=rb-4.0.3&q=85&fit=crop&w=1146&max-h=540
banner_icon: 🔖
created: 2024-10-11T00:21:48.000+08:00
updated: 2024-10-12T16:52:10.551+08:00
dg-publish: true
---
> 原文链接： [nodejs 版本过高导致 vue-cli 项目无法正常运行解决方案_nodejs 版本太高 - CSDN 博客]( https://blog.csdn.net/m0_60416689/article/details/135522645)
> 说明：在未改变原意的前提下对原文内容进行了微调，截图均来自原文，争议内容添加了注解说明。

## 一、nvm 的下载
推荐 github 下载最新版本：[Releases · coreybutler/nvm-windows · GitHub](https://github.com/coreybutler/nvm-windows/releases "Releases · coreybutler/nvm-windows · GitHub")
![[../../Z-Others/assets/79327a48f95d2cfe111bbf7a73a5be34_MD5.png|img]]

如果 github 打不开可以下载这个 [nvm 中文网](https://nvm.uihtm.com/ "nvm中文网")

![[../../Z-Others/assets/af8464b72d5ca5bb1e347e3717aa53f1_MD5.png|img]]

##  二、nvm 的安装

> [!attention]
> 注：最好不要装在 C 盘

在指定的文件下新建两个文件夹：
- `nodefile\nvm`，存放 nvm 的安装文件。
- `nodefile\node`，存放 node 的文件。

之后默认 install 安装

![[../../Z-Others/assets/9ed29b55c6cd52958dbb32dd8530cc95_MD5.png|img]]

![[../../Z-Others/assets/815577fa1d033628201ea7e9604afa75_MD5.png|img]]

![[../../Z-Others/assets/ceae02f3f3df20f7c5ecfd17538d5b14_MD5.png|img]]

## 三、nvm 的检查
###  `nvm -v` 查看 nvm 版本
![[../../Z-Others/assets/deba55387f4d63ad01289f20339c9471_MD5.png|img]]
###   `nvm list` 查看已安装 node.js 版本
![[../../Z-Others/assets/5fe06cf85bc93069a294d373bcca2afc_MD5.png|img]]
###  `nvm list available` 查看 node.js 可安装版本
![[../../Z-Others/assets/43634838e3eec0d4eece2590afd171fa_MD5.png|img]]
## 四、nvm 的配置
### 1. 安装目录找到 settings.txt 设置镜像（下载加快）
![[../../Z-Others/assets/ec0d3251315697b9b5a8d983e867a8eb_MD5.png|img]]

打开 settings.txt 增加内容如下： 
```txt title="settings.txt"
nvm npm_mirror https://npmmirror.com/mirrors/npm/
nvm node_mirror https://npmmirror.com/mirrors/node/
```
或者：
```txt title="settings.txt"
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

![[../../Z-Others/assets/b942fa55c5cbdf6e7c8656a910a383d1_MD5.png|img]]

###  2. 配置环境变量及安装切换不同版本 node.js
1、如果安装的版本是低版本需要卸载当前的版本。
2、安装自己需要的版本，从低到高[^1]。
3、配置 node.js 环境变量，需要使用哪个版本的就把哪个版本的 `path` 写在前边。
> node.js 官网：[下载 | Node.js 中文网](https://nodejs.cn/download/ "下载 | Node.js 中文网")
> 查看所有 node.js 版本号官网：[Previous Releases | Node.js](https://nodejs.org/en/download/releases "Previous Releases | Node.js")

如果 `nvm ls` 时没有自己想要的版本，那么去上面两个网址查看，nvm 下载需要的版本号；
如果想独立安装 node.js，请到这文章：[Node.js 安装详细过程 - CSDN 博客](https://blog.csdn.net/m0_60416689/article/details/135349451?spm=1001.2014.3001.5501 "Node.js安装详细过程-CSDN博客")
### 3. 卸载原有版本，重新安装
```shell
nvm uninstall 18.19.0 （版本号）
```

![[../../Z-Others/assets/77a328b11c35e2cb239f16f3bf7c8c77_MD5.png|img]]
### 4. 安装新版本
```shell
nvm install 18.19.0（你要装的版本号）
```

![[../../Z-Others/assets/799888fbc8b2397d70dd20b7ac8490c5_MD5.png|img]]

![[../../Z-Others/assets/dfe588d35a8b3ca3183e4850da5319f0_MD5.png|img]]

### 5. `nvm use` 切换 node.js 版本

![[../../Z-Others/assets/0effec397be553de839a3cf770457f86_MD5.png|img]]

### 6.nvm 命令提示
1.  `nvm arch` ：显示 node 是运行在 32 位还是 64 位。  
2.  `nvm install <version> [arch]`  ：安装 node， version 是特定版本也可以是最新稳定版本 latest。可选参数 arch 指定安装 32 位还是 64 位版本，默认是系统位数。可以添加 --insecure 绕过远程服务器的 SSL。  
3.  `nvm list [available]` ：显示已安装的列表。可选参数 available，显示可安装的所有版本。list 可简化为 ls。  
4. `nvm on`  ：开启 node.js 版本管理。  
5. `nvm off` ：关闭 node.js 版本管理。  
6.  `nvm proxy [url]`：设置下载代理。不加可选参数 url，显示当前代理。将 url 设置为 none 则移除代理。  
7.  `nvm node_mirror [url]`：设置 node 镜像。默认是 https://nodejs.org/dist/ 。如果不写 url，则使用默认 url。设置后可至安装目录 settings.txt 文件查看，也可直接在该文件操作。  
8.  `nvm npm_mirror [url]` ：设置 npm 镜像。默认是 https://github.com/npm/cli/archive/ 。如果不写 url，则使用默认 url。设置后可至安装目录 settings.txt 文件查看，也可直接在该文件操作。  
9.  `nvm uninstall <version>` ：卸载指定版本 node。  
10.  `nvm use [version] [arch]`：使用制定版本 node。可指定 32/64 位。  
11.  `nvm root [path] ` ：设置存储不同版本 node 的目录。如果未设置，默认使用当前目录。  
12.  `nvm version` ： 显示 nvm 版本。`version` 可简化为 `v`。

### 7. 环境变量的配置
`NVM_HOME` ，nvm 安装地址。
`NVM_SYMLINK` ，node 安装地址。

![[../../Z-Others/assets/ca34847dc473183632ae6bc6deda5571_MD5.png|img]]

### 8. node 环境配置
类似于 [Node.js 安装详细过程 - CSDN 博客](https://blog.csdn.net/m0_60416689/article/details/135349451?spm=1001.2014.3001.5501 "Node.js安装详细过程-CSDN博客")
在对应的目录下新建两个文件夹 `node_cache` 以及 `node_global` 。
![[../../Z-Others/assets/64653027778a60b94c744b39c0e377b8_MD5.png|img]]

创建完两个文件夹后，在 cmd 窗口中输入以下命令（两个路径即是两个文件夹的路径）：
```shell
npm config set prefix "D:\project needs\nodefile\node\node_global"
npm config set cache "D:\project needs\nodefile\node\node_cache"
```

接下来设置电脑环境变量，右键 **我的电脑**=>**属性** =>**高级系统设置** =>**环境变量** ，进入以下环境变量对话框。  
在【**系统变量**】新建环境变量 `NODE_PATH`，值为 `D:\project needs\nodefile\node\node_global`，其中 `D:\project needs\nodefile\node\node_global` 是上述创建的全局模块安装路径文件夹:
![[../../Z-Others/assets/a7f5d4775ef52a09c0a715baa7073b88_MD5.png|img]]

修改 **【用户变量】** 中的 `path` 变量，将 `C:\Users\JW\AppData\Roaming\npm` 修改为 `D:\project needs\nodefile\node\node_global`
![[../../Z-Others/assets/b8076f360d1dc3f87330747e19656039_MD5.png|img]]

点击确定后，配置完成。 
测试是否配置成功，在 cmd 窗口中输入以下指定全局安装 yarn
```shell
npm install -g yarn
```

![[../../Z-Others/assets/1ad3de2017cbdac50d9a20ab347e6ea4_MD5.png|img]]

针对 `yarn` 命令：需要做全局配置，才能使用，在 **【用户变量】** 配置：[^2] 

![[../../Z-Others/assets/f03a3b70f5271d9c25b24c90e3ddf12d_MD5.png|img]]

 查看是否配置成功：
![[../../Z-Others/assets/168a39b67b70b0ff874dd5db8158b8b4_MD5.png|img]]

### 9.npm 命令提示
 命令 及作用  ：
- `npm -v` ，查看 npm 版本。  
- `npm init` ，初始化后会出现一个 package.json 配置文件。可以在后面加上 -y ，快速跳过问答式界面。  
- `npm install` ，根据项目中的 package.json 文件自动下载项目所需的全部依赖。  
- `npm install 包名 --save-dev(npm install 包名 -D)`，安装的包只用于开发环境，不用于生产环境，会出现在 package.json 文件中的 devDependencies 属性中。  
- `npm install 包名 --save(npm install 包名 -S)`，安装的包需要发布到生产环境的，会出现package.json 文件中的 dependencies 属性中。  
- `npm list `  ， 查看当前目录下已安装的 node 包。  
- `npm list -g ` ，  查看全局已经安装过的 node 包。  
- `npm --help`   ， 查看 npm 帮助命令。  
- `npm update 包名`   ， 更新指定包。  
- `npm uninstall 包名 `   ，卸载指定包。  
- `npm config list`   ， 查看配置信息。  
- `npm 指定命令 --help`    ，查看指定命令的帮助。  
- `npm info 指定包名  `  ，查看远程 npm 上指定包的所有版本信息。  
- `npm config set registry https://registry.npm.taobao.org`  ，修改包下载源，这里修改为了淘宝镜像。  
- `npm root`   ，查看当前包的安装路径。  
- `npm root -g`    ，查看全局的包的安装路径。  
- `npm ls 包名`    ，查看本地安装的指定包及版本信息，没有显示 empty。  
- `npm ls 包名 -g `   ，查看全局安装的指定包及版本信息，没有显示 empty。

[^1]: 转载注明：此为原作者观点，非必须。
[^2]: 转载注明：无需此操作也可直接使用命令行，此处无法使用的原因是前面添加的环境变量需要重启系统后才能生效。