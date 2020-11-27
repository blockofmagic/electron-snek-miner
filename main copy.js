// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");

//> Services
const IPFS = require("ipfs-core");
const web3 = require("./services/web3.js");
const storehash = require("./services/storehash.js");
// Miner Service
const ethminer = require("./services/ether.js");
const intelgen = require("./services/intelgen.js");
const fs = require("fs");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

async function main() {
  const node = await IPFS.create();
  const version = await node.version();

  console.log("[IPFS Version] ===>", version.version);

  const accounts = await web3.eth.getAccounts();

  ethminer.initMiner();

  while (true) {
    const res = await intelgen.fetchProfile().next();

    console.info("[Minded data] ===>", res);
    const { personName, content } = res.value;
    const fileName = `snek_person_${personName}.json`;

    const fileAdded = await node.add({
      path: fileName,
      content,
    });

    console.info("[Added file] ===>", fileAdded.path, fileAdded.cid);

    const transactionHash = fileAdded.cid.toString();

    fs.appendFile(
      "ipfs.cid.log",
      `[${Date.now()}] ${transactionHash}\n`,
      function (err) {
        if (err) throw err;
      }
    );

    storehash.methods.sendHash(transactionHash).send(
      {
        from: accounts[0],
      },
      (error, transactionHash) => {
        console.log("[ETH transaction probably succeeded!]");
      }
    ); //storehash
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  main();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
