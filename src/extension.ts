import * as vscode from 'vscode';
import { toggleErbCommentLine } from './commenter';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating ERB Toggle Comment extension...');

    const disposable = vscode.commands.registerCommand('comment-erb.commentErbTag', () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;

            editor.edit(editBuilder => {
                for (let i = selection.start.line; i <= selection.end.line; i++) {
                    const line = document.lineAt(i);
                    editBuilder.replace(line.range, toggleErbCommentLine(line.text));
                }
            });
        } else {
            vscode.window.showErrorMessage('No active editor found!');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
