module.exports = (serverStart,serverStop) => {
    const { app: electron, BrowserWindow, ipcMain } = require('electron');

    const createWindow = () => {
        // Create the browser window.
        const win = new BrowserWindow({
            width: 300,
            height: 175,
            webPreferences: {
                nodeIntegration: true
            }
        })
        win.on("test", (data) => {
            win.setOpacity(.5);
            console.log(win.getPosition());
            console.log(data);
        })

        // and load the index.html of the app.
        win.loadFile('./form/form.html')

        //events      
        ipcMain.on('start', (e) => {
            console.log("server start");
            serverStart()
            e.returnValue = "ok";
        });
        
        ipcMain.on('stop', (e) => {            
            console.log("server Stop");
            serverStop();
            e.returnValue = "ok";
        });
    }


    electron.whenReady().then(createWindow)
}