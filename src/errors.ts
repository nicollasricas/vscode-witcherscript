import * as vscode from 'vscode';

export const GamePathNotSetted = "E_GAME_PATH_NOT_SETTED";
export const ModKitPathNotSetted = "E_MOD_KIT_PATH_NOT_SETTED";
export const GameExeNotFound = "E_GAME_EXE_NOT_FOUND";
export const UnableToLaunch = "E_UNABLE_TO_LAUNCH";
export const CompanionAppNotInstalled = "E_COMPANION_APP_NOT_INSTALLED";
export const ModNotCreated = "E_MOD_NOT_CREATED";
export const PathNotSelected = "E_PATH_NOT_SELECTED";
export const Unexpected = "E_UNEXPECTED";

export function show(errorCode: string) {
    let errorMessage = errorCodeToString(errorCode);

    if (errorMessage) {
        vscode.window.showErrorMessage(errorMessage);
    }
}

function errorCodeToString(errorCode: string): string {
    switch (errorCode) {
        case PathNotSelected:
            return 'Path not selected';
        case UnableToLaunch:
            return 'Unable to start the game!';
        case GameExeNotFound:
            return 'The game executable was not found!';
        case GamePathNotSetted:
            return 'Configure the "witcherscript.gamePath" in File > Preferences > Settings.';
        case ModKitPathNotSetted:
            return 'Configure the "witcherscript.modKitPath" in File > Preferences > Settings.';
        case CompanionAppNotInstalled:
            return 'Download the Witcher Script companion app (https://https://github.com/nicollasricas/vscode-witcherscript-companion) before use this feature.';
        case ModNotCreated:
            return 'To use this feature create a mod using the "Witcher - Create Mod" command.';
        case Unexpected:
            return 'Something went wrong!';
    }
}