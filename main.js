const { app, BrowserWindow, shell, Menu, dialog } = require('electron');
const { spawn, execSync } = require('child_process');
const http = require('http');
const path = require('path');

// DeepTutor 数据目录（deeptutor start 的工作目录）。
// 可用环境变量 DEEPTUTOR_APP_DIR 覆盖；默认桌面上的 DeepTutor 文件夹。
const APP_DIR = process.env.DEEPTUTOR_APP_DIR || 'C:\\Users\\杨\\Desktop\\DeepTutor';
const FRONTEND = 'http://localhost:3782';
let serverProc = null;
let win = null;
const ICON_PATH = path.join(__dirname, 'app-multi.ico');

// 让 Windows 任务栏显示独立图标而不是默认的 Electron 图标
if (process.platform === 'win32') {
  app.setAppUserModelId('info.deeptutor.desktop');
}

function checkFrontend() {
  return new Promise((resolve) => {
    const req = http.get(FRONTEND, { timeout: 2000 }, (res) => { res.resume(); resolve(true); });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function waitForService(maxMs = 90000) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    if (await checkFrontend()) return true;
    await new Promise(r => setTimeout(r, 1500));
  }
  return false;
}

function startServer() {
  serverProc = spawn('cmd.exe', ['/c', 'deeptutor', 'start'], {
    cwd: APP_DIR,
    windowsHide: true,
    stdio: 'ignore',
    detached: false,
  });
  serverProc.on('error', () => { serverProc = null; });
}

function stopServer() {
  try {
    execSync(
      'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8001,3782 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"',
      { windowsHide: true, timeout: 15000, stdio: 'ignore' }
    );
  } catch (_) {}
}

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1000,
    minHeight: 640,
    title: 'DeepTutor',
    icon: ICON_PATH,
    autoHideMenuBar: true,
    backgroundColor: '#0d0d0d',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(FRONTEND);

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://localhost:3782')) return { action: 'allow' };
    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.on('closed', () => { win = null; });
}

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  const running = await checkFrontend();
  if (!running) {
    startServer();
    const ok = await waitForService();
    if (!ok) {
      dialog.showErrorBox('DeepTutor', '服务启动超时（90 秒）。\n\n请先确认 deeptutor 已安装（pip install "deeptutor[full]"），并手动运行 deeptutor start 验证服务可用，再打开本应用。');
      app.quit();
      return;
    }
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (serverProc) stopServer();
  app.quit();
});

app.on('before-quit', () => { if (serverProc) stopServer(); });
