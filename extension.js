const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * @param {{ subscriptions: vscode.Disposable[]; }} context
 */
function activate(context) {
    console.log('Congratulations, your extension "tmscode" is now active!');

    let disposable = vscode.commands.registerCommand('tmscode.createReactComponent', () => {
        const folderName = 'fileJson';
        const folderPath = path.join(vscode.workspace.rootPath, folderName);

        // Vérifier si le dossier existe
        fs.access(folderPath, fs.constants.F_OK, (err) => {
            if (err) {
                vscode.window.showErrorMessage('Folder does not exist!');
            } else {
                // Lire les fichiers JSON dans le dossier
                fs.readdir(folderPath, (err, files) => {
                    if (err) {
                        vscode.window.showErrorMessage('Failed to read folder: ' + err.message);
                    } else {
                        // Filtrer les fichiers pour ne garder que les fichiers JSON
                        const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');

                        // Options du menu QuickPick
                        const options = jsonFiles.map(file => ({ label: file, description: 'Open JSON file' }));
                        options.push({ label: 'Create new JSON file', description: 'Create a new JSON file' });

                        // Afficher les fichiers JSON dans une QuickPick pour sélectionner
                        vscode.window.showQuickPick(options, {
                            placeHolder: 'Select a JSON file or create a new one',
                            canPickMany: false
                        }).then(selected => {
                            if (selected) {
                                if (selected.label === 'Create new JSON file') {
                                    createNewJsonFile();
                                } else {
                                    vscode.window.showInformationMessage('You selected: ' + selected.label);
                                    // Ici vous pouvez implémenter la logique pour ouvrir le fichier JSON sélectionné
                                }
                            }
                        });
                    }
                });
            }
        });
    });

    context.subscriptions.push(disposable);
}

function createNewJsonFile() {
    // Demander à l'utilisateur d'entrer les données JSON
    vscode.window.showInputBox({
        prompt: "Enter JSON data"
    }).then(jsonData => {
        if (!jsonData) return;

        // Valider si les données JSON sont valides
        try {
            JSON.parse(jsonData);
        } catch (error) {
            vscode.window.showErrorMessage('Invalid JSON data: ' + error.message);
            return;
        }

        // Demander à l'utilisateur de saisir le nom du fichier JSON
        vscode.window.showInputBox({
            prompt: "Enter JSON file name"
        }).then(fileName => {
            if (!fileName) return;

            const folderName = 'fileJson';
            const folderPath = path.join(vscode.workspace.rootPath, folderName);

            // Vérifier si le dossier existe
            fs.access(folderPath, fs.constants.F_OK, (err) => {
                if (err) {
                    vscode.window.showErrorMessage('Folder does not exist!');
                } else {
                    const filePath = path.join(folderPath, fileName + '.json');

                    // Créer le fichier JSON
                    fs.writeFile(filePath, jsonData, (err) => {
                        if (err) {
                            vscode.window.showErrorMessage('Failed to create JSON file: ' + err.message);
                        } else {
                            vscode.window.showInformationMessage('JSON file created successfully!');
                        }
                    });
                }
            });
        });
    });
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
