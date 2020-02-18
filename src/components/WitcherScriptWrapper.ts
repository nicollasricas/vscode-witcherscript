import * as cp from "child_process";
import * as path from "path";
import * as vscode from "vscode";
import { ExtensionId } from "../constants";

import * as fs from "fs";
import { type } from "os";

enum NotificationType {
    Information = 1,
    Warning = 2,
    Error = 3
}

enum EventType {
    Output = 1,
    Progress = 2,
    Error = 3,
    Result = 4,
    Done = 5,
    Notification = 6,
    Debug = 7,
    Command = 8
}

interface NotificationEvent extends Event {
    NotificationType: NotificationType;
    Message: string;
}

interface Event {
    Type: EventType;
}

interface CommandEvent extends Event {
    Command: string;
    Args: string[];
}

interface OutputEvent extends Event {
    Message: string;
}

interface ProgressEvent extends Event {
    Message: string;
    Increment?: number;
}

interface ErrorEvent extends Event {
    Message: string;
}

interface ResultEvent extends Event {
    Data: string;
}

export class WitcherScriptWrapper {
    constructor(private outputChannel: vscode.OutputChannel) {}

    uncook(modKitPath: string, textureFormat: string, dumpSWF: boolean, skipErrors: boolean): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            var params = [`"${modKitPath}"`, textureFormat];

            if (dumpSWF) {
                params.push("--dumpswf");
            }

            if (skipErrors) {
                params.push("--skiperrors");
            }

            this.exec("--uncook", params, true)
                .then(uncookedPath => resolve(uncookedPath))
                .catch(error => reject(error));
        });
    }

    cook(gamePath: string, modKitPath: string, workspacePath: string, modMergerPath: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.exec("--cook", [`"${gamePath}"`, `"${modKitPath}"`, `"${workspacePath}"`, `"${modMergerPath}"`], true)
                .then(cookedPath => resolve(cookedPath))
                .catch(error => reject(error));
        });
    }

    launchGame(gamePath: string, debug?: boolean): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            var params = [`"${gamePath}"`];

            if (debug) {
                params.push("--debug");
            }

            this.exec("--launchgame", params, true)
                .then(() => resolve())
                .catch(error => reject(error));
        });
    }

    newPackage(packageName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.exec("--newpackage", [packageName], false)
                .then(packagePath => resolve(packagePath))
                .catch(error => reject(error));
        });
    }

    exec(cmd: string, args?: string[], withProgress?: boolean): Promise<any> {
        const wscExecutable = path.join(vscode.extensions.getExtension(ExtensionId).extensionPath, ".wsc", "wsc.exe");
        const _exec = (progress?: vscode.Progress<{ message?: string; increment?: number }>): Promise<any> => {
            return new Promise<any>((resolve, reject) => {
                let command = `"${wscExecutable}" ${cmd}`;

                if (args) {
                    command += ` ${args.join(" ")}`;
                }

                let process = cp.exec(command, { maxBuffer: 2000 * 1024 });

                process.stdout
                    .pipe(require("JSONStream").parse())
                    .on("data", (m: Event) => {
                        switch (m.Type) {
                            case EventType.Output:
                                this.outputChannel.show();
                                this.outputChannel.appendLine((<OutputEvent>m).Message);
                                break;
                            case EventType.Progress:
                                if (progress) {
                                    let progressEvent = <ProgressEvent>m;

                                    progress.report({
                                        message: progressEvent.Message,
                                        increment: progressEvent.Increment || undefined
                                    });
                                }
                                break;
                            case EventType.Command:
                                let commandEvent = <CommandEvent>m;

                                vscode.commands.executeCommand(commandEvent.Command, commandEvent.Args);
                                break;
                            case EventType.Notification:
                                let notificationEvent = <NotificationEvent>m;

                                switch (notificationEvent.NotificationType) {
                                    case NotificationType.Information:
                                        vscode.window.showInformationMessage(notificationEvent.Message);
                                        break;
                                    case NotificationType.Warning:
                                        vscode.window.showWarningMessage(notificationEvent.Message);
                                        break;
                                    case NotificationType.Error:
                                        vscode.window.showErrorMessage(notificationEvent.Message);
                                }
                                break;
                            case EventType.Result:
                                resolve((<ResultEvent>m).Data);
                                break;
                            case EventType.Done:
                                resolve();
                                break;
                            case EventType.Error:
                                reject((<ErrorEvent>m).Message);
                                break;
                        }
                    })
                    .on("end", () => reject());

                process.stderr
                    //.pipe(require('JSONStream').parse())
                    .on("data", (m: any) => {
                        throw Error(m);
                    })
                    .on("error", (m: any) => {
                        throw Error(m);
                    });
            });
        };

        return new Promise((resolve, reject) => {
            if (withProgress) {
                vscode.window
                    .withProgress(
                        {
                            cancellable: false,
                            location: vscode.ProgressLocation.Notification
                        },
                        progress => {
                            return new Promise((resolve, reject) => {
                                _exec(progress)
                                    .then(result => resolve(result))
                                    .catch(error => reject(error));
                            });
                        }
                    )
                    .then(result => resolve(result), error => reject(error));
            } else {
                _exec()
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            }
        });
    }
}
