import * as vscode from "vscode";
import { Configuration } from "../components/Configuration";
import { WitcherScriptWrapper } from "../components/WitcherScriptWrapper";

export class UncookCommand implements Command {
    constructor(private configuration: Configuration, private wscWrapper: WitcherScriptWrapper) {}

    execute() {
        let modKitPath = this.configuration.ModKitPath;

        vscode.window
            .showQuickPick(["tga", "png", "jpg", "dds", "bmp"], {
                placeHolder: "Select the texture format to uncook",
                canPickMany: false
            })
            .then(textureFormat => {
                if (textureFormat) {
                    vscode.window
                        .showQuickPick(["No", "Yes"], {
                            placeHolder: "Dump SWF files?",
                            canPickMany: false
                        })
                        .then(dumpSWF => {
                            if (dumpSWF) {
                                vscode.window
                                    .showQuickPick(["No", "Yes"], {
                                        placeHolder: "Skip errors?",
                                        canPickMany: false
                                    })
                                    .then(skipErrors => {
                                        if (skipErrors) {
                                            this.wscWrapper
                                                .uncook(
                                                    modKitPath,
                                                    textureFormat,
                                                    dumpSWF === "Yes",
                                                    skipErrors === "Yes"
                                                )
                                                .catch(error => vscode.window.showErrorMessage(error));
                                        }
                                    });
                            }
                        });
                }
            });
    }
}
