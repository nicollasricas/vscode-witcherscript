import * as url from 'url';
import * as https from 'https';
import * as tmp from 'tmp';
import * as vscode from 'vscode';
import * as mkdirp from 'mkdirp';
import * as fs from 'fs';
import * as yauzl from 'yauzl';
import * as path from 'path';
import { OutputChannelName } from './constants';
import { RuntimeDependency } from './RuntimeDependency';
import { Runtime } from 'inspector';

export class RuntimeDependencyInstaller {
    private outputChannel: vscode.OutputChannel;
    private statusBarItem: vscode.StatusBarItem;

    public constructor(private packageJSON: any, private extensionPath: string) {
        //show output channel ony if there's a dependency package to download
        this.outputChannel = vscode.window.createOutputChannel(OutputChannelName);

        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    }

    public async install(): Promise<boolean> {
        if (!this.packageJSON.runtimeDependencies) {
            return true;
        }

        let success = false;

        try {
            for (let runtimeDependency of (<RuntimeDependency[]>this.packageJSON.runtimeDependencies)) {
                await this.downloadPackage(runtimeDependency);
                await this.installPackage(runtimeDependency);
            }

            this.outputChannel.hide();
            this.statusBarItem.hide();

            success = true;
        } catch (error) {
            success = false;
        } finally {
            // delete runtime zipped file even if the installation fails, if they exist of course.
            tmp.setGracefulClean();
        }

        return success;
    }

    private installPackage(runtimeDependency: RuntimeDependency) {
        this.outputChannel.appendLine(`Installing package '${runtimeDependency.description}'...`);
        this.statusBarItem.text = `Installing package '${runtimeDependency.description}'...`;

        return new Promise<void>((resolve, reject) => {
            yauzl.open(runtimeDependency.tmp, { lazyEntries: true }, (err, zipFile) => {
                if (err) {
                    // faio o zip mein
                    reject(err);
                }

                zipFile.readEntry();

                let installationPath = path.join(this.extensionPath, runtimeDependency.installPath);

                mkdirp(installationPath, err => {
                    if (err) {
                        return reject(err);
                    }
                });

                zipFile.on('entry', function (entry) {
                    let entryPath = path.resolve(installationPath, entry.fileName);

                    if (entry.fileName.endsWith('/')) {
                        mkdirp(path.join(installationPath, entry.fileName), err => {
                            if (err) {
                                return reject(err);
                            }

                            zipFile.readEntry();
                        });
                    } else {
                        zipFile.openReadStream(entry, (err, fileStream) => {
                            if (err) {
                                return reject(err);
                            }

                            fileStream.pipe(fs.createWriteStream(entryPath, { flags: 'w' }));
                            fileStream.on('end', () => zipFile.readEntry());

                            //fs.mkdir()
                        });

                    }
                });

                zipFile.on('end', () => resolve());

                zipFile.on('error', (err) => reject(err));
            });
        });
    }

    private downloadPackage(runtimeDependency: RuntimeDependency, downloadUrl?: string): Promise<void> {
        this.outputChannel.appendLine(`Downloading package '${runtimeDependency.description}'...`);
        this.outputChannel.show();

        this.statusBarItem.text = `Downloading package '${runtimeDependency.description}'...`;
        this.statusBarItem.show();

        let packageDownloadUrl = url.parse(downloadUrl || runtimeDependency.url);

        return new Promise<void>((resolve, reject) => {
            tmp.file((err, path, fdp) => {
                if (err) {
                    reject(err);
                }

                runtimeDependency.tmp = path;

                let downloadRequest = https.request({
                    host: packageDownloadUrl.host, path: packageDownloadUrl.path
                }, response => {
                    if (response.statusCode == 301 || response.statusCode == 302) {
                        // address has beeen redirected
                        return resolve(this.downloadPackage(runtimeDependency, response.headers.location));
                    }

                    if (response.statusCode != 200) {
                        throw 'Download falhou';
                    }

                    console.log(path);

                    let downloadSize = parseInt(response.headers['content-length'], 10);
                    let downloadStream = fs.createWriteStream(path, { fd: fdp });
                    let downloadPercentage = 0;
                    let downloadedSize = 0;

                    this.outputChannel.appendLine(`${runtimeDependency.description} - ${(downloadSize / 1024 / 1024).toFixed(2)} MB.`);

                    response.on("data", data => {
                        downloadedSize += data.length;

                        let downloadedPercentage = Math.ceil((downloadedSize / downloadSize) * 100);

                        if (downloadedPercentage !== downloadPercentage) {
                            downloadPercentage = downloadedPercentage;

                            this.statusBarItem.text = `Downloading package '${runtimeDependency.description}'... ${downloadPercentage}%`;
                        }
                    });

                    response.on('end', () => {
                        resolve();
                    });

                    response.on("error", err => {
                        // falhou doownload mermao
                        reject(err);
                    });

                    response.pipe(downloadStream);
                });

                downloadRequest.end();
            });
        });
    }
}
