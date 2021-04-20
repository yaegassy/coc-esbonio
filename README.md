# coc-esbonio

[esbonio](https://pypi.org/project/esbonio/) ([Sphinx] Python Documentation Generator) language server extension for [coc.nvim](https://github.com/neoclide/coc.nvim)

## Features

- Completion
  - The Language Server can offer auto complete suggestions in a variety of contexts
- Diagnostics
  - The Language Server is able to catch some of the errors Sphinx outputs while building and publish them as diagnostic messages
    - (Build in the cache directory)

## Install

**CocInstall**:

`:CocInstall coc-esbonio`

**vim-plug**:

```vim
Plug 'yaegassy/coc-esbonio', {'do': 'yarn install --frozen-lockfile'}
```

## Detect: esbonio[lsp]

1. `esbonio.server.pythonPath` setting
1. Current python3 environment (e.g. venv or system global)
1. builtin `venv/bin/python` (Installation commands are also provided)

## Bult-in install

coc-esbonio allows you to create an extension-only "venv" and install "esbonio[lsp]".

The first time you use coc-esbonio, if esbonio[lsp] is not detected, you will be prompted to do a built-in installation.

You can also run the installation command manually.

```vim
:CocComannd esbonio.languageServer.install
```

## Activation Events

- `"onLanguage:rst"`
- `"workspaceContains:**/conf.py"`

## Configuration options

- `esbonio.enable`: Enable coc-esbonio extension, default: `true`
- `esbonio.server.pythonPath`: Custom python path with esbonio[lsp] installed (Absolute path), default: `""`
- `esbonio.server.logLevel`: The level of log message to show in the log, default: `"error"`
- `esbonio.server.logFilter`: A list of logger names to limit output from, type: array, default: `null`
- `esbonio.server.hideSphinxOutput`: Hide Sphinx build output from the Language Server log, default: `false`

## Commands

- `esbonio.languageServer.install`: Install/Upgrade Language Server
- `esbonio.languageServer.restart`: Restart Language Server

## Other Vim plugins for sphinx

- [stsewd/sphinx.nvim](https://github.com/stsewd/sphinx.nvim)

## Thanks

- [swyddfa/esbonio](https://github.com/swyddfa/esbonio)

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
