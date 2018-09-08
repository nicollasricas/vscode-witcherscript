import * as vscode from 'vscode';

export enum Errors {
    ModKitPathNotSetted = "The mod kit path is required.",
    GameExeNotFound = "E_GAME_EXE_NOT_FOUND",
    GamePathIsRequired = "The game path is required.",
    ModKitPathIsRequired = "The mod kit path is required",
    UnableToLaunch = "E_UNABLE_TO_LAUNCH",
    ModIsRequired = "E_MOD_NOT_CREATED",
    PathNotSelected = "E_PATH_NOT_SELECTED",
    Unexpected = "E_UNEXPECTED",
    UncookedPathNotSetted = "E_UNCOOKED_PATH_NOT_SETTED"
};

export function displayError(error: Errors) {
    if (error) {
        vscode.window.showErrorMessage(errorToString(error));
    }
}

export function displayWarning(error: Errors) {
    if (error) {
        vscode.window.showWarningMessage(errorToString(error));
    }
}

export function errorToString(error: Errors): string {
    switch (error) {
        case Errors.PathNotSelected:
            return 'Path not selected';
        case Errors.UnableToLaunch:
            return 'Unable to start the game!';
        case Errors.GameExeNotFound:
            return 'The game executable was not found!';
        case Errors.GamePathIsRequired:
            return 'Configure the "game path" to use this feature.';
        case Errors.ModKitPathNotSetted:
            return 'Configure the "mod kit path" to use this feature.';
        case Errors.ModIsRequired:
            return 'A mod is required to use this feature, create a mod using the "create mod" command.';
        case Errors.Unexpected:
            return 'Something went wrong!';
        case Errors.UncookedPathNotSetted:
            return 'Configure the "uncooked base path" to use this feature.';
    }
}