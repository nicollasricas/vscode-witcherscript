import * as vscode from "vscode";

export async function activate(context: vscode.ExtensionContext) {
  try {
    const updateTerminal = vscode.window.createTerminal();

    updateTerminal.sendText("echo 'Updating Witcher Script extension...'");

    updateTerminal.show();

    updateTerminal.sendText(
      "code --install-extension nicollasr.vscode-witcherscript"
    );

    updateTerminal.sendText(
      "code --uninstall-extension nicollasricas.vscode-witcherscript"
    );
  } catch (error) {}
}

export function deactivate() {}
