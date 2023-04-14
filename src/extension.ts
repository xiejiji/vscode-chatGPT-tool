// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
const fs = require("fs");
const path = require("path");
const getWebviewContent = (scriptPath, stylePath, catGifPath) => {
  const htmlTemplate = `
		<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<link href="${stylePath}" rel="stylesheet" />
					<style>
						body.vscode-light {
							color: black;
						}

						body.vscode-dark {
							color: white;
						}

						body.vscode-high-contrast {
							color: red;
						}
					</style>
				</head>
				<body>
					<div id="app"></div>
					<img src="${catGifPath}" width="300" />
					<script src="${scriptPath}"></script>
				</body>
			</html>
		`;
  return htmlTemplate;
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "chatgpt" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("chatgpt.helloWorld", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage("Hello World from chatgpt!");
  });

  const panelDisposable = vscode.commands.registerCommand(
    "chatgpt.start",
    () => {
      // 创建并显示新的webview
      const styleUrl = vscode.Uri.joinPath(
        context.extensionUri,
        "/dist/main.css"
      )
        .with({ scheme: "vscode-resource" })
        .toString();
      // const scriptUrl = vscode.Uri.joinPath(
      //   context.extensionUri,
      //   "/dist/webview.js"
      // )
      //   .with({ scheme: "vscode-resource" })
      //   .toString();

      // .replace(
      //   "styleUri",
      //   vscode.Uri.joinPath(context.extensionUri, "/dist/main.css")
      //     .with({ scheme: "vscode-resource" })
      //     .toString()
      // ).replace(
      //   "scriptUri",
      //   vscode.Uri.joinPath(context.extensionUri, "/dist/webview.js")
      //     .with({ scheme: "vscode-resource" })
      //     .toString()
      // );
      const panel = vscode.window.createWebviewPanel(
        "chatgptStart", // 只供内部使用，这个webview的标识
        "chatgpt start", // 给用户显示的面板标题
        vscode.ViewColumn.One, // 给新的webview面板一个编辑器视图
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, "dist"),
          ],
        }
      );
      const scriptPathOnDisk = vscode.Uri.joinPath(
        context.extensionUri,
        "dist",
        "webview.js"
      );
      const stylePathOnDisk = vscode.Uri.joinPath(
        context.extensionUri,
        "dist",
        "main.css"
      );
      // And the uri we use to load this script in the webview
      const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);
      const styleUri = panel.webview.asWebviewUri(stylePathOnDisk);
      const onDiskPath = vscode.Uri.file(
        path.join(context.extensionPath, "dist", "cat.gif")
      );
      const imageUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, "dist", "cat.gif")
      );
      panel.webview.html = getWebviewContent(scriptUri, styleUri, imageUri);

      const config = vscode.workspace.getConfiguration("chatgpt");
      const mySetting = config.get("key");
      panel.webview.postMessage({
        command: "getConfig",
        config: {
          key: mySetting,
        },
      });
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(panelDisposable);

  let currentPanel: vscode.WebviewPanel | undefined = undefined;
  context.subscriptions.push(
    vscode.commands.registerCommand("chatgpt.doRefactor", () => {
      if (!currentPanel) {
        return;
      }
      const config = vscode.workspace.getConfiguration("chatgpt");
      const mySetting = config.get("key");
      // 把信息发送到webview
      // 你可以发送任何序列化的JSON数据
      console.log(currentPanel);
      currentPanel.webview.postMessage({
        command: "getConfig",
        config: {
          key: mySetting,
        },
      });
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
