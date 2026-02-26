---
created: 2025-05-23T16:44:29.000+08:00
updated: 2026-02-26T10:46:06.348+08:00
dg-publish: true
tags:
  - python
---
> 项目地址：[GitHub - adang1345/PythonWin7: Python 3.9+ installers that support Windows 7 SP1 and Windows Server 2008 R2 SP1](https://github.com/adang1345/PythonWin7?tab=readme-ov-file)

Python官方自Python 3.9开始停止对win7的支持，而PythonWin7则填补了这一空白，让这些老旧系统也能享受到Python的强大功能。
为了便于迁移，本文对embed版本进行配置，方便随时迁移到没有公网环境的win7系统中使用。

## 系统准备

> 注意：必须安装Windows更新KB2533623才能运行Python。请确保您的计算机通过Windows更新保持最新状态。或者，您可以手动安装更新KB3063858，它取代了KB2533623。可以在以下链接获取 [32-bit Windows](https://www.microsoft.com/en-us/download/details.aspx?id=47409) 或 [64-bit Windows](https://www.microsoft.com/en-gb/download/details.aspx?id=47442)的更新KB3063858。
> 
### 下载python离线包

下载地址：[PythonWin7/3.13.3/python-3.13.3-embed-amd64.zip at master · adang1345/PythonWin7 · GitHub](https://github.com/adang1345/PythonWin7/blob/master/3.13.3/python-3.13.3-embed-amd64.zip)
下载内容：**python-3.13.3-embed-amd64.zip**

### 下载pip安装文件

下载地址：[https://pip.pypa.io/en/stable/installing/](https://pip.pypa.io/en/stable/installing/)  
下载内容：找到**get-pip.py**文件链接，右键保存即可。 


### 下载pip离线安装文件，修复移动后产生的错误

下载地址：[https://pypi.tuna.tsinghua.edu.cn/simple/pip/](https://pypi.tuna.tsinghua.edu.cn/simple/pip/)  
下载内容：**pip-25.1.1-py3-none-any.whl**
注意后缀，是wheel的文件

## 本地配置
### 安装pip

文件下载下来后，解压**python-3.13.3-embed-amd64.zip**，把**get-pip.py**和**pip-25.1.1-py3-none-any.whl**移动到解压的文件夹内，在该文件内按住Shift键右击空白处，选择【在此处打开 Powershell 窗口】,  
运行

```python
 .\python.exe .\get-pip.py 
```

下载安装成功后，文件夹里就多出来Lib和Scripts文件夹，

### 修改_pth配置

记事本打开`python313._pth`，去除import site的注释

```python title="python313._pth"
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
### （可选）安装需要的软件包
> 为什么要在实际开发机器中安装，因为同 pip 的安装一样，如果实现在 Python 绿色版中安装开发依赖，那么也会由于其绝对路径的不同导致无法运行依赖程序，pip 能通过专用的程序进行离线重安装，但是其他的就不一定了，而且从时间成本上来说并不划算。

此步正常安装即可，后续通过脚本进行备份与恢复。
## 修复&绿化&卸载脚本
新建一个文本文档，粘贴以下内容，保存为`修复_绿化_卸载.bat`，文件编码为`GBK`。脚本原理参考：[[./Python 绿色版及其依赖包的离线安装|Python 绿色版及其依赖包的离线安装]]
```shell title="修复\_绿化\_卸载.bat"
@echo off
chcp 936 >nul
setlocal EnableDelayedExpansion

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
:: -------------------------------
:: 相对路径配置
:: -------------------------------
set "BASE_DIR=%~dp0"
set "CUR_DIR=!BASE_DIR:~0,-1!"
set "PYTHON_EXE=%BASE_DIR%python.exe"
set "OFFLINE_DIR=%BASE_DIR%pip_offline"
set "REQ_FILE=%OFFLINE_DIR%\requirements.txt"
set "SCRIPTS_DIR=%BASE_DIR%Scripts"

:: -------------------------------
:: 选择模式
:: -------------------------------
echo =============================
echo 请选择一个操作: 
echo 1. 联网导出 wheel 包  
echo 2. 离线恢复安装 
echo 3. 离线修复损坏的 exe 工具（修改路径后需要） 
echo 4. 绿化（添加 PATH + 离线恢复安装） 
echo 5. 卸载（移除 PATH） 
echo 6. 退出 
echo =============================
set /p MODE=请输入选项编号并按回车: 

if "%MODE%"=="1" goto ONLINE
if "%MODE%"=="2" goto OFFLINE
if "%MODE%"=="3" goto OFFLINE_EXE
if "%MODE%"=="4" goto INSTALL
if "%MODE%"=="5" goto UNINSTALL
if "%MODE%"=="6" goto :END

echo 无效选项
pause
exit /b

:: -------------------------------
:ONLINE
echo ============================
echo 开始联网导出 wheel 包
echo ============================

if not exist "%OFFLINE_DIR%" mkdir "%OFFLINE_DIR%"

echo 导出已安装包列表到 %REQ_FILE% ...
"%PYTHON_EXE%" -m pip freeze > "%REQ_FILE%"

echo 下载所有包的 wheel 文件到 %OFFLINE_DIR% ...
"%PYTHON_EXE%" -m pip download -r "%REQ_FILE%" -d "%OFFLINE_DIR%" 

echo 检查缺失 wheel 文件...
for /f "tokens=*" %%A in (%REQ_FILE%) do (
    call :CHECK_WHEEL "%%A"
)

echo.
echo 导出完成！请将 "%OFFLINE_DIR%" 复制到离线环境使用。 
pause
exit /b

:: -------------------------------
:CHECK_WHEEL
setlocal enabledelayedexpansion
set "NAME=%~1"
for /f "tokens=1 delims== " %%B in ("%NAME%") do set "PKGNAME=%%B"

set "FOUND=0"
for %%W in ("%OFFLINE_DIR%\*.whl") do (
    set "FILE=%%~nxW"
    call :MATCH_PARTIAL "!FILE!" "!PKGNAME!" FOUND
    if "!FOUND!"=="1" goto :FOUND
)
if "%FOUND%"=="0" echo 警告：未找到 wheel 文件 - %PKGNAME%
:FOUND
endlocal
goto :eof

:: ------------------------------------- 
:: 内部子函数 - 部分匹配字符串 
:: 参数1 = 文件名, 参数2 = 关键字, 参数3 = 返回变量名 
:MATCH_PARTIAL
setlocal enabledelayedexpansion
set "TEXT=!1!"
set "KEY=!2!"
set "RESULT=0"
if /i not "!TEXT:%KEY%=!"=="!TEXT!" set "RESULT=1"
endlocal & set "%~3=%RESULT%"
goto :eof

:CHECK_PATH
if not exist "%PYTHON_EXE%" (
    echo 找不到 Python: %PYTHON_EXE%
    pause
    exit /b
)

if not exist "%OFFLINE_DIR%" (
    echo 找不到离线包目录: %OFFLINE_DIR%
    pause
    exit /b
)

if not exist "%REQ_FILE%" (
    echo 找不到 requirements.txt: %REQ_FILE%
    pause
    exit /b
)
goto :eof
:OFFLINE_INNER
call :CHECK_PATH

"%PYTHON_EXE%" -m pip install pip --no-index --find-links=%BASE_DIR%  --force-reinstall --no-warn-script-location
"%PYTHON_EXE%" -m pip install --no-index --find-links="%OFFLINE_DIR%" -r "%REQ_FILE%" --force-reinstall --no-warn-script-location
goto :eof

:: -------------------------------
:OFFLINE
echo ============================ 
echo 离线恢复安装 
echo ============================ 
call :OFFLINE_INNER
echo.
echo 离线恢复安装完成！ 
pause
exit /b


:: -------------------------------
:OFFLINE_EXE
echo ============================ 
echo 离线修复损坏的 exe 工具（修改路径后需要）
echo ============================ 

call :CHECK_PATH

"%PYTHON_EXE%" -m pip install pip --no-index --find-links=%BASE_DIR% --force-reinstall --no-warn-script-location
for /f "tokens=*" %%A in (%REQ_FILE%) do (
    set "PKG=%%A"
    call :FIX_EXE_IF_MISSING_OR_OLD_PATH "%%A"
)

echo.
echo 精准快速修复完成！Scripts 下损坏的 exe 工具已更新。 
pause
exit /b

:: -------------------------------
:FIX_EXE_IF_MISSING_OR_OLD_PATH
setlocal
set "NAME=%~1"
for /f "tokens=1 delims== " %%B in ("%NAME%") do set "PKGNAME=%%B"
set "EXE_FILE=%SCRIPTS_DIR%\%PKGNAME%.exe"

:: 判断 exe 是否存在
if not exist "%EXE_FILE%" (
    echo 跳过: %PKGNAME%
    rem echo 修复缺失的工具: %PKGNAME%
    rem "%PYTHON_EXE%" -m pip install --no-index --find-links="%OFFLINE_DIR%" --force-reinstall "%PKGNAME%" --no-warn-script-location
    endlocal
    goto :eof
)

:: 判断 exe 是否绑定旧 Python 路径（精准检测）
set "BROKEN=0"

:: 搜索当前 Python 路径
findstr /i /c:"%PYTHON_EXE%" "%EXE_FILE%" >nul
if errorlevel 1 set "BROKEN=1"


if "%BROKEN%"=="1" (
    echo 修复损坏的工具: %PKGNAME%
    "%PYTHON_EXE%" -m pip install --no-index --find-links="%OFFLINE_DIR%" --force-reinstall "%PKGNAME%" --no-warn-script-location
)

endlocal
goto :eof

:INSTALL
echo 正在添加环境变量... 
reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH >tmp.txt 2>nul
for /f "tokens=3*" %%a in ('findstr /i "PATH" tmp.txt') do set "OLD_PATH=%%a %%b"
del tmp.txt

echo !OLD_PATH! | find /i "!CUR_DIR!" >nul
if not errorlevel 1 goto :OFFLINE

set "NEW_PATH=!OLD_PATH!;!CUR_DIR!;!SCRIPTS_DIR!"
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH /t REG_EXPAND_SZ /d "!NEW_PATH!" /f >nul
echo 已添加至 PATH。 

:: 添加环境变量完成后刷新环境设置 
echo 正在刷新环境变量...  
powershell -Command "$envVar='Environment';Add-Type -Namespace Win32 -Name NativeMethods -MemberDefinition '[[\"user32.dll\",SetLastError=true,CharSet=CharSet.Unicode)]public static extern IntPtr SendMessageTimeout(IntPtr hWnd,uint Msg,IntPtr wParam,string lParam,uint fuFlags,uint uTimeout,out IntPtr lpdwResult);';$null=[Win32.NativeMethods]::SendMessageTimeout([intptr]0xffff,0x1A,[intptr]::Zero,$envVar,0,1000,[ref]([intptr]::Zero|DllImport(\"user32.dll\",SetLastError=true,CharSet=CharSet.Unicode)]])"

call :OFFLINE_INNER
goto :DONE

:UNINSTALL
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
        echo !item! | find /i "!SCRIPTS_DIR!" >nul
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
powershell -Command "$envVar='Environment';Add-Type -Namespace Win32 -Name NativeMethods -MemberDefinition '[[\"user32.dll\",SetLastError=true,CharSet=CharSet.Unicode)]public static extern IntPtr SendMessageTimeout(IntPtr hWnd,uint Msg,IntPtr wParam,string lParam,uint fuFlags,uint uTimeout,out IntPtr lpdwResult);';$null=[Win32.NativeMethods]::SendMessageTimeout([intptr]0xffff,0x1A,[intptr]::Zero,$envVar,0,1000,[ref]([intptr]::Zero|DllImport(\"user32.dll\",SetLastError=true,CharSet=CharSet.Unicode)]])"


goto :DONE

:DONE
echo. 
echo 操作完成，建议注销或重启后生效。 
pause
goto :END

:END
exit /b
```

将该文件夹复制到新的系统中后，执行此脚本进行绿化即可。
## 临时运行脚本
不添加环境变量，临时在控制台使用，可运行如下脚本：
### cmd版
```shell title="启动python3环境(cmd).bat"
@echo off
:: 切换到 UTF-8 代码页（可选）
chcp 65001>nul
:: 定义要添加到 PATH 的子目录（可改成 bin、tools 等）
set "TARGET_DIR=Scripts"
set PYTHONUTF8=1
:: 获取脚本所在目录
set "SCRIPT_DIR=%~dp0"
:: 添加 run 子目录到临时 PATH
set "PATH=%SCRIPT_DIR%;%SCRIPT_DIR%%TARGET_DIR%;%PATH%"
echo 已将 "%SCRIPT_DIR%%TARGET_DIR%" 添加到临时 PATH。
echo.
:: 保持终端窗口不关闭
cmd /k
```
### PowerShell版
```powershell title="启动python3环境(powershell).bat"
@echo off
:: 定义要添加到 PATH 的子目录（可改成 bin、tools 等）
set "TARGET_DIR=Scripts"
:: 获取脚本所在目录
set "SCRIPT_DIR=%~dp0"
:: 启动 PowerShell 窗口，并保持运行
start powershell -NoExit -Command ^
  "$env:Path = '%SCRIPT_DIR%;%SCRIPT_DIR%%TARGET_DIR%;' + $env:Path; " ^
  "$env:PYTHONUTF8 = "1";" ^
  "Write-Host '已将 %SCRIPT_DIR%%TARGET_DIR% 添加到临时 PATH。'  -ForegroundColor Green;" ^
  "Set-Location '%SCRIPT_DIR%'"
```


## 参考文档
- [好学编程：PythonWin7打破壁垒，在Windows 7上安装Python 3.13版本的终极解决方案](https://zhuanlan.zhihu.com/p/24700697441)
- [在windows内离线部署python-免安装版及离线安装第三方库 - 一个萝卜 - 博客园](https://www.cnblogs.com/derek-h/p/14849519.html)
- [4. Python 绿色版及其依赖包的离线安装 — 尤金的一己之见 alpha 文档](https://studynotes.readthedocs.io/zh/main/k-python/offLine.html)
