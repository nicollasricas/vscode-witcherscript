import * as vscode from 'vscode';
import { Commands } from '../constants';

export class Configuration {
    private gamePath: string;
    private modKitPath: string;
    private scriptMergerPath: string;
    private uncookedBasePath: string;

    constructor() {
        this.configure();

        vscode.workspace.onDidChangeConfiguration((e) => this.configure());
    }

    update(name: string, value: any): any {
        let workspaceConfiguration = vscode.workspace.getConfiguration();

        switch (name) {
            case 'gamePath':
                this.gamePath = value;
                workspaceConfiguration.update('witcherscript.gamePath', this.gamePath, vscode.ConfigurationTarget.Global);
                break;
            case 'modKitPath':
                this.modKitPath = value;
                workspaceConfiguration.update('witcherscript.modKitPath', this.modKitPath, vscode.ConfigurationTarget.Global);
                break;
            case 'scriptMergerPath':
                this.scriptMergerPath = value;
                workspaceConfiguration.update('witcherscript.scriptMergerPath', this.scriptMergerPath, vscode.ConfigurationTarget.Global);
                break;
            case 'uncookedBasePath':
                this.uncookedBasePath = value;
                workspaceConfiguration.update('witcherscript.uncookedBasePath', this.uncookedBasePath, vscode.ConfigurationTarget.Global);
                break;
        }
    }

    private configure() {
        let workspaceConfiguration = vscode.workspace.getConfiguration();

        this.gamePath = workspaceConfiguration.get('witcherscript.gamePath');
        this.modKitPath = workspaceConfiguration.get('witcherscript.modKitPath');
        this.scriptMergerPath = workspaceConfiguration.get('witcherscript.scriptMergerPath');
        this.uncookedBasePath = workspaceConfiguration.get('witcherscript.uncookedBasePath');
    }

    get GamePath(): string {
        return this.gamePath;
    }

    get ModKitPath(): string {
        return this.modKitPath;
    }

    get ScriptMergerPath(): string {
        return this.scriptMergerPath;
    }

    get UncookedBasePath(): string {
        return this.uncookedBasePath;
    }
}