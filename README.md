# coc-esbonio

[esbonio](https://pypi.org/project/esbonio/) ([Sphinx] Python Documentation Generator) language server extension for [coc.nvim](https://github.com/neoclide/coc.nvim)

<img width="780" alt="coc-esbonio-demo" src="https://user-images.githubusercontent.com/188642/115412271-200fc880-a22f-11eb-845f-23fe736c0de3.gif">

## Features

- Completion
  - The Language Server can offer auto complete suggestions in a variety of contexts
- Diagnostics
  - The Language Server is able to catch some of the errors Sphinx outputs while building and publish them as diagnostic messages
    - (Build in the cache directory)
- Code Action by client feature
  - Section builder feature. [DEMO](https://github.com/yaegassy/coc-esbonio/pull/2)
  - Insert link feature. [DEMO](https://github.com/yaegassy/coc-esbonio/pull/10)

## Install

**CocInstall**:

`:CocInstall coc-esbonio`

**vim-plug**:

```vim
Plug 'yaegassy/coc-esbonio', {'do': 'yarn install --frozen-lockfile'}
```

## Detect: esbonio

1. `esbonio.server.pythonPath` setting
1. Current python3 environment (e.g. venv or system global)
1. builtin `venv/bin/python` or `venv/Scripts/python.exe` (Installation commands are also provided)

## Bult-in install

coc-esbonio allows you to create an extension-only "venv" and install "esbonio".

The first time you use coc-esbonio, if esbonio is not detected, you will be prompted to do a built-in installation.

You can also run the installation command manually.

```vim
:CocComannd esbonio.languageServer.install
```

## Activation Events

- `"onLanguage:rst"`
- `"workspaceContains:**/conf.py"`

## Configuration options

- `esbonio.enable`: Enable coc-esbonio extension, default: `true`
- `esbonio.enableFixDirectiveCompletion`: Enable fix patch for `Directive` completion issue, default: `true`
- `esbonio.client.sectionCharacterLevel1`: Character to be used in the Section builder (level1) of the code action, default: `"="`,
- `esbonio.client.sectionCharacterLevel2`: Character to be used in the Section builder (level2) of the code action, default: `"-"`,
- `esbonio.client.sectionCharacterLevel3`: Character to be used in the Section builder (level3) of the code action, default: `"~"`,
- `esbonio.server.pythonPath`: Custom python path with esbonio installed (Absolute path), default: `""`
- `esbonio.server.logLevel`: The level of log message to show in the log, default: `"error"`
- `esbonio.server.logFilter`: A list of logger names to limit output from, type: array, default: `null`
- `esbonio.server.hideSphinxOutput`: Hide Sphinx build output from the Language Server log, default: `false`
- `esbonio.sphinx.confDir`: The Language Server should be able to automatically find the folder containing your project's 'conf.py' file. However this setting can be used to force the Language Server to use a particular directory if required, default: `""`
- `esbonio.sphinx.srcDir`: The directory containing your rst source files. By default the Language Server will assume this is the same as `#esbonio.sphinx.srcDir#` but this opton can override this if necessary, default: `""`

## Commands

- `esbonio.languageServer.install`: Install/Upgrade Language Server
- `esbonio.languageServer.restart`: Restart Language Server

## Code Actions

**Example key mapping (Code Action related)**:

```vim
nmap <silent> ga <Plug>(coc-codeaction-line)
xmap <silent> ga <Plug>(coc-codeaction-selected)
nmap <silent> <leader>a <Plug>(coc-codeaction-cursor)
```

**Actions**:

- `Section builder (level1)`
- `Section builder (level2)`
- `Section builder (level3)`
- `Insert Link (cursol)`
- `Insert Inline Link (cursol)`
- `Insert Link (selected)`
- `Insert Inline Link (selected)`

## Other Vim plugins for sphinx

- [stsewd/sphinx.nvim](https://github.com/stsewd/sphinx.nvim)

## Thanks

- [swyddfa/esbonio](https://github.com/swyddfa/esbonio)

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
