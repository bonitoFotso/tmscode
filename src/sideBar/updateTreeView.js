const vscode = require('vscode');

let treeView;

function updateTreeView(componentData) {
    if (!treeView) {
        treeView = vscode.window.createTreeView('componentStructure', {
            treeDataProvider: {
                getChildren: () => componentData ? componentData.children : [],
                getParent: () => null,
                getTreeItem: (element) => {
                    return {
                        label: element.name,
                        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed
                    };
                }
            }
        });
    } else {
        treeView.title = 'Component Structure';
        treeView.reveal(componentData, { select: false, focus: true });
        treeView.message = componentData ? '' : 'Component structure is empty';
    }
}

module.exports = {
    updateTreeView
}