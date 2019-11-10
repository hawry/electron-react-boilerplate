const electron = require("electron")
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const isDev = require("electron-is-dev")
const path = require("path")
const windowStateKeeper = require("electron-window-state")
const settings = require("electron-settings")

if (isDev) {
  require("electron-reload")
}

let mainWindow

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  })
  mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y
  })
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  )

  if (!settings.has("home.dir")) {
    settings.set("home", { dir: app.getPath("userData") })
  }

  mainWindow.on("closed", () => {
    mainWindow = null
  })
  mainWindowState.manage(mainWindow)
}

app.on("ready", createWindow)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})
