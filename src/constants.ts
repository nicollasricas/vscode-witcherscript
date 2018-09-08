export const InternalExtensionId = 'vscode-witcherscript';
export const ExtensionId = `nicollasricas.${InternalExtensionId}`;
export const ExtensionScheme = 'witcherscript';
export const ExtensionName = 'Witcher Script';

export const OutputChannelName = 'Witcher Script';

export enum GlobalState {
    WitcherScriptVersion = 'witcherscriptVersion'
}

export enum Commands {
    CookMod = 'witcherscript.cookMod',
    LaunchGame = 'witcherscript.launchGame',
    ImportScript = 'witcherscript.importScript',
    ImportContent = 'witcherscript.importContent',
    ShowWelcomePage = 'witcherscript.showWelcomePage',
    ShowSettingsPage = 'witcherscript.showSettingsPage',
    NewMod = 'witcherscript.newMod',
    CompareScript = 'witcherscript.compareScript',
    Uncook = 'witcherscript.uncook'
}