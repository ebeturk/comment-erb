import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating ERB Toggle Comment extension...');

    let disposable = vscode.commands.registerCommand('comment-erb.commentErbTag', () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            let selection = editor.selection;

            editor.edit(editBuilder => {
                for (let i = selection.start.line; i <= selection.end.line; i++) {
                    const line = document.lineAt(i);
                    const lineText = line.text.trim(); // Trim whitespace for easier checking

                    let updatedText;

                    // Determine whether the line starts with an HTML tag or an ERB tag
                    if (lineText.startsWith('<%')) {
                        // Handle ERB tags
                        const isCommentedWithERB = lineText.includes('<%#');

                        if (isCommentedWithERB) {
                            // Uncomment ERB tags
                            updatedText = lineText.replace(/<%#\s*/, '<%').replace(/\s*%>/, '%>');
                        } else {
                            // Comment ERB tags
                            updatedText = lineText.replace(/<%/, '<%# ').replace(/\s*%>/, ' %>');
                        }
                    } else if (lineText.startsWith('<') && lineText.includes('<%')) {
                        // Handle mixed HTML and ERB tags
                        // Assume HTML comes first, comment the entire line as HTML
                        const isCommentedWithHTML = lineText.startsWith('<!--') && lineText.endsWith('-->');

                        if (isCommentedWithHTML) {
                            // Uncomment HTML
                            updatedText = lineText.replace(/<!--\s*/, '').replace(/\s*-->/, '');
                        } else {
                            // Comment HTML
                            updatedText = `<!-- ${lineText} -->`;
                        }
                    } else {
                        // Handle regular HTML tags
                        const isCommentedWithHTML = lineText.startsWith('<!--') && lineText.endsWith('-->');

                        if (isCommentedWithHTML) {
                            // Uncomment HTML
                            updatedText = lineText.replace(/<!--\s*/, '').replace(/\s*-->/, '');
                        } else {
                            // Comment HTML
                            updatedText = `<!-- ${lineText} -->`;
                        }
                    }

                    // Preserve the original indentation
                    const leadingWhitespace = line.text.match(/^\s*/)?.[0] || '';
                    updatedText = `${leadingWhitespace}${updatedText.trim()}`;

                    // Replace the line with the updated text
                    editBuilder.replace(line.range, updatedText);
                }
            });
        } else {
            vscode.window.showErrorMessage('No active editor found!');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
