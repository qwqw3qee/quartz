---
tags:
  - anki
  - 教程
dg-publish: true
created: 2021-11-07T17:03:00.000+08:00
updated: 2024-09-28T16:15:35.939+08:00
---
2024年9月28日更新：

> [!warning]
> 文章内容已过时，目前可直接使用官方程序搭建同步服务，可参考：[[./使用anki官方程序自建同步服务|使用anki官方程序自建同步服务]]


以下是原内容：

本人长期使用anki，之前根据网上的教程自建的服务端程序，感觉效果良好。最近自己的云服务器快到期了，恰逢腾讯云搞活动，买了个新的云服务器，又重新安装了anki的服务端，便将自己的操作记录一下，形成这篇教程。  
本文尽可能写的具体，但依旧有很多地方可能描述不清楚，加之有些操作全部写出来也很困难（比如域名注册，ssl证书申请等），所以对于0基础来说看起来可能依旧比较困难，建议配合搜索引擎阅读。  
本文搭建方式可能比较繁琐，如果使用docker版的可能会简单一些。本教程仅对自己的操作进行记录，不一定适合他人，仅供参考。如果有疑问，也欢迎在评论区中提出来，相互交流。

## 〇、说明

本文服务端基于[此项目](https://github.com/ankicommunity/anki-sync-server "https://github.com/ankicommunity/anki-sync-server")，感谢各路大神默默的维护。  
相关注意事项如下：  
1.ios无法使用自定义服务器！  
2.~~安卓支持最新版，PC版我在使用2.1.44，能否支持最新版需要自行测试~~。  
3.本文使用的自建服务端可能会有点小问题，不过项目一直在维护，未来可能会解决。

## 一、前置准备

1.一台linux云服务器（或者具有公网ip的linux主机），本文环境为腾讯轻量云，系统为 Debian 10.2 64bit。  
2.ssh连接工具，推荐xshell或者MobaXterm这类带有文件管理界面的工具，方便编辑文件。  
3.一个已经设置好dns的域名，并且申请了ssl证书（域名注册/购买，设置dns解析，为域名购买ssl证书等教程分别搜索对应的关键词即可）。

## 二、安装python3.10

由于anki需要python3.8及以上的环境，而大部分liunx系统自带的python3版本都低于此，因此，需要手动编译安装新版（大于等于3.8即可）。

1.运行以下命令以更新。

```shell
sudo apt update && sudo apt upgrade 
```

2.安装编译Python源代码所需的软件包。

```shell
sudo apt install wget build-essential libreadline-gplv2-dev libncursesw5-dev  libssl-dev libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev libffi-dev zlib1g-dev  
```

3.下载Python,下最新版载地址可在 [这里](https://www.python.org/downloads/source/ "https://www.python.org/downloads/source/") 找，本文以python3.10为例。

```shell
wget https://www.python.org/ftp/python/3.10.0/Python-3.10.0.tgz
```

4.解压。

```shell
tar xzf Python-3.10.0.tgz 
```

5.生成makefile。

```shell
cd Python-3.10.0 
./configure --enable-optimizations 
```

6.运行以下命令以在Debian系统上完成Python安装。该 altinstall 防止编译器覆盖默认的Python版本。

```shell
make altinstall 
```

## 三、下载anki-sync-server

1.如果没有git，先安装git：

```shell
sudo apt install git
```

2.从GitHub上下载服务端代码：

```shell
git clone https://github.com/ankicommunity/anki-sync-server.git
```

3.进入文件夹，下载所需依赖：

```shell
cd /anki-sync-server/src
pip3.10 install -r requirements.txt
```

注意报错信息，如果有错误需要根据提示搜索相关问题进行解决。  
4.根据注释提示编辑`ankisyncd.conf`，可以保持默认。  
5.添加账户：

```shell
./ankisyncctl.py adduser 用户名
```

运行这条命令后，会提示设置密码。记住这个用户名和密码，待会登录时使用。  
6.此时，直接执行下面代码，理论上服务端已经可以运行了。如果报错，根据错误提示排查问题。

```shell
python3.10 -m ankisyncd
```

## 四、下载supervisor配置开机自启

直接运行命令，在断开ssh时程序也会退出，不符合我们的需求，因此一来要使其可以后台运行，二来可以开机自启。在这里我们使用supervisor来进行守护。  
1.安装supervisor。

```shell
sudo apt install supervisor
```

2.设置supervisor开机自启。

```shell
systemctl enable supervisor
```

3.找到`/etc/supervisor/conf.d/`，新建一个`.conf`配置文件，内容如下：

```ini
[program:ankisyncd]
command=python3.10 -m ankisyncd              ; the program (relative uses PATH, can take args)
directory=/root/anki-sync-server/src              ; directory to cwd to before exec (def no cwd)
autostart=true                ; start at supervisord start (default: true)
autorestart=true              ; retstart at unexpected quit (default: true)
startsecs=3                  ; number of secs prog must stay running (def. 1)
stdout_logfile=/var/log/ankisyncd.log        ; stdout log path, NONE for none; default AUTO
stderr_logfile=/var/log/ankisyncd.error.log    ; stderr log path, NONE for none; default AUTO
```

其中，`command`对应启动程序的命令，`directory`对应运行命令所在的路径，需要根据实际情况进行修改。  
4.运行以下命令，加载配置文件并启动程序。

```shell
supervisorctl reload
```

5.可以通过以下命令查看程序运行状态。

```shell
supervisorctl status
```

如果看到有`RUNNING`字眼，说明配置成功了。

## 五、配置nginx代理

当前，直接连接服务端程序是有问题的，无法处理chunked请求。无论是否需要https，都要配置nginx在前端代理以处理chunked请求

1.如果没有nginx，并且没有建网站需求，可以直接从仓库里安装nginx。

```shell
sudo apt install nginx
```

如果有建站需求，建议先将网站搞好，再进行后续操作。  
2.设置nginx开机自启

```shell
systemctl enable nginx
```

3.在`/etc/nginx/conf.d`中，新建一个`.conf`文件，名字随意（如`anki.conf`），内容如下：

```nginx
server {
    listen  27702;
    server_name default;
    location / {
        proxy_http_version 1.0;
        client_max_body_size 0; 
        proxy_pass         http://127.0.0.1:27701/;
    }
}
```

如果之前装过nginx，配置文件的路径可能会有所不同，则需要根据实际情况进行配置。  
4.配置完成后，可用以下命令进行验证：

```shell
nginx -t
```

如果没问题，会看到诸如`ok`,`successful`等字样。如果有问题，则会看到具体的错误信息。  
5.使nginx重新加载配置文件：

```shell
nginx -s reload
```

这样，非https的服务端程序便完全搭建完毕。可以使用 `http://ip:27702/` 进行访问。

6.如果需要https，则需要将一个域名绑定到服务器的ip上，并将申请的ssl证书传到服务器上。一个典型的配置如下：

```nginx
server {
    listen  27704;
    server_name 你的域名;
    ssl on;
    ssl_certificate       /证书所在路径/xxx.crt;
    ssl_certificate_key   /密钥所在路径/xxx.key;
    ssl_session_timeout   5m;
    ssl_protocols         TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers           HIGH:!aNULL:!MD5:!EXPORT56:!EXP;
    location / {
        proxy_http_version 1.0;
        client_max_body_size 0; 
        proxy_pass         http://127.0.0.1:27701/;
    }
}
```

具体细节需要根据实际情况进行调整。

## 六、客户端配置

### 1、PC端配置

本文使用的客户端版本为2.1.44。能否支持最新版本取决于服务端程序维护情况。  
1.工具-附加组件-获取插件，输入`358444159`。插件[地址](https://ankiweb.net/shared/info/358444159 "https://ankiweb.net/shared/info/358444159")。  
2.选中`custom sync server redirector`，点配置，将内容改为你的地址。

```json
{
    "syncaddr": "http://你的服务器ip:27702/"
}
```

如果配置了https了，则应该为

```json
{
    "syncaddr": "https://你的域名:27702/"
}
```

3.重启anki，登录账号

### 2、Ankidroid设置

注意，安卓9及更高版本，必须使用https连接服务端（谷歌限制）。

1. 设置-高级设置-自定义同步服务器。

- 同步地址：`https://你的域名:27702/` 。
- 媒体文件同步地址：`https://你的域名:27702/msync` 。  
    注意第一个地址以/结尾，第二个地址不以/结尾，另外末尾不要有空格。

2. 设置-常用设置，勾选“同步时获取媒体文件”。
3. 主界面下拉刷新，登录账号即可。

## 七、当前已知问题

以下问题是我在使用时候发现的，未来可能会修复，也可能会出现新的问题。  
1.暂时不要使用安卓端的【检查媒体文件】功能，会导致同步时无法同步图片。  
2.如果是从低版本升级过来的，在添加或删除卡片后，可能会遇到提示【请检查数据库……】。