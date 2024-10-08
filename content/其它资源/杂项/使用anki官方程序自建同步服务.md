---
tags:
  - anki
  - supervisor
  - nginx
created: 2024-09-28T14:48:23.000+08:00
updated: 2024-10-08T20:29:02.686+08:00
dg-publish: true
---
> 官方文档：[Sync Server - Anki Manual](https://docs.ankiweb.net/sync-server.html#self-hosted-sync-server)
## 程序安装
官方提供了[直接安装桌面版客户端](https://docs.ankiweb.net/sync-server.html#from-a-packaged-build)、[使用pip安装](https://docs.ankiweb.net/sync-server.html#with-pip)、[使用Cargo安装](https://docs.ankiweb.net/sync-server.html#with-cargo)、[使用源码安装](https://docs.ankiweb.net/sync-server.html#from-a-source-checkout)四种安装方式，此处使用pip安装。如果需要使用其它方式安装，可参考官方文档。
使用pip安装可以避免下载桌面Anki的GUI依赖项，从PyPI下载的Python包来运行独立的Anki同步服务器。要求已安装Python 3.9+。
```shell
python3 -m venv ~/syncserver
~/syncserver/bin/pip install anki
```
测试安装效果：
```shell
SYNC_USER1=user:pass ~/syncserver/bin/python -m anki.syncserver
```
终端显示：
```shell
2024-09-28T06:45:18.271338Z  INFO listening addr=0.0.0.0:8080
```
表面软件在正常运行，`Ctrl+C`终止程序。
## 环境变量说明
|           环境变量            |                                      说明                                      |
| :-----------------------: | :--------------------------------------------------------------------------: |
|   SYNC_USER1=user:pass    |                         `user`替换为用户名<br>`pass`替换为密码                          |
|    PASSWORDS_HASHED=1     | 启用散列密码（详见[官方文档](https://docs.ankiweb.net/sync-server.html#hashed-passwords)） |
|  SYNC_BASE=~/.syncserver  |                        将用户数据放入`~/.syncserver`目录中（默认值）                        |
|      SYNC_HOST=你的域名       |                               绑定域名（配合反向代理软件使用）                               |
|      SYNC_PORT=8080       |                                绑定端口为8080（默认值）                                |
| MAX_SYNC_PAYLOAD_MEGS=100 |                                  限制上传大小为100                                  |

`SYNC_USER1` 声明了第一个用户和密码，并且必须进行设置。如果您希望设置多个帐户，您可以选择声明 `SYNC_USER2` 、 `SYNC_USER3` 等。
如果需要兼容旧版Anki客户端，还需要配置`SYNC_ENDPOINT` 和 `SYNC_ENDPOINT_MEDIA`，详见[官方文档](https://docs.ankiweb.net/sync-server.html#client-setup)。
## 使用脚本运行
新建脚本文件并命名为`start_syncserver.sh`，内容如下：
```shell title="start_syncserver.sh"
#!/bin/bash
export SYNC_USER1=test1:123456
export SYNC_USER2=test2:123456
export SYNC_PORT=27701
exec /root/syncserver/bin/python -m anki.syncserver
```
参考[[使用anki官方程序自建同步服务#环境变量说明|上一节内容]]，修改环境变量的值。
注意使用`exec`命令执行程序，可保证进程直接在前台运行，防止`supervisor`无法直接管理子进程。也可以不使用`exec`，则在守护进程中需要额外进行配置。
可以配置守护进程自动运行脚本，如果有配置修改，修改后重启脚本便可。
## 配置守护进程
这里使用`supervisor`进行守护进程。在`/etc/supervisor/conf.d`中，新建`ankioffical.conf`，内容如下，注意根据实际情况修改脚本路径：
```ini title="ankioffical.conf"
[program:ankioffical]
command=/root/start_syncserver.sh             ; the program (relative uses PATH, can take args)
directory=/root              ; directory to cwd to before exec (def no cwd)
autostart=true                ; start at supervisord start (default: true)
autorestart=true              ; retstart at unexpected quit (default: true)
startsecs=3                  ; number of secs prog must stay running (def. 1)
stdout_logfile=/var/log/ankioffical.log        ; stdout log path, NONE for none; default AUTO
;stderr_logfile_maxbytes=10KB;
;stderr_logfile_backups=10;
stderr_logfile=/var/log/ankioffical.error.log    ; stderr log path, NONE for none; default AUTO
;stdout_logfile_maxbytes=10KB;
;stdout_logfile_backups=10;
stopsignal=QUIT
stopasgroup=true
killasgroup=true
```
其中，如果脚本中使用了`exec`命令运行同步服务器，配置文件中最后三行可以省略，这三行的目的是监控程序的所有子进程。守护进程遇到的问题：[[../踩坑记录/supervisor守护进程子进程问题|supervisor守护进程子进程问题]]
## Nginx转发
客户端默认使用http协议，如果需要配置https，以Nginx为例，在`/etc/nginx/conf.d`中，新建`ankioffical.conf`，内容如下，域名证书端口等内容根据实际情况修改。
```nginx title="ankioffical.conf"
server {
    listen  27702;
    server_name 你的域名;
    ssl on;
    ssl_certificate       /证书所在路径/xxx.crt;
    ssl_certificate_key   /密钥所在路径/xxx.key;
    ssl_session_timeout   5m;
    ssl_protocols         TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers           HIGH:!aNULL:!MD5:!EXPORT56:!EXP;
    set_real_ip_from      0.0.0.0/0;
    real_ip_header        X-Forwarded-For;
    location / {
        proxy_http_version 1.0;
        proxy_pass          http://127.0.0.1:27701/;
        # 传递真实客户端 IP
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header    Host $host;
    }
}
```
运行`nginx -s reload`便可加载配置。
## 客户端配置方法
### PC端配置
在**工具**-**设置**-**同步**中，最下方找到自托管同步服务器，填写同步地址即可。
### Ankidroid配置
在**菜单**-**设置**-**同步**中，找到**自定义同步服务器**，填写同步地址即可。