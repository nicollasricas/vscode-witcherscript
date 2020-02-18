import * as vscode from "vscode";
import { Configuration } from "../components/Configuration";

import { Commands, Strings } from "../constants";
import { WitcherScriptWrapper } from "../components/WitcherScriptWrapper";

export class LaunchGameCommand implements Command {
    constructor(
        private configuration: Configuration,
        private wscWrapper: WitcherScriptWrapper,
        private debug: boolean = false
    ) {}

    execute() {
        this.wscWrapper.launchGame(this.configuration.GamePath, this.debug);
    }
}
