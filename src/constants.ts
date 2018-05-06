export const InternalExtensionId = 'vscode-witcherscript';
export const ExtensionId = `nicollasricas.${InternalExtensionId}`;
export const ExtensionScheme = 'witcherscript';

export const OutputChannelName = 'Witcher Script';

export enum GlobalState {
    WitcherScriptVersion = 'witcherscriptVersion'
}

export enum Commands {
    Cook = 'witcherscript.cook',
    Launch = 'witcherscript.launch',
    ImportScript = 'witcherscript.importScript',
    ImportContent = 'witcherscript.importContent',
    ShowWelcomePage = 'witcherscript.showWelcomePage',
    ShowSettingsPage = 'witcherscript.showSettingsPage'
}