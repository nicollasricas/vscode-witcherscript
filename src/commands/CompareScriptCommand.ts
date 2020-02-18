import * as path from "path";
import * as vscode from "vscode";
import * as fse from "fs-extra";
import { Configuration } from "../components/Configuration";
import { Commands, Strings } from "../constants";

export class CompareScriptCommand implements Command {
    constructor(private configuration: Configuration, private uri: vscode.Uri) {}

    execute() {
        if (!vscode.workspace.workspaceFolders) {
            return;
        }

        let workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

        if (!fse.pathExistsSync(path.join(workspacePath, "content", "scripts"))) {
            return;
        }

        let gamePath = this.configuration.GamePath;

        if (!gamePath) {
            vscode.window.showInformationMessage(Strings.GamePathIsRequired);

            vscode.commands.executeCommand(Commands.ShowSettingsPage);

            return;
        }

        let originalScriptPath = this.uri.fsPath.replace(
            path.join(workspacePath, "content"),
            path.join(gamePath, "content/content0")
        );

        if (!fse.pathExistsSync(originalScriptPath)) {
            return;
        }

        vscode.commands.executeCommand(
            "vscode.diff",
            vscode.Uri.file(this.uri.fsPath),
            vscode.Uri.file(originalScriptPath),
            `Diff ${path.basename(this.uri.fsPath)} (Head/Original)`,
            {}
        );
    }
}
