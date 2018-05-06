import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { showSettingsPage } from './commands';
import { ExtensionId } from './constants';

interface ContentPage {
    title: string;
    path: string;
}

interface ContentMessage {
    command: string;
    arguments: any[];
}

export class ContentPreview {
    private pages: { [id: string]: ContentPage } = {
        'welcome-page': {
            title: 'Witcher Script',
            path: './ui/welcome.html'
        },
        'settings-page': {
            title: 'Witcher Script - Settings',
            path: './ui/settings.html'
        }
    };

    private webViewPanel: vscode.WebviewPanel;
    private extensionPath: string;

    public constructor() {
        this.extensionPath = vscode.extensions.getExtension(ExtensionId).extensionPath;
    }

    public post(message: ContentMessage) {
        if (this.webViewPanel) {
            this.webViewPanel.webview.postMessage(message);
        }
    }

    public show(id: string, model?: object, listener?: (message: ContentMessage) => void) {
        let page = this.pages[id];

        if (!this.webViewPanel) {
            this.webViewPanel = vscode.window.createWebviewPanel(`witcherscript.view.${id}`, page.title, vscode.ViewColumn.One, {
                enableScripts: true,
                enableCommandUris: true,
                localResourceRoots: [
                    vscode.Uri.parse(this.extensionPath)
                ]
            });

            this.webViewPanel.onDidDispose(() => {
                this.webViewPanel.dispose();
                this.webViewPanel = null;
            });
        }

        this.webViewPanel.title = page.title;
        this.webViewPanel.webview.html = this.parseContentDocument(page.path, model);

        if (listener) {
            this.webViewPanel.webview.onDidReceiveMessage(listener);
        }

        this.webViewPanel.reveal();
    }

    private parseContentDocument(pagePath: string, model: object): string {
        const rootPath = vscode.Uri.parse(this.extensionPath).with({ scheme: 'vscode-resource' }).toString();

        let content = fs.readFileSync(path.join(this.extensionPath, pagePath)).toString();

        content = content.replace(/{{root}}/gi, rootPath);

        if (model) {
            for (let property in model) {
                content = content.replace(new RegExp(`{{model.${property}}}`, 'gi'), model[property]);
            }
        }

        return content;
    }
}

export const contentPreview = new ContentPreview();