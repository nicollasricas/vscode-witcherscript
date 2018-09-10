export const InternalExtensionId = 'vscode-witcherscript';
export const ExtensionId = `nicollasricas.${InternalExtensionId}`;
export const ExtensionScheme = 'witcherscript';
export const ExtensionName = 'Witcher Script';

export const OutputChannelName = 'Witcher Script';

export enum GlobalState {
    WitcherScriptVersion = 'witcherscriptVersion'
}

export enum Commands {
    Cook = 'witcherscript.cook',
    LaunchGame = 'witcherscript.launchGame',
    ImportScript = 'witcherscript.importScript',
    ImportContent = 'witcherscript.importContent',
    ShowWelcomePage = 'witcherscript.showWelcomePage',
    ShowSettingsPage = 'witcherscript.showSettingsPage',
    NewPackage = 'witcherscript.newPackage',
    CompareScript = 'witcherscript.compareScript',
    Uncook = 'witcherscript.uncook'
}

export enum Pages {
    Welcome = 'welcome-page',
    Settings = 'settings-page'
}