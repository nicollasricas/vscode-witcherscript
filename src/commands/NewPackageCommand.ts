import * as vscode from "vscode";
import { WitcherScriptWrapper } from "../components/WitcherScriptWrapper";
import { Strings } from "../constants";

export class NewPackageCommand implements Command {
    constructor(private wscWrapper: WitcherScriptWrapper) {}

    execute() {
        vscode.window
            .showInputBox({
                prompt: Strings.NewPackagePrompt,
                placeHolder: Strings.NewPackagePlaceHolder
            })
            .then(packageName => {
                if (packageName) {
                    this.wscWrapper
                        .newPackage(packageName)
                        .then(packagePath =>
                            vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.parse(packagePath), false)
                        );
                }
            });
    }
}
