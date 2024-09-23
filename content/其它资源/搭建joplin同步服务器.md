---
tags:
  - joplin
  - 教程
dg-publish: true
created: 2024-09-06T13:58:55.000+08:00
updated: 2024-09-23T15:56:30.373+08:00
---
> github地址：[https://github.com/laurent22/joplin/tree/dev/packages/server](https://github.com/laurent22/joplin/tree/dev/packages/server "https://github.com/laurent22/joplin/tree/dev/packages/server")  
> docker镜像地址：[https://hub.docker.com/r/joplin/server](https://hub.docker.com/r/joplin/server "https://hub.docker.com/r/joplin/server")

Joplin是一款开源的笔记工具，支持多种同步方式。如果你有一台云服务器，可以考虑将同步服务部署在云服务器上，同步服务更佳。本文将介绍如何在服务器上部署Joplin服务端（Joplin Server）。
## 一、安装docker

如果之前没用过docker，可用此命令一键安装：

```shell
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

## 二、下载PostgreSQL镜像并运行

默认使用SQLite数据库，更换容器后数据不易迁移。可以进行数据持久化操作，或者使用PostgreSQL。

使用PostgreSQL数据库注意配置问题。在docker中连接宿主机的PostgreSQL需要修改些配置，详见：[docker镜像连接宿主机PostgreSQL数据库踩坑记录](joplin://69404e2c8f444163abc0ac99d94eaff4)

或者使用PostgreSQL的docker镜像，配置起来更加方便。

1.下载镜像：

```shell
docker pull postgres:latest
```

2.建立容器并后台运行：

```shell
docker run  --restart=always --name my_postgres -v dv_pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:latest
```

其中，my_postgres为你的容器名字，password改为你要设置的密码。dv_pgdata为docker volume的名称，/var/lib/postgresql/data对应docker volume的实际路径，这两个不存在时会自动创建。

3.进入容器：

```shell
docker exec -it my_postgres bash
```

4.新建数据库：

```shell
psql -U postgres
CREATE USER root WITH PASSWORD 'password';
CREATE DATABASE joplin OWNER root;
GRANT ALL PRIVILEGES ON DATABASE joplin to root;
\q
```

注意相关的名称与密码与jopiln配置文件中的保持一致。

5.按`Ctrl+D`离开容器。

## 三、下载joplin服务端镜像并运行

1.下载镜像：

```shell
docker pull joplin/server:latest
```

2.建立容器并后台运行：

```shell
docker run -d --name=joplin_in_use --restart=always --env-file /root/joplin-server/.env -p 22300:22300 joplin/server:latest
```

3.`.env`文件参考官方示例，注意与数据库保持一致。

## 四、配置nginx

配置https需要用到nginx之类的软件反向代理。

1.如果没有nginx，并且没有建网站需求，可以直接从仓库里安装nginx。

```shell
sudo apt install nginx
```

如果有建站需求，建议先将网站搞好，再进行后续操作。

2.设置nginx开机自启

```shell
systemctl enable nginx
```

3.在`/etc/nginx/conf.d`中，新建一个`.conf`文件，名字随意（如`joplin.conf`），参考内容如下，根据实际情况调整（假设已经拥有域名和ssl证书）：

```nginx
server {
    listen  22301;
    server_name 域名;
    ssl on;
    ssl_certificate      /证书路径/xxx.crt;
    ssl_certificate_key   /密钥路径/xxx.key;
    ssl_session_timeout   5m;
    ssl_protocols         TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers           HIGH:!aNULL:!MD5:!EXPORT56:!EXP;
    location  / {
        proxy_set_header Host $host:$server_port;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass         http://127.0.0.1:22300/;
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

6.访问`https://域名:23301`进入网页配置相关的账户信息即可。

- 默认用户名：admin@localhost
- 默认密码：admin

7.如果你的服务器在国外，或者国内但是已经备案，可以使用443端口，这样第11行的`proxy_set_header Host $host:$server_port;`可以去掉。

之后，在客户端设置里，同步目标选择Joplin Server，把参数填好即可。

## 五、常用命令

- 停止运行：`docker stop 容器名`
- 恢复运行：`docker start 容器名`
- 查看下载的镜像：`docker images`
- 删除镜像：`docker rmi 镜像名`
- 查看正在运行容器：`docker ps`
- 查看所有建立的容器 `docker ps -a`
- 删除所有建立的容器 `docker rm $(docker ps -aq)`
- 终端进入容器内部：`docker exec -it 容器名 bash`
- 查看最近10条实时日志：`docker logs -f --tail=10 容器名`
- 容器参数修改：`docker container update 参数 容器名`
- 查看已存在的docker volume：`docker volume ls`

## 六、参考链接

- [Docker容器开机自动启动](https://www.cnblogs.com/royfans/p/11393791.html "https://www.cnblogs.com/royfans/p/11393791.html")
- [docker run 如何让容器启动后不会自动停止](http://www.jerrymei.cn/docker-container-run-not-stop-automatically/ "http://www.jerrymei.cn/docker-container-run-not-stop-automatically/")
- [Docker常用命令及docker run 和 docker start区别](https://blog.csdn.net/weixin_44722978/article/details/89704085 "https://blog.csdn.net/weixin_44722978/article/details/89704085")
- [进入容器](https://yeasy.gitbook.io/docker_practice/container/attach_exec "https://yeasy.gitbook.io/docker_practice/container/attach_exec")
- [docker logs－查看docker容器日志](https://blog.csdn.net/weigang200820chengdu/article/details/102914326 "https://blog.csdn.net/weigang200820chengdu/article/details/102914326")
- [用docker运行postgreSQL](https://www.cnblogs.com/pekkle/p/12190229.html "https://www.cnblogs.com/pekkle/p/12190229.html")