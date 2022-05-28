# coc-esbonio

[esbonio](https://pypi.org/project/esbonio/) ([Sphinx] Python Documentation Generator) language server extension for [coc.nvim](https://github.com/neoclide/coc.nvim)

<img width="780" alt="coc-esbonio-demo" src="https://user-images.githubusercontent.com/188642/115412271-200fc880-a22f-11eb-845f-23fe736c0de3.gif">

## Features

- Completion
  - The language server implements [textDocument/completion](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_completion) and can offer suggestions in a variety of contexts.
- Definition
  - The language server implements [textDocument/definition](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_definition) to provide the location of objects linked to by certain roles. Currently only the `:ref:` and `:doc:` roles are supported.
- Diagnostics
  - Using [textDocument/publishDiagnostics](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_publishDiagnostics) the language server is able to report Sphinx errors that are reported during builds.
- Document Symbols
  - The language server implements [textDocument/documentSymbol](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_documentSymbol) which powers features like the "Outline" view in coc.nvim.
- Hover
  - The language server implements [textDocument/hover](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_hover) to provide easy access to documentation for roles and directives.
- Code Action by client side feature
  - Section builder feature. [DEMO](https://github.com/yaegassy/coc-esbonio/pull/2)
  - Insert link feature. [DEMO](https://github.com/yaegassy/coc-esbonio/pull/10)
- Built-in installer by client side feature
  - **See**:
    - <https://github.com/yaegassy/coc-esbonio#detect-esbonio>
    - <https://github.com/yaegassy/coc-esbonio#bult-in-install>

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
:CocCommand esbonio.languageServer.install
```

## TIPS

esbonio's language server can also handle python file docstrings. `coc-esbonio` will activate the extension when the `rst` file is opened. If you want `coc-esbonio` to work with `python` file as well, you must first open the `rst` file.

## Configuration options

- `esbonio.enable`: Enable coc-esbonio extension, default: `true`
- `esbonio.client.sectionCharacterLevel1`: Character to be used in the Section builder (level1) of the code action, default: `"="`,
- `esbonio.client.sectionCharacterLevel2`: Character to be used in the Section builder (level2) of the code action, default: `"-"`,
- `esbonio.client.sectionCharacterLevel3`: Character to be used in the Section builder (level3) of the code action, default: `"~"`,
- `esbonio.server.enabled`: Enable/Disable the language server, default: `true`
- `esbonio.server.enabledInPyFiles`: Enable/Disable the language server in Python files, default: `true`
- `esbonio.server.startupModule`: The module (or script) to use to launch the server, default: `esbonio`
- `esbonio.server.excludedModules`: A list of modules to exclude from the server's configuration, default: `[]`
- `esbonio.server.includedModules`: A list of additional modules to include in the server's configuration, default: `[]`
- `esbonio.server.logLevel`: The level of log message to show in the log, default: `"error"`
- `esbonio.server.logFilter`: A list of logger names to limit output from, type: array, default: `null`
- `esbonio.server.pythonPath`: The path to the Python interpreter to use when running the Langague Server.By default this extension will try to use the interpreter configured via the Python Extension. If you do not use the Python Extension or you wish to use a different environment, then this option can be used to override the default behavior., default: `""`
- `esbonio.server.hideSphinxOutput`: Hide Sphinx build output from the Language Server log, default: `false`
  - This option will be removed when the language server reaches v1.0. The `esbonio.sphinx.quiet` and `esbonio.sphinx.silent` options should be used instead.
- `esbonio.sphinx.buildDir`: The directory in which to store Sphinx's build output.By default the Language Server will store any build files in a storage area provided by coc.nvim, this option allows you to override this to be a directory of your choosing e.g. your local `_build/` directory, default: `null`
- `esbonio.sphinx.builderName`: The builder to use when building the documentation, default: `"html"`
- `esbonio.sphinx.confDir`: The Language Server should be able to automatically find the folder containing your project's 'conf.py' file. However this setting can be used to force the Language Server to use a particular directory if required, default: `""`
- `esbonio.sphinx.configOverrides`: Any conf.py options to override, default: `{}`
- `esbonio.sphinx.doctreeDir`: The directory in which to store Sphinx's doctree cache, default: `null`
- `esbonio.sphinx.forceFullBuild`: Force a full build of the documentation project on server startup, default: `false`
- `esbonio.sphinx.keepGoing`: Continue building when errors generated from warnings are encountered, default: `false`
- `esbonio.sphinx.makeMode`: Flag indicating if the language server should be have like a `sphinx-build -M ...` command, default: true
- `esbonio.sphinx.numJobs`: The number of parallel jobs to use during a Sphinx build, default: `1`
  - A value of `0` is equivalent to passing `-j auto` to a `sphinx-build` command.
  - A value of `1` will disable parallel processing
- `esbonio.sphinx.quiet`: Hide standard Sphinx output messages, default: `false`
- `esbonio.sphinx.silent`: Hide all Sphinx output, default: `false`
- `esbonio.sphinx.srcDir`: The directory containing your rst source files. By default the Language Server will assume this is the same as `#esbonio.sphinx.confDir#` but this opton can override this if necessary, default: `""`
- `esbonio.sphinx.tags`: Tags to enable during a build, default: `[]`
- `esbonio.sphinx.verbosity`: The verbosity of Sphinx's output, default: `0`
- `esbonio.sphinx.warningIsError`: Treat any warnings as errors, default: `false`
- `esbonio.trace.server`: Traces the communication between coc.nvim and the esbonio language server, valid option: ["off", "messages", "verbose"], default: `"off"`

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

## Thanks

- [swyddfa/esbonio](https://github.com/swyddfa/esbonio)

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
