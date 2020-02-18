import * as vscode from "vscode";
import { Configurations } from "../constants";

export class Configuration {
    private gamePath: string;
    private modKitPath: string;
    private scriptMergerPath: string;
    private uncookedBasePath: string;

    constructor() {
        this.configure();

        vscode.workspace.onDidChangeConfiguration(() => this.configure());
    }

    update(name: string, value: any): any {
        let workspaceConfiguration = vscode.workspace.getConfiguration();

        switch (name) {
            case Configurations.GamePath:
                this.gamePath = value;
                workspaceConfiguration.update(
                    Configurations.GamePath,
                    this.gamePath,
                    vscode.ConfigurationTarget.Global
                );
                break;
            case Configurations.ModKitPath:
                this.modKitPath = value;
                workspaceConfiguration.update(
                    Configurations.ModKitPath,
                    this.modKitPath,
                    vscode.ConfigurationTarget.Global
                );
                break;
            case Configurations.ScriptMergerPath:
                this.scriptMergerPath = value;
                workspaceConfiguration.update(
                    Configurations.ScriptMergerPath,
                    this.scriptMergerPath,
                    vscode.ConfigurationTarget.Global
                );
                break;
            case Configurations.UncookedBasePath:
                this.uncookedBasePath = value;
                workspaceConfiguration.update(
                    Configurations.UncookedBasePath,
                    this.uncookedBasePath,
                    vscode.ConfigurationTarget.Global
                );
                break;
        }
    }

    private configure() {
        let workspaceConfiguration = vscode.workspace.getConfiguration();

        this.gamePath = workspaceConfiguration.get(Configurations.GamePath);
        this.modKitPath = workspaceConfiguration.get(Configurations.ModKitPath);
        this.scriptMergerPath = workspaceConfiguration.get(Configurations.ScriptMergerPath);
        this.uncookedBasePath = workspaceConfiguration.get(Configurations.UncookedBasePath);
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
