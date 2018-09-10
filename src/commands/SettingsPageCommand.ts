import { Configuration } from "../components/Configuration";
import * as vscode from 'vscode';
import * as path from 'path';
import { ContentPreview } from "../components/ContentPreview";
import { Pages } from "../constants";

export class SettingsPageCommand implements Command {
    constructor(private contentPreview: ContentPreview, private configuration: Configuration) {
    }

    execute() {
        let model = {
            gamePath: this.configuration.GamePath,
            modKitPath: this.configuration.ModKitPath,
            scriptMergerPath: this.configuration.ScriptMergerPath,
            uncookedBasePath: this.configuration.UncookedBasePath
        };

        this.contentPreview.show(Pages.Settings, model, message => {
            if (message.command == 'select-folder' && message.arguments[0]) {
                vscode.window.showOpenDialog({
                    canSelectFiles: false,
                    canSelectFolders: true,
                    canSelectMany: false
                }).then(selections => {
                    if (selections[0]) {
                        this.configuration.update(message.arguments[0], selections[0].fsPath);

                        this.contentPreview.post({
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
}