---
tags:
  - supervisor
dg-publish: true
---

在使用 `supervisor` 守护 `start_syncserver.sh` 脚本运行 Anki syncserver 时，如果执行 `supervisorctl stop` 后发现进程没有正确关闭，这可能与以下几个原因有关：

### 1. 子进程问题
`supervisor` 可能只管理了启动脚本的进程，而没有管理由脚本启动的子进程。`anki.syncserver` 进程可能作为子进程运行，而不是直接由 `supervisor` 管理，因此在停止脚本时，子进程不会自动终止。

### 解决方法：
确保 `supervisor` 能够正确管理所有子进程。你可以在 `supervisor` 配置中使用 `stopsignal` 选项，将信号发送给主进程及其所有子进程：

```ini
[program:syncserver]
command=/bin/bash /path/to/start_syncserver.sh
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/syncserver.err.log
stdout_logfile=/var/log/supervisor/syncserver.out.log
stopsignal=QUIT
stopasgroup=true
killasgroup=true
```

`stopasgroup=true` 和 `killasgroup=true` 会确保 `supervisor` 在停止进程时会杀死整个进程组，包括脚本生成的所有子进程。

### 2. 脚本运行方式
在你的 `start_syncserver.sh` 中，`anki.syncserver` 进程可能是在后台运行，或者脚本的进程控制方式导致 `supervisor` 无法正确跟踪 `anki.syncserver`。

### 解决方法：
修改脚本，确保 `anki.syncserver` 直接在前台运行，而不是通过后台方式启动：

```bash
#!/bin/bash
export SYNC_USER1=username1:password1
export SYNC_USER2=username2:password2
export SYNC_PORT=29901
exec ~/syncserver/bin/python -m anki.syncserver
```

`exec` 命令会将 `anki.syncserver` 进程替换为脚本本身的进程，使 `supervisor` 能直接管理 `anki.syncserver`。

