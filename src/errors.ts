import * as vscode from 'vscode';

export enum Errors {
    ModKitPathNotSetted = "E_MOD_KIT_PATH_NOT_SETTED",
    GameExeNotFound = "E_GAME_EXE_NOT_FOUND",
    GamePathNotSetted = "E_GAME_PATH_NOT_SETTED",
    UnableToLaunch = "E_UNABLE_TO_LAUNCH",
    ModNotCreated = "E_MOD_NOT_CREATED",
    PathNotSelected = "E_PATH_NOT_SELECTED",
    Unexpected = "E_UNEXPECTED",
    UncookedPathNotSetted = "E_UNCOOKED_PATH_NOT_SETTED"
};

export function displayError(error: Errors) {
    if (error) {
        vscode.window.showErrorMessage(errorToReadableString(error));
    }
}

function errorToReadableString(errorCode: string): string {
    switch (errorCode) {
        case Errors.PathNotSelected:
            return 'Path not selected';
        case Errors.UnableToLaunch:
            return 'Unable to start the game!';
        case Errors.GameExeNotFound:
            return 'The game executable was not found!';
        case Errors.GamePathNotSetted:
            return 'Configure game path.';
        case Errors.ModKitPathNotSetted:
            return 'Configure mod kit path.';
        case Errors.ModNotCreated:
            return 'To use this feature create a mod using the (Ctrl + Shift + P) - "Witcher - New Mod" command.';
        case Errors.Unexpected:
            return 'Something went wrong!';
        case Errors.UncookedPathNotSetted:
            return 'Configure uncooked base path.';
    }
}