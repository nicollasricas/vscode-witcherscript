import { Configuration } from "../components/Configuration";
import { contentPreview } from "../components/ContentPreview";
import * as vscode from 'vscode';
import * as path from 'path';

export function showSettingsPage(configuration: Configuration) {
    let settings = {
        gamePath: configuration.GamePath,
        modKitPath: configuration.ModKitPath,
        scriptMergerPath: configuration.ScriptMergerPath,
        uncookedBasePath: configuration.UncookedBasePath
    };

    contentPreview.show('settings-page', settings, (message) => {
        if (message.command == 'select-folder' && message.arguments[0]) {
            vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false
            }).then(selections => {
                if (selections[0]) {
                    configuration.update(message.arguments[0], selections[0].fsPath);

                    contentPreview.post({
                        command: 'update-folder-input',
                        arguments: [
                            message.arguments[0],
                            path.normalize(selections[0].fsPath)
                        ]
                    });
                }
            });
        }
    });
}