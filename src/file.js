const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

/**
 * @param {string} componentName
 * @param {string | NodeJS.ArrayBufferView} jsonContent
 */
function saveJsonFile(componentName, jsonContent) {
    const folderName = 'fileJson';
    const folderPath = path.join(vscode.workspace.rootPath, folderName);
    fs.access(folderPath, fs.constants.F_OK, (err) => {
        if (err) {
            vscode.window.showErrorMessage('Folder does not exist!');
        } else {
            const filePath = path.join(folderPath, componentName + '.json');
            fs.writeFile(filePath, jsonContent, (err) => {
                if (err) {
                    vscode.window.showErrorMessage('Failed to create JSON file: ' + err.message);
                } else {
                    vscode.window.showInformationMessage('JSON file created successfully!');
                }
            });
        }
    });
}

module.exports = {
    saveJsonFile
};
