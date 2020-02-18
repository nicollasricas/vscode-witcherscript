import * as vscode from "vscode";
import { Commands, Strings } from "../constants";
import { Configuration } from "../components/Configuration";
import { WitcherScriptWrapper } from "../components/WitcherScriptWrapper";

export class CookCommand implements Command {
    constructor(private configuration: Configuration, private wsc: WitcherScriptWrapper) {}

    execute() {
        if (!vscode.workspace.workspaceFolders) {
            vscode.window.showInformationMessage(Strings.WorkspaceFolderRequired, "Open").then(x => {
                if (x) {
                    vscode.commands.executeCommand("workbench.action.files.openFolder");
                }
            });

            return;
        }

        let workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

        let gamePath = this.configuration.GamePath;

        let modKitPath = this.configuration.ModKitPath;

        let scriptMergerPath = this.configuration.ScriptMergerPath;

        this.wsc.cook(gamePath, modKitPath, workspacePath, scriptMergerPath).then(cookedPath => {
            if (cookedPath) {
                vscode.window.showInformationMessage(Strings.PackageCooked);
            } else {
                vscode.window.showInformationMessage(Strings.PackageCooked, Strings.LaunchGame).then(cmd => {
                    if (cmd) {
                        vscode.commands.executeCommand(Commands.LaunchGame);
                    }
                });
            }
        });
    }
}
