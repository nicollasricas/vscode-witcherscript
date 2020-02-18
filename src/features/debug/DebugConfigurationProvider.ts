import * as vscode from "vscode";
import { ExtensionLanguage } from "../../constants";
import * as net from "net";
import { DebugSession } from "./DebugSession";

export class DebugConfigurationProvider implements vscode.DebugConfigurationProvider {
    private server?: net.Server;

    resolveDebugConfiguration(
        folder: vscode.WorkspaceFolder | undefined,
        config: vscode.DebugConfiguration,
        token?: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.DebugConfiguration> {
        if (!config.type && !config.request) {
            const editor = vscode.window.activeTextEditor;

            if (editor && editor.document.languageId === ExtensionLanguage) {
                config.type = ExtensionLanguage;
                config.name = "Debug";
                config.request = "launch";
                config.program = "${file}";
            }
        }

        if (!config.program) {
            // se nao encontrar o programa para debugar
        }

        if (typeof global.v8debug === "object" || /--debug|--inspect/.test(process.execArgv.join(" "))) {
            if (!this.server) {
                this.server = net.createServer(socket => {
                    const debugSession = new DebugSession();

                    debugSession.setRunAsServer(true);
                    debugSession.start(<NodeJS.ReadableStream>socket, socket);
                });

                this.server.listen(0);
            }

            config.debugServer = (<net.AddressInfo>this.server.address()).port;
        }

        return config;
    }

    dispose() {
        if (this.server) {
            this.server.close();
        }
    }
}
