import * as vscode from 'vscode';
import * as path from 'path';

// test implementation of tree view, it may be used by debugging mods...
export class CommandTreeView implements vscode.TreeDataProvider<CommandTreeViewItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CommandTreeViewItem> = new vscode.EventEmitter<CommandTreeViewItem>();

    readonly onDidChangeTreeData: vscode.Event<CommandTreeViewItem> = this._onDidChangeTreeData.event;

    getTreeItem(element: CommandTreeViewItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: CommandTreeViewItem): vscode.ProviderResult<CommandTreeViewItem[]> {
        return new Promise(resolve => {
            let cms: CommandTreeViewItem[] = [];

            cms.push(new CommandTreeViewItem('Cook'));
            cms.push(new CommandTreeViewItem('Uncook'));

            resolve(cms);
        });
    }
}

class CommandTreeViewItem extends vscode.TreeItem {
    constructor(label: string) {
        super(label, vscode.TreeItemCollapsibleState.None);
    }

    contextValue = 'ws.command';
}