const vscode = require('vscode');
const { TmsProvider } = require('./src/sideBar/tmsProvider');

let tmsProvider;

/**
 * @param {{ subscriptions: vscode.Disposable[]; }} context
 */
function activate(context) {
    // Créer une instance du fournisseur de données
    tmsProvider = new TmsProvider();
    
    // Enregistrer le fournisseur de données pour la vue
    vscode.window.registerTreeDataProvider('tmscode_view', tmsProvider);

    // Enregistrer la commande pour afficher les fichiers dans la vue
    context.subscriptions.push(vscode.commands.registerCommand('extension.listFilesInView', () => {
        tmsProvider.refresh();
    }));
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};