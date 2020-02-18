import * as notifier from "node-notifier";
import * as path from "path";
import { LoggingDebugSession, InitializedEvent } from "vscode-debugadapter";
import * as ws from "ws";
import { DebugProtocol } from "vscode-debugprotocol";

const Subject = require("await-notify");

export class DebugSession extends LoggingDebugSession {
    //private configurationDone = new Subject();

    constructor() {
        super("witcherscript_debug.txt");

        // start wsc --debug .folders
        // which will connect to socket and them give and receive messages like the wscwrapper.
        // if wsc looses connection with game socket them will try do reconnect two times, if that dont happen them
        // will close, which should end debug process.
    }

    protected initializeRequest(
        response: DebugProtocol.InitializeResponse,
        args: DebugProtocol.InitializeRequestArguments
    ): void {
        const responseBody = response.body!;

        responseBody.supportsConfigurationDoneRequest = true;
        responseBody.supportsEvaluateForHovers = true;
        responseBody.supportsSetVariable = true;
        responseBody.supportsStepBack = true;
        responseBody.supportsFunctionBreakpoints = true;
        responseBody.supportsConditionalBreakpoints = true;
        responseBody.supportsCompletionsRequest = true;
        responseBody.supportsExceptionInfoRequest = true;

        this.sendResponse(response);

        // should antecipate the configurationDone callback?
        this.sendEvent(new InitializedEvent());
    }

    protected configurationDoneRequest(
        response: DebugProtocol.ConfigurationDoneResponse,
        args: DebugProtocol.ConfigurationDoneArguments
    ): void {
        super.configurationDoneRequest(response, args); // why use this?

        //this.configurationDone.notify();
    }
}

DebugSession.run(DebugSession);
