ERB Toggle Comments is meant to address the problem of commenting and uncommenting ERB tags in `.erb` and `html.erb` files within Visual Studio Code. The default commenting behavior in VSCode can cause issues with ERB tags, so this extension provides a custom solution specifically designed for Ruby on Rails developers.

## Features

- **Toggle ERB Commenting**: Easily comment and uncomment ERB tags as well as HTML elements in `.erb` or `html.erb` files.
- **Flexible Commenting**: Comment or uncomment single or multiple lines, with or without selecting the text.

Here is how it works:

- If the line contains an ERB tag (`<% %>`), the extension will toggle between:
  - Commenting with ERB: `<%# %>`
  - Uncommenting back to: `<% %>`

- If the line contains regular HTML, the extension will toggle between:
  - Commenting with HTML: `<!-- -->`
  - Uncommenting by removing the `<!-- -->` tags.

> Tip: You can use the keyboard shortcut `cmd+/` on macOS or `ctrl+/` on Windows/Linux when your cursor is focused on an ERB or HTML line to toggle the comment.

## Requirements

There are no additional dependencies or requirements for using this extension. It works out-of-the-box with VSCode.

## Extension Settings

This initial version of ERB Commenter does not include customizable settings. Future updates will introduce options to configure the commenting behavior.

## Known Issues

There are no known issues at the time of the initial release. If you encounter any problems, please report them on the extension's GitHub repository.

## Release Notes

### 0.0.1

- Initial release of ERB Commenter.
- Supports toggling comments for ERB and HTML within `.erb` files.

**Enjoy!**
