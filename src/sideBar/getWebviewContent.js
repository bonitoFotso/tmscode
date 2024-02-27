const fs = require('fs');
const path = require('path');

/**
 * @param {string} extensionPath
 */
function getWebviewContent(extensionPath) {
    const htmlPath = path.join(extensionPath, 'view', 'index.html');
    return fs.readFileSync(htmlPath, 'utf8');
}

module.exports = {
    getWebviewContent
};