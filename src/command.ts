import { commands, Document, ExtensionContext, Range, TextEdit, workspace, window, WorkspaceEdit } from 'coc.nvim';

// **MEMO**:
// Since coc.nvim does not have an vscode.EndOfLine equivalent,
// I implemented it using Vim way.
//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getEOLSequence(): Promise<string> {
  // default: '\n'
  const eol = '\n';

  const fileFormat = await workspace.nvim.getOption('fileformat');
  switch (fileFormat) {
    case 'unix':
      return '\n';
    case 'dos':
      return '\r\n';
  }

  return eol;
}

export class EditorCommands {
  public static INSERT_LINK = 'esbonio.insert.link';
  public static INSERT_INLINE_LINK = 'esbonio.insert.inlineLink';

  ////LINK_PATTERN = /\.\.[ ]_\S+:[ ]\S+\n/;
  LINK_PATTERN = /\.\.[ ]_\S+:[ ]\S+$/;

  constructor() {}

  /**
   * Insert link.
   */
  async insertLink(range?: Range) {
    const doc = await workspace.document;

    const link = await this.getLinkInfo(doc, range);
    if (!link.url || !link.label) {
      return;
    }

    // MEMO: Set '\n' explicitly
    //const eol = getEOLSequence();
    const eol = '\n';

    const lastLine = doc.lineCount - 1;
    let lineText = doc.getline(lastLine);
    const lastCharacter = lineText.length;

    let prefix = '';
    if (lineText.length === 0) {
      lineText = doc.getline(doc.lineCount - 2);
    } else {
      prefix = eol;
    }

    if (!this.LINK_PATTERN.test(lineText)) {
      prefix += eol;
    }

    const linkRef = `\`${link.label}\`_`;
    const linkDef = `${prefix}.. _${link.label}: ${link.url}${eol}`;

    if (!range) {
      const state = await workspace.getCurrentState();
      range = Range.create(state.position, state.position);
    }

    const edit: WorkspaceEdit = {
      changes: {
        [doc.uri]: [
          TextEdit.replace(range, linkRef),
          TextEdit.insert({ line: lastLine, character: lastCharacter }, linkDef),
        ],
      },
    };

    await workspace.applyEdit(edit);
  }

  /**
   * Insert inline link.
   */
  public async insertInlineLink(range?: Range) {
    const doc = await workspace.document;

    const link = await this.getLinkInfo(doc, range);
    if (!link.url || !link.label) {
      return;
    }

    const inlineLink = `\`${link.label} <${link.url}>\`__`;

    if (!range) {
      const state = await workspace.getCurrentState();
      range = Range.create(state.position, state.position);
    }

    const edit: WorkspaceEdit = {
      changes: {
        [doc.uri]: [TextEdit.replace(range, inlineLink)],
      },
    };

    await workspace.applyEdit(edit);
  }

  /**
   * Register all the commands this class provides
   */
  register(context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand(EditorCommands.INSERT_INLINE_LINK, this.insertInlineLink, this, true),
    );
    context.subscriptions.push(commands.registerCommand(EditorCommands.INSERT_LINK, this.insertLink, this, true));
  }

  /**
   * Helper function that returns the url to be linked and its label
   */
  private async getLinkInfo(doc: Document, range?: Range) {
    let label: string;
    const url = await window.requestInput('Link URL', 'https://');

    if (!range) {
      const state = await workspace.getCurrentState();
      range = Range.create(state.position, state.position);
      label = await window.requestInput('Link Text', '');
    } else {
      label = doc.textDocument.getText(range);
    }

    return {
      label: label,
      url: url,
    };
  }
}
