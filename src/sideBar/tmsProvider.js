const vscode = require('vscode');
const fs = require('fs');
// const path = require('path');

class TmsProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    /**
     * @param {any} element
     */
    getTreeItem(element) {
        return element;
    }

    /**
     * @param {any} element
     */
    async getChildren(element) {
        // Récupérer les données à afficher dans la vue
        const directoryPath = vscode.workspace.rootPath;
        const files = await this.getFilesInDirectory(directoryPath);
        console.log(element);

        // Convertir les noms de fichiers en éléments d'arbre
        return files.map((/** @type {string | vscode.TreeItemLabel} */ file) => new vscode.TreeItem(file));
    }

    /**
     * @param {fs.PathLike} directoryPath
     */
    async getFilesInDirectory(directoryPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    }
}

module.exports = { TmsProvider };
