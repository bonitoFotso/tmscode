const { updateTreeView } = require('./sideBar/updateTreeView');

const vscode = require('vscode');


/**
 * @param {{ type: string; name: string; children: any[]; }} componentData
 */
async function askQuestions(componentData) {
    updateTreeView(componentData);

    return new Promise((resolve) => {
        vscode.window.showQuickPick(
            ['Single file', 'Multiple files'],
            { placeHolder: 'Select whether it\'s a single file or multiple files' }
        ).then(selection => {
            if (!selection) {
                resolve();
                return;
            }

            if (selection === 'Single file') {
                askFileName(componentData).then(() => resolve());
            } else {
                askFolderStructure(componentData).then(() => resolve());
            }
        });
    });
}


/**
 * @param {{ type?: string; name?: string; children: any; }} parent
 */
function askFileName(parent) {
    return new Promise((resolve) => {
        vscode.window.showInputBox({
            prompt: "Enter the file name"
        }).then(fileName => {
            if (!fileName) {
                resolve();
                return;
            }

            parent.children.push({
                type: "file",
                name: fileName,
                content: ""
            });

            askIfContinue().then(continueFlag => {
                if (continueFlag) {
                    askFileName(parent).then(() => resolve());
                } else {
                    resolve();
                }
            });
        });
    });
}

/**
 * @param {{ children: { type: string; name: string; children: any[]; }[]; }} parent
 */
function askFolderStructure(parent) {
    return new Promise((resolve) => {
        vscode.window.showInputBox({
            prompt: "Enter the folder name"
        }).then(folderName => {
            if (!folderName) {
                resolve();
                return;
            }

            let folder = {
                type: "folder",
                name: folderName,
                children: []
            };

            parent.children.push(folder);

            askIfContinue().then(continueFlag => {
                if (continueFlag) {
                    askSubFolderStructure(folder).then(() => resolve());
                } else {
                    askFileName(folder).then(() => resolve());
                }
            });
        });
    });
}

/**
 * @param {{ type?: string; name?: string; children: any; }} parent
 */
function askSubFolderStructure(parent) {
    return new Promise((resolve) => {
        vscode.window.showInputBox({
            prompt: "Enter the subfolder name"
        }).then(subfolderName => {
            if (!subfolderName) {
                resolve();
                return;
            }

            let subfolder = {
                type: "folder",
                name: subfolderName,
                children: []
            };

            parent.children.push(subfolder);

            askIfContinue().then(continueFlag => {
                if (continueFlag) {
                    askSubFolderStructure(subfolder).then(() => resolve());
                } else {
                    askFileName(subfolder).then(() => resolve());
                }
            });
        });
    });
}

async function askIfContinue() {
    const selection = await vscode.window.showQuickPick(
		['Yes', 'No'],
		{ placeHolder: 'Continue adding files/folders?' }
	);
	return selection === 'Yes';
}

module.exports = {
    askQuestions
};