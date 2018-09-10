import * as utils from '../utils';
import * as vscode from 'vscode';
import { Configuration } from '../components/Configuration';
import { Commands } from '../constants';
import { displayError, Errors } from '../errors';
import * as path from 'path';
import * as fs from 'fs';

export class ImportContentCommand implements Command {
    constructor(private configuration: Configuration, private uri: vscode.Uri) {
    }

    execute() {
        if (!utils.isMod()) {
            return;
        }

        if (!this.uri) {
            return;
        }

        var workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

        var uncookedBasePath = this.configuration.UncookedBasePath;

        if (!uncookedBasePath) {
            displayError(Errors.UncookedPathNotSetted);
            vscode.commands.executeCommand(Commands.ShowSettingsPage);
            return;
        }

        var modName = utils.getModName();

        var modContentPath = path.join(workspacePath, modName, "content");

        if (!fs.statSync(modContentPath).isDirectory()) {
            throw 'Invalid mod directory, make sure to create a mod using the "Witcher: New Mod" or import a existent one correctly.';
        }

        var pathToListContentFiles = uncookedBasePath;

        if (this.uri.fsPath.startsWith(modContentPath)) {
            if (fs.statSync(this.uri.fsPath).isDirectory()) {
                pathToListContentFiles = (this.uri.fsPath + "/").replace(modContentPath, uncookedBasePath);
            } else {
                pathToListContentFiles = path.dirname(this.uri.fsPath + "/").replace(modContentPath, path.dirname(uncookedBasePath));
            }
        }

        const listContentFiles = (dir, files = []) => {
            fs.readdirSync(dir).map(file => {
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    listContentFiles(path.join(dir, file), files);
                } else {
                    files.push(path.join(dir, file).replace(uncookedBasePath, "").substring(1).replace(/\\/gi, "/"));
                }
            });

            return files;
        };

        vscode.window.showQuickPick(listContentFiles(pathToListContentFiles), {
            placeHolder: 'Select the content file to import'
        }).then((selectedItem) => {
            const copyFile = (targetFile) => {
                try {
                    var copyDirectory = path.dirname(targetFile);

                    if (!fs.existsSync(copyDirectory)) {
                        fs.mkdirSync(copyDirectory);
                    }

                    fs.writeFileSync(targetFile, fs.readFileSync(path.join(uncookedBasePath, selectedItem)));

                    if (['.csv', '.xml', '.txt'].indexOf(path.extname(targetFile)) > -1) {
                        vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.parse(targetFile), false);
                    }
                } catch {
                }
            };

            var targetFile = path.join(modContentPath, selectedItem);

            if (fs.existsSync(targetFile)) {
                vscode.window.showInformationMessage('The content file you want import already exists, do you wanna override it?', 'Yes', 'No').then(sel => {
                    if (sel == 'Yes') {
                        copyFile(targetFile);
                    }
                });
            } else {
                copyFile(targetFile);
            }
        });
    }
}