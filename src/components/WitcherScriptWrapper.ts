import * as cp from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';
import { ExtensionId } from '../constants';

import * as fs from 'fs';

enum EventType {
    Output = 1,
    Progress = 2,
    Error = 3,
    Result = 4,
    Done = 5
}

interface Event {
    Type: EventType;
    Data: any
}

export class WitcherScriptWrapper {
    constructor(private outputChannel: vscode.OutputChannel) {
    }

    uncook(modKitPath: string, textureFormat: string, dumpSWF: boolean, skipErrors: boolean): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            var params = [`"${modKitPath}"`, textureFormat];

            if (dumpSWF) {
                params.push('--dumpswf');
            }

            if (skipErrors) {
                params.push('--skiperrors');
            }

            this.exec('--uncook', params, true)
                .then(uncookedPath => resolve(uncookedPath))
                .catch(error => reject(error));
        });
    }

    cook(gamePath: string, modKitPath: string, workspacePath: string, modMergerPath: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.exec('--cook', [`"${gamePath}"`, `"${modKitPath}"`, `"${workspacePath}"`, `"${modMergerPath}"`], true)
                .then(() => resolve())
                .catch(error => reject(error));
        });
    }

    launchGame(gamePath: string, debug?: boolean): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            var params = [`"${gamePath}"`];

            if (debug) {
                params.push('--debug');
            }

            this.exec('--launchgame', params, true)
                .then(() => resolve())
                .catch(error => reject(error));
        });
    }

    newMod(modName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.exec('--newmod', [modName], false)
                .then(modPath => resolve(modPath))
                .catch(error => reject(error));
        });
    }

    exec(cmd: string, args?: string[], withProgress?: boolean): Promise<any> {
        const wscExecutable = path.join(vscode.extensions.getExtension(ExtensionId).extensionPath, '.wsc', 'wsc.exe');
        const _exec = (progress?: vscode.Progress<{ message?: string; increment?: number }>): Promise<any> => {
            return new Promise<any>((resolve, reject) => {
                let command = `"${wscExecutable}" ${cmd}`;

                if (args) {
                    command += ` ${args.join(' ')}`;
                }

                let process = cp.exec(command);

                process.stdout
                    .pipe(require('JSONStream').parse())
                    .on('data', (m: Event) => {
                        switch (m.Type) {
                            case EventType.Output:
                                this.outputChannel.show();
                                this.outputChannel.appendLine(m.Data);
                                break;
                            case EventType.Progress:
                                if (progress) {
                                    progress.report({
                                        message: m.Data
                                    });
                                }
                                break;
                            case EventType.Result:
                                resolve(m.Data);
                                break;
                            case EventType.Done:
                                resolve();
                                break;
                            case EventType.Error:
                                reject(m.Data);
                                break;
                        }
                    });

                process.stderr
                    .pipe(require('JSONStream').parse())
                    .on('data', (m: any) => {
                        throw Error(m);
                    })
                    .on('error', (m: any) => {
                        throw Error(m);
                    });
            });
        };

        return new Promise((resolve, reject) => {
            if (withProgress) {
                vscode.window.withProgress({
                    cancellable: false,
                    location: vscode.ProgressLocation.Notification
                }, (progress) => {
                    return new Promise((resolve, reject) => {
                        _exec(progress).then(result => resolve(result))
                            .catch(error => reject(error));
                    });
                }).then(result => resolve(result), error => reject(error));
            } else {
                _exec().then(result => resolve(result))
                    .catch(error => reject(error));
            }
        });
    }
}