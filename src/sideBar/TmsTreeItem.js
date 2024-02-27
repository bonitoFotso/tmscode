const vscode = require('vscode');

class TmsTreeItem extends vscode.TreeItem {
    /**
     * @param {string | vscode.TreeItemLabel} label
     * @param {vscode.TreeItemCollapsibleState} collapsibleState
     * @param {any} command
     */
    constructor(label, collapsibleState, command) {
        super(label, collapsibleState);
        this.command = command;
    }
}

module.exports = TmsTreeItem;
