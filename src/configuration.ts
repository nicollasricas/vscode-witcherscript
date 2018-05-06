import * as vscode from 'vscode';
import { ExtensionId } from './constants';
import * as path from 'path';

export class Configuration {
    private _gamePath: string;
    private _modKitPath: string;
    private _modMergerPath: string;
    private _uncookedBasePath: string;

    constructor() {
        vscode.workspace.onDidChangeConfiguration((e) => Configuration.configure());
    }

    update(name: string, value: any): any {
        let workspaceConfiguration = vscode.workspace.getConfiguration();

        switch (name) {
            case 'gamePath':
                this._gamePath = value;
                workspaceConfiguration.update('witcherscript.gamePath', this._gamePath, vscode.ConfigurationTarget.Global);
                break;
            case 'modKitPath':
                this._modKitPath = value;
                workspaceConfiguration.update('witcherscript.modKitPath', this._modKitPath, vscode.ConfigurationTarget.Global);
                break;
            case 'modMergerPath':
                this._modMergerPath = value;
                workspaceConfiguration.update('witcherscript.modMergerPath', this._modMergerPath, vscode.ConfigurationTarget.Global);
                break;
            case 'uncookedBasePath':
                this._uncookedBasePath = value;
                workspaceConfiguration.update('witcherscript.uncookedBasePath', this._uncookedBasePath, vscode.ConfigurationTarget.Global);
                break;
        }
    }

    static configure() {
        let workspaceConfiguration = vscode.workspace.getConfiguration();

        configuration._gamePath = workspaceConfiguration.get('witcherscript.gamePath');
        configuration._modKitPath = workspaceConfiguration.get('witcherscript.modKitPath');
        configuration._modMergerPath = workspaceConfiguration.get('witcherscript.modMergerPath');
        configuration._uncookedBasePath = workspaceConfiguration.get('witcherscript.uncookedBasePath');
    }

    get gamePath(): string {
        return this._gamePath;
    }

    get modKitPath(): string {
        return this._modKitPath;
    }

    get modMergerPath(): string {
        return this._modMergerPath;
    }

    get uncookedBasePath(): string {
        return this._uncookedBasePath;
    }
}

export const configuration = new Configuration();