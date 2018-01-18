'use strict';

import vscode = require('vscode');

export class WitcherScriptSignatureHelpProvider implements vscode.SignatureHelpProvider {
    private workspaceConfiguration = null;

    constructor(workspaceConfiguration?: vscode.WorkspaceConfiguration) {
        this.workspaceConfiguration = workspaceConfiguration;
    }

    public provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SignatureHelp> {
        throw new Error("Method not implemented.");
    }
}