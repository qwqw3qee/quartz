---
created: 2025-05-23T16:44:29.000+08:00
updated: 2025-05-23T17:34:08.879+08:00
dg-publish: true
---
项目地址：[GitHub - adang1345/PythonWin7: Python 3.9+ installers that support Windows 7 SP1 and Windows Server 2008 R2 SP1](https://github.com/adang1345/PythonWin7?tab=readme-ov-file)

Python官方自Python 3.9开始停止对win7的支持，而PythonWin7则填补了这一空白，让这些老旧系统也能享受到Python的强大功能。
为了便于迁移，本文对embed版本进行配置，方便随时迁移到没有公网环境的win7系统中使用。

## 系统准备

> 注意：必须安装Windows更新KB2533623才能运行Python。请确保您的计算机通过Windows更新保持最新状态。或者，您可以手动安装更新KB3063858，它取代了KB2533623。可以在以下链接获取 [32-bit Windows](https://www.microsoft.com/en-us/download/details.aspx?id=47409) 或 [64-bit Windows](https://www.microsoft.com/en-gb/download/details.aspx?id=47442)的更新KB3063858。
> 
## 下载python离线包

下载地址：[PythonWin7/3.13.3/python-3.13.3-embed-amd64.zip at master · adang1345/PythonWin7 · GitHub](https://github.com/adang1345/PythonWin7/blob/master/3.13.3/python-3.13.3-embed-amd64.zip)
下载内容：**python-3.13.3-embed-amd64.zip**

## 下载pip安装文件

下载地址：[https://pip.pypa.io/en/stable/installing/](https://pip.pypa.io/en/stable/installing/)  
下载内容：找到**get-pip.py**文件链接，右键保存即可。 


### 下载pip离线安装文件，修复移动后产生的错误

下载地址：[https://pypi.tuna.tsinghua.edu.cn/simple/pip/](https://pypi.tuna.tsinghua.edu.cn/simple/pip/)  
下载内容：**pip-25.1.1-py3-none-any.whl**
注意后缀，是wheel的文件

## 本地配置

文件下载下来后，解压**python-3.13.3-embed-amd64.zip**，把**get-pip.py**和**pip-25.1.1-py3-none-any.whl**移动到解压的文件夹内，在该文件内按住Shift键右击空白处，选择【在此处打开 Powershell 窗口】,  
运行

```python
 .\python.exe .\get-pip.py 
```

下载安装成功后，文件夹里就多出来Lib和Scripts文件夹，

### 修改

记事本打开`python313._pth`，去除import site的注释

```python
python313.zip
.

# Uncomment to run site.main() automatically
import site

```

查看已安装的Lib，运行
```shell
.\python.exe -m pip list
```
显示如下：
```python
Package            Version
------------------ ---------
pip                25.1.1
```

## 绿化&卸载脚本
新建一个文本文档，粘贴以下内容，保存为`绿化&卸载.bat`，文件编码为`ANSI`。
```shell title="绿化&卸载.bat"
@echo off
chcp 936 >nul
setlocal EnableDelayedExpansion

:: =================== 配置变量 ===================
:: 替换为你需要安装的 pip.whl 文件名
set "PIP_WHL=pip-25.1.1-py3-none-any.whl"
:: ===============================================

:: 检查是否有管理员权限（测试写 system drive）
fsutil dirty query %systemdrive% >nul 2>&1
if errorlevel 1 (
    echo 请求管理员权限中...
    powershell -Command "Start-Process '%~f0' -Verb RunAs" >nul 2>&1
    if errorlevel 1 (
        mshta "vbscript:CreateObject(\"Shell.Application\").ShellExecute(\"%~f0\",,\"\",\"runas\",1)(window.close)"
    )
    exit /b
)

:: 设置当前路径
set "CUR_DIR=%~dp0"
set "CUR_DIR=!CUR_DIR:~0,-1!"
cd /d "!CUR_DIR!"
set "SCRIPTS_PATH=!CUR_DIR!\Scripts"

echo 当前目录：!CUR_DIR!
echo 使用的 pip 安装包：!PIP_WHL!
echo.

echo =============================
echo 请选择一个操作： 
echo 1. 绿化（添加 PATH + 安装 pip） 
echo 2. 卸载（移除 PATH） 
echo 3. 退出 
echo =============================
set /p choice=请输入选项编号并按回车: 

if "%choice%"=="1" goto :install
if "%choice%"=="2" goto :uninstall
goto :end

:install
echo 正在添加环境变量... 
reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH >tmp.txt 2>nul
for /f "tokens=3*" %%a in ('findstr /i "PATH" tmp.txt') do set "OLD_PATH=%%a %%b"
del tmp.txt

echo !OLD_PATH! | find /i "!CUR_DIR!" >nul
if not errorlevel 1 goto :skip_add

set "NEW_PATH=!OLD_PATH!;!CUR_DIR!;!SCRIPTS_PATH!"
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH /t REG_EXPAND_SZ /d "!NEW_PATH!" /f >nul
echo 已添加至 PATH。 

:: 添加环境变量完成后刷新环境设置 
echo 正在刷新环境变量...  
powershell -Command "$envVar='Environment';Add-Type -Namespace Win32 -Name NativeMethods -MemberDefinition '[DllImport(\"user32.dll\",SetLastError=true,CharSet=CharSet.Unicode)]public static extern IntPtr SendMessageTimeout(IntPtr hWnd,uint Msg,IntPtr wParam,string lParam,uint fuFlags,uint uTimeout,out IntPtr lpdwResult);';$null=[Win32.NativeMethods]::SendMessageTimeout([intptr]0xffff,0x1A,[intptr]::Zero,$envVar,0,1000,[ref]([intptr]::Zero))"


:skip_add

echo 正在安装 pip: !PIP_WHL!
if exist ".\python.exe" (
    .\python.exe -m pip install -U "!PIP_WHL!" --force-reinstall
) else (
    echo 错误：找不到 .\python.exe 
)
goto :done

:uninstall
echo 正在移除 PATH 中的路径...

:: 读取旧 PATH
reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH >tmp.txt 2>nul
for /f "tokens=3*" %%a in ('findstr /i "PATH" tmp.txt') do set "OLD_PATH=%%a %%b"
del tmp.txt

:: 用分号分割 PATH 项逐一保留不匹配的路径
set "NEW_PATH="
for %%i in ("!OLD_PATH:;=";"!") do (
    set "item=%%~i"
    echo !item! | find /i "!CUR_DIR!" >nul
    if errorlevel 1 (
        echo !item! | find /i "!SCRIPTS_PATH!" >nul
        if errorlevel 1 (
            if defined NEW_PATH (
                set "NEW_PATH=!NEW_PATH!;!item!"
            ) else (
                set "NEW_PATH=!item!"
            )
        )
    )
)

:: 写回 PATH
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH /t REG_EXPAND_SZ /d "!NEW_PATH!" /f >nul
echo 路径已移除。 

:: 添加环境变量完成后刷新环境设置 
echo 正在刷新环境变量...  
powershell -Command "$envVar='Environment';Add-Type -Namespace Win32 -Name NativeMethods -MemberDefinition '[DllImport(\"user32.dll\",SetLastError=true,CharSet=CharSet.Unicode)]public static extern IntPtr SendMessageTimeout(IntPtr hWnd,uint Msg,IntPtr wParam,string lParam,uint fuFlags,uint uTimeout,out IntPtr lpdwResult);';$null=[Win32.NativeMethods]::SendMessageTimeout([intptr]0xffff,0x1A,[intptr]::Zero,$envVar,0,1000,[ref]([intptr]::Zero))"


goto :done

:done
echo. 
echo 操作完成，建议注销或重启后生效。 
pause
goto :end

:end
exit /b
```

将该文件夹复制到新的系统中后，执行此脚本进行绿化即可。
## 踩坑记录
### 执行绿化脚本后，在新的终端输入python命令，弹出windows商店中的python安装页面？
在系统环境变量中，将`C:\Users\Administrator\AppData\Local\Microsoft\WindowsApps`删除或移动到末尾即可。

## 参考文档
- [好学编程：PythonWin7打破壁垒，在Windows 7上安装Python 3.13版本的终极解决方案](https://zhuanlan.zhihu.com/p/24700697441)
- [在windows内离线部署python-免安装版及离线安装第三方库 - 一个萝卜 - 博客园](https://www.cnblogs.com/derek-h/p/14849519.html)
