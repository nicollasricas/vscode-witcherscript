export const InternalExtensionId = "vscode-witcherscript";
export const ExtensionId = `nicollasricas.${InternalExtensionId}`;
export const ExtensionScheme = "witcherscript";
export const ExtensionLanguage = "witcherscript";
export const ExtensionName = "Witcher Script";
export const OutputChannelName = "Witcher Script";

export enum GlobalState {
    WitcherScriptVersion = "witcherscriptVersion"
}

export enum Commands {
    Cook = "witcherscript.cook",
    LaunchGame = "witcherscript.launchGame",
    ImportScript = "witcherscript.importScript",
    ImportContent = "witcherscript.importContent",
    ShowWelcomePage = "witcherscript.showWelcomePage",
    ShowSettingsPage = "witcherscript.showSettingsPage",
    NewPackage = "witcherscript.newPackage",
    CompareScript = "witcherscript.compareScript",
    Uncook = "witcherscript.uncook"
}

export enum Configurations {
    GamePath = "witcherscript.gamePath",
    UncookedBasePath = "witcherscript.uncookedBasePath",
    ModKitPath = "witcherscript.modKitPath",
    ScriptMergerPath = "witcherscript.scriptMergerPath"
}

export enum Pages {
    Welcome = "welcome-page",
    Settings = "settings-page"
}

export enum Strings {
    NewPackagePrompt = "Package name",
    NewPackagePlaceHolder = "E.g:: modHDReworkedProject",
    GamePathIsRequired = "The game path is required.",
    UncookedBasePathIsRequired = "The uncooked base path is required.",
    CurrentWorkspaceNotWicherPackage = "The current workspace are not a witcher package.",
    FileAlreadyExists = "This file already exists, override it?",
    WorkspaceFolderRequired = "A workspace folder is required to cook packages",
    PackageCooked = "Cooked.",
    LaunchGame = "Launch Game"
}
