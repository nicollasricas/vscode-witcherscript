import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as utils from './utils';
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { Commands, ExtensionId } from './constants';
import { contentPreview } from './ContentPreview';
import { configuration } from './configuration';
import { displayError, Errors } from './errors';

export function showSettingsPage() {
    let settings = {
        gamePath: configuration.gamePath,
        modKitPath: configuration.modKitPath,
        modMergerPath: configuration.modMergerPath,
        uncookedBasePath: configuration.uncookedBasePath
    };

    contentPreview.show('settings-page', settings, (message) => {
        if (message.command == 'change-setting' && message.arguments[0]) {
            vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false
            }).then(selections => {
                if (selections[0]) {
                    configuration.update(message.arguments[0], selections[0].fsPath);

                    contentPreview.post({
                        command: 'update-setting-ui',
                        arguments: [
                            message.arguments[0],
                            path.normalize(selections[0].fsPath)
                        ]
                    });

                    // configuration.update(message.arguments[0], message.arguments[1]);
                    // // update configuration
                    // // send message to the UI to update the field
                }
            });
        }
    });
}

export function showWelcomePage() {
    contentPreview.show('welcome-page');
}

export function launchGame() {
    let wscPath = utils.wscPath();
    let gamePath = configuration.gamePath;

    if (!gamePath) {
        displayError(Errors.GamePathNotSetted);
        vscode.commands.executeCommand(Commands.ShowSettingsPage);
        return;
    }

    // wsc --launch gamePath
    child_process.exec(`"${wscPath}" --launch "${gamePath}"`, (err, stdout, stderr) => {
        if (stderr) {
            displayError(Errors[stderr]);
        }
    });
}

function _cook(gamePath: string, modKitPath: string, workspacePath: string, modMergerPath: string) {
    let wscPath = utils.wscPath();

    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    statusBarItem.text = `Cooking ${utils.getModName()}...`;
    statusBarItem.show();

    // wsc --cook gamePath modKitPath workspacePath modMergerPath
    child_process.exec(`"${wscPath}" --cook "${gamePath}" "${modKitPath}" "${workspacePath}" "${modMergerPath}"`, (err, stdout, stderr) => {
        if (stderr) {
            displayError(Errors[stderr]);
        } else {
            statusBarItem.dispose();

            vscode.window.showInformationMessage('Mod cooked, launch game?', 'Yes', 'No').then(selection => {
                if (selection == 'Yes') {
                    vscode.commands.executeCommand('witcherscript.launch');
                }
            });
        }
    });
}

export function cookMod() {
    if (!utils.isWitcherPackage()) {
        return;
    }

    let gamePath = configuration.gamePath;
    let modKitPath = configuration.modKitPath;
    let modMergerPath = configuration.modMergerPath;

    if (!gamePath) {
        displayError(Errors.GamePathNotSetted);
        vscode.commands.executeCommand(Commands.ShowSettingsPage);
        return;
    }

    if (!modKitPath) {
        displayError(Errors.ModKitPathNotSetted);
        vscode.commands.executeCommand(Commands.ShowSettingsPage);
        return;
    }

    let workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

    let modsPath = path.join(gamePath, "mods");

    let mods = fs.readdirSync(modsPath).map(dir => fs.statSync(path.join(modsPath, dir)).isDirectory());

    if (mods && mods.length > 1) {
        vscode.window.showInformationMessage('It appears that you have more than one mod installed, are you sure you wanna cook this mod? it may force you to merge all changed content files and scripts.', 'Yes', 'No').then(sel => {
            if (sel == 'Yes') {
                _cook(gamePath, modKitPath, workspacePath, modMergerPath);
            }
        });
    } else {
        _cook(gamePath, modKitPath, workspacePath, modMergerPath);
    }
}

export function importContent(arg: vscode.Uri) {
    if (!utils.isWitcherPackage()) {
        return;
    }

    if (!arg) {
        return;
    }

    var workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

    var uncookedBasePath = configuration.uncookedBasePath;

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

    if (arg.fsPath.startsWith(modContentPath)) {
        if (fs.statSync(arg.fsPath).isDirectory()) {
            pathToListContentFiles = (arg.fsPath + "/").replace(modContentPath, uncookedBasePath);
        } else {
            pathToListContentFiles = path.dirname(arg.fsPath + "/").replace(modContentPath, path.dirname(uncookedBasePath));
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

export function importScript(arg: vscode.Uri) {
    if (!utils.isWitcherPackage()) {
        return;
    }

    if (!arg) {
        return;
    }

    let workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

    let gamePath = configuration.gamePath;

    if (!gamePath) {
        displayError(Errors.GamePathNotSetted);
        vscode.commands.executeCommand(Commands.ShowSettingsPage);
        return;
    }

    let modName = utils.getModName();

    let modScriptsDir = path.join(workspacePath, modName, "scripts");

    if (!fs.statSync(modScriptsDir).isDirectory()) {
        throw 'Invalid mod directory, make sure to create a mod using the "Witcher: New Mod" or import a existent one correctly.';
    }

    let dirToListScripts = "";

    let baseScriptsPath = path.join(gamePath, "content/content0/scripts/game");

    dirToListScripts = baseScriptsPath;

    if (arg.fsPath.startsWith(modScriptsDir)) {
        if (fs.statSync(arg.fsPath).isDirectory()) {
            dirToListScripts = (arg.fsPath + "/").replace(modScriptsDir, path.dirname(baseScriptsPath));
        } else {
            dirToListScripts = path.dirname(arg.fsPath + "/").replace(modScriptsDir, path.dirname(baseScriptsPath));
        }
    }

    const listScripts = (dir, files = []) => {
        fs.readdirSync(dir).map(file => {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                listScripts(path.join(dir, file), files);
            } else {
                files.push(path.join(dir, file).replace(baseScriptsPath, "").substring(1).replace(/\\/gi, "/"));
            }
        });

        return files;
    };

    vscode.window.showQuickPick(listScripts(dirToListScripts), {
        placeHolder: "Select the script to import"
    }).then((selectedItem) => {
        const copyFile = (targetFile) => {
            try {
                var copyDirectory = path.dirname(targetFile);

                if (!fs.existsSync(copyDirectory)) {
                    fs.mkdirSync(copyDirectory);
                }

                fs.writeFileSync(targetFile, fs.readFileSync(path.join(baseScriptsPath, selectedItem)));

                vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.parse(targetFile), false);
            } catch {

            }
        };

        var targetFile = path.join(modScriptsDir, "game", selectedItem);

        if (fs.existsSync(targetFile)) {
            vscode.window.showInformationMessage('The script you want import already exists, do you wanna override it?', 'Yes', 'No').then(sel => {
                if (sel == 'Yes') {
                    copyFile(targetFile);
                }
            });
        } else {
            copyFile(targetFile);
        }
    });
}

export function uncook(args: any[]) {
}