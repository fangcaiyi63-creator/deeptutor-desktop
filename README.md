# DeepTutor Desktop

非官方的 [DeepTutor](https://github.com/HKUDS/DeepTutor) Windows 桌面壳。用 Electron 把本地运行的 DeepTutor Web 界面包成独立桌面应用：双击启动、自动拉起后台服务、关窗口自动停服务、独立任务栏图标。

> Unofficial Windows desktop shell for DeepTutor (HKUDS). Electron wrapper that auto-starts the local DeepTutor service, opens it in a standalone window, and stops the service when the window closes.

## 它是什么 / What it is

DeepTutor 官方只提供 PyPI / Docker / 源码三种形态（本地 Web 应用，跑在 127.0.0.1）。本仓库只是给它加了一个 **Electron 桌面壳**——不修改、不重打包 DeepTutor 本身的任何代码，界面完全来自官方 `deeptutor` 包。

This repo adds **only an Electron shell**. It does not modify or repackage DeepTutor itself; the UI is entirely the official `deeptutor` package served locally.

## 使用方法 / Usage

### 前置要求 / Prerequisites

- Windows 10/11 x64
- Python 3.11–3.14（用于安装 DeepTutor 本体）
- Node.js 20+（DeepTutor 前端需要）

### 安装 / Install

1. 安装 DeepTutor 本体（官方 PyPI 包）：

```bash
pip install "deeptutor[full]"
```

2. 下载本仓库 Release 里的 `DeepTutor-win32-x64.zip`，解压到任意位置，双击 `DeepTutor.exe`。

3. 首次启动会自动检测 `http://localhost:3782`：
   - 服务没在跑 → 自动执行 `deeptutor start`（工作目录默认 `C:\Users\<你>\Desktop\DeepTutor`，可用环境变量 `DEEPTUTOR_APP_DIR` 指定其他目录）
   - 等待服务就绪（最长 90 秒）后打开独立窗口

4. 关闭窗口 = 自动停止后台服务（8001/3782 端口进程）。

### 或者自己打包 / Build from source

```bash
git clone https://github.com/fangcaiyi63-creator/deeptutor-desktop.git
cd deeptutor-desktop
npm install --save-dev electron@33 electron-packager
npx electron-packager . DeepTutor --platform=win32 --arch=x64 \
  --icon=app-multi.ico --out=dist --overwrite --electron-version=33.4.11
```

> `--icon` 时如果 rcedit 报 `Unable to commit changes`，先不带 `--icon` 打包，成功后单独执行 rcedit 写图标。

## 快捷键 / Shortcuts

与标准 Electron shell 一致：`Ctrl+R` 刷新、`Ctrl+W` 关窗口、`Ctrl +/-` 缩放、`Ctrl+Shift+I` 开发者工具。

## 许可 / License

- 本仓库的壳代码：Apache-2.0（与 DeepTutor 一致）
- DeepTutor 本体版权归 [HKUDS](https://github.com/HKUDS) 所有，遵循其 Apache-2.0 许可证
- DeepTutor logo 版权归 HKUDS，本仓库仅作识别用途使用

## 免责声明 / Disclaimer

本项目与 HKUDS / DeepTutor 官方无关联。遇到 DeepTutor 本身的问题请到[官方仓库](https://github.com/HKUDS/DeepTutor)反馈。
