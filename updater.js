const { dialog } = require("electron")
const { autoUpdater } = require("electron-updater")

// Configure log debugging
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"

// Disable auto downloading of updates
autoUpdater.autoDownload = false

// Single export to check for updates and register update events
module.exports = () => {

    // Check for updates (GH Releases)
    autoUpdater.checkForUpdates()

    // Listen for update found
    autoUpdater.on('update-available', () => {

        //Prompt user to start download
        dialog.showMessageBox({
            type: "info",
            title: "Update Available",
            message: "A new version of Readit is available. Do you want to update now?",
            buttons: ["Update", "No"]
        }).then( result => {
            let buttonIndex = result.response
            
            // If button 0 (Update), start downloading the update
            if (buttonIndex === 0) autoUpdater.downloadUpdate()
        })
    })

    // Listen for update downloaded
    autoUpdater.on('update-downloaded', () => {

        // Prompt user to install update
        dialog.showMessageBox({
            type: "info",
            title: "Update Ready",
            message: "Install and restart now?",
            buttons: ["Yes", "Later"]
        }).then( result => {
            let buttonIndex = result.response
            
            // Install and restart if button 0 (Yes)
            if (buttonIndex === 0) autoUpdater.quitAndInstall(false, true)
        })
    })
}
