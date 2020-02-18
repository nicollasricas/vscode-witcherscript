import * as vscode from "vscode";
import { Configuration } from "../components/Configuration";
import { Commands, Strings } from "../constants";
import * as path from "path";
import * as fs from "fs";
import * as fse from "fs-extra";

export class ImportContentCommand implements Command {
    constructor(private configuration: Configuration, private uri: vscode.Uri) {}

    execute() {
        var workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

        var uncookedBasePath = this.configuration.UncookedBasePath;

        if (!uncookedBasePath) {
            vscode.window.showInformationMessage(Strings.UncookedBasePathIsRequired);

            vscode.commands.executeCommand(Commands.ShowSettingsPage);

            return;
        }

        var packageContentPath = path.join(workspacePath, "content");

        var pathToListContentFiles = uncookedBasePath;

        if (this.uri.fsPath.startsWith(packageContentPath)) {
            if (fs.statSync(this.uri.fsPath).isDirectory()) {
                pathToListContentFiles = (this.uri.fsPath + "/").replace(packageContentPath, uncookedBasePath);
            } else {
                pathToListContentFiles = path
                    .dirname(this.uri.fsPath + "/")
                    .replace(packageContentPath, path.dirname(uncookedBasePath));
            }
        }

        const listContentFiles = (dir, files = []) => {
            fs.readdirSync(dir).map(file => {
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    listContentFiles(path.join(dir, file), files);
                } else {
                    files.push(
                        path
                            .join(dir, file)
                            .replace(uncookedBasePath, "")
                            .substring(1)
                            .replace(/\\/gi, "/")
                    );
                }
            });

            return files;
        };

        vscode.window
            .showQuickPick(listContentFiles(pathToListContentFiles), {
                placeHolder: "Select the content file to import"
            })
            .then(selectedItem => {
                const copyFile = targetFile => {
                    try {
                        var copyDirectory = path.dirname(targetFile);

                        fse.ensureDirSync(copyDirectory);

                        if (!fs.existsSync(copyDirectory)) {
                            fs.mkdirSync(copyDirectory);
                        }

                        fs.writeFileSync(targetFile, fs.readFileSync(path.join(uncookedBasePath, selectedItem)));

                        if ([".csv", ".xml", ".txt"].indexOf(path.extname(targetFile)) > -1) {
                            vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.parse(targetFile), false);
                        }
                    } catch {}
                };

                var targetFile = path.join(packageContentPath, selectedItem);

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
