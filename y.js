const vscode = require('vscode');
const path = require('path');

const { saveJsonFile } = require('./src/file');
const { askQuestions } = require('./src/questions');
const { getWebviewContent } = require('./src/sideBar/getWebviewContent');
const TmsProvider = require('./src/sideBar/tmsProvider');

/**
 * @param {{ subscriptions: vscode.Disposable[]; extensionPath: string; }} context
 */
function activate(context) {

	const tmsProvider = new TmsProvider();
    vscode.window.registerTreeDataProvider('tmscode-A', tmsProvider);

    // Command to refresh the tree view
    vscode.commands.registerCommand('extension.refreshTmsView', () => {
        tmsProvider.refresh();
    });

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('explorer', {
            resolveWebviewView(webviewView) {
                webviewView.webview.options = {
                    enableScripts: true,
                    localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'view'))]
                };

                webviewView.webview.html = getWebviewContent(context.extensionPath);
            }
        })
    );

    console.log('Congratulations, your extension "tmscode" is now active!');

    let disposable = vscode.commands.registerCommand('tmscode.createJsonFile', () => {
        vscode.window.showInputBox({
            prompt: "Enter the component name"
        }).then(componentName => {
            if (!componentName) return;

            let componentData = {
                type: "folder",
                name: componentName,
                children: []
            };

            askQuestions(componentData).then(() => {
                const jsonContent = JSON.stringify(componentData, null, 2);
                saveJsonFile(componentName, jsonContent);
            });
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
