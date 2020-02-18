import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as fse from "fs-extra";
import { Commands, Strings } from "../constants";
import { Configuration } from "../components/Configuration";

export class ImportScriptCommand implements Command {
    constructor(private configuration: Configuration, private uri: vscode.Uri) {}

    execute() {
        let workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

        let gamePath = this.configuration.GamePath;

        if (!gamePath) {
            vscode.window.showInformationMessage(Strings.GamePathIsRequired);

            vscode.commands.executeCommand(Commands.ShowSettingsPage);

            return;
        }

        let packageScriptsPath = path.join(workspacePath, "content", "scripts");

        if (!fse.pathExistsSync(packageScriptsPath)) {
            return;
        }

        let dirToListScripts = "";

        let baseScriptsPath = path.join(gamePath, "content", "content0", "scripts", "game");

        dirToListScripts = baseScriptsPath;

        if (this.uri.fsPath.startsWith(packageScriptsPath)) {
            if (fs.statSync(this.uri.fsPath).isDirectory()) {
                dirToListScripts = (this.uri.fsPath + "/").replace(packageScriptsPath, path.dirname(baseScriptsPath));
            } else {
                dirToListScripts = path
                    .dirname(this.uri.fsPath + "/")
                    .replace(packageScriptsPath, path.dirname(baseScriptsPath));
            }
        }

        const listScripts = (dir, files = []) => {
            fs.readdirSync(dir).map(file => {
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    listScripts(path.join(dir, file), files);
                } else {
                    files.push(
                        path
                            .join(dir, file)
                            .replace(baseScriptsPath, "")
                            .substring(1)
                            .replace(/\\/gi, "/")
                    );
                }
            });

            return files;
        };

        vscode.window
            .showQuickPick(listScripts(dirToListScripts), {
                placeHolder: "Select the script to import"
            })
            .then(selectedItem => {
                const copyFile = targetFile => {
                    try {
                        var copyDirectory = path.dirname(targetFile);

                        fse.ensureDirSync(copyDirectory);

                        fs.writeFileSync(targetFile, fs.readFileSync(path.join(baseScriptsPath, selectedItem)));

                        vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.parse(targetFile), false);
                    } catch {}
                };

                var targetFile = path.join(packageScriptsPath, "game", selectedItem);

                if (fs.existsSync(targetFile)) {
                    vscode.window.showInformationMessage(Strings.FileAlreadyExists, "Yes", "No").then(sel => {
                        if (sel == "Yes") {
                            copyFile(targetFile);
                        }
                    });
                } else {
                    copyFile(targetFile);
                }
            });
    }
}
