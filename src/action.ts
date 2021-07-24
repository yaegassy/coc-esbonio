import {
  CodeAction,
  CodeActionContext,
  CodeActionProvider,
  Document,
  Position,
  Range,
  TextEdit,
  TextDocument,
  workspace,
} from 'coc.nvim';

import { EditorCommands } from './command';
import { multibyteLength } from './util';

export class EsbonioCodeActionProvider implements CodeActionProvider {
  editorCommands: EditorCommands;

  constructor() {
    this.editorCommands = new EditorCommands();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async provideCodeActions(document: TextDocument, range: Range, context: CodeActionContext) {
    const extensionConfig = workspace.getConfiguration('esbonio');

    // MEMO:
    // -----
    // Use the recommended section character from
    // http://docutils.sourceforge.net/docs/ref/rst/restructuredtext.html#sections,
    const sectionCharacterLevel1 = extensionConfig.get<string>('client.sectionCharacterLevel1', '=');
    const sectionCharacterLevel2 = extensionConfig.get<string>('client.sectionCharacterLevel2', '-');
    const sectionCharacterLevel3 = extensionConfig.get<string>('client.sectionCharacterLevel3', '~');

    const codeActions: CodeAction[] = [];
    const doc = workspace.getDocument(document.uri);

    /** Line | Section builder (level1) */
    if (this.lineRange(range)) {
      const thisLineContent = doc.getline(range.start.line);
      const contentLength = multibyteLength(thisLineContent);
      const sectionLineString = sectionCharacterLevel1.repeat(contentLength) + '\n';

      const edit = TextEdit.insert(Position.create(range.start.line + 1, range.start.character), sectionLineString);

      codeActions.push({
        title: 'Section builder (level1)',
        edit: {
          changes: {
            [doc.uri]: [edit],
          },
        },
      });
    }

    /** Line | Section builder (level2) */
    if (this.lineRange(range)) {
      const thisLineContent = doc.getline(range.start.line);
      const contentLength = multibyteLength(thisLineContent);
      const sectionLineString = sectionCharacterLevel2.repeat(contentLength) + '\n';

      const edit = TextEdit.insert(Position.create(range.start.line + 1, range.start.character), sectionLineString);

      codeActions.push({
        title: 'Section builder (level2)',
        edit: {
          changes: {
            [doc.uri]: [edit],
          },
        },
      });
    }

    /** Line | Section builder (level3) */
    if (this.lineRange(range)) {
      const thisLineContent = doc.getline(range.start.line);
      const contentLength = multibyteLength(thisLineContent);
      const sectionLineString = sectionCharacterLevel3.repeat(contentLength) + '\n';

      const edit = TextEdit.insert(Position.create(range.start.line + 1, range.start.character), sectionLineString);

      codeActions.push({
        title: 'Section builder (level3)',
        edit: {
          changes: {
            [doc.uri]: [edit],
          },
        },
      });
    }

    /** Cursol | Insert Link & Insert Inline Link */
    if (range.start.line === range.end.line && range.start.character === range.end.character) {
      codeActions.push({
        title: 'Insert Link (cursol)',
        command: {
          title: 'Insert Link (cursol)',
          command: EditorCommands.INSERT_LINK,
          arguments: [],
        },
      });

      codeActions.push({
        title: 'Insert Inline Link (cursol)',
        command: {
          title: 'Insert Inline Link (cursol)',
          command: EditorCommands.INSERT_INLINE_LINK,
          arguments: [],
        },
      });
    }

    /** Line & Range | Insert Link & Insert Inline Link */
    if (
      range.start.line === range.end.line &&
      range.start.character !== range.end.character &&
      !this.wholeRange(doc, range)
    ) {
      codeActions.push({
        title: 'Insert Link (line & range)',
        command: {
          title: 'Insert Link (line & range)',
          command: EditorCommands.INSERT_LINK,
          arguments: [range],
        },
      });

      codeActions.push({
        title: 'Insert Inline Link (line & range)',
        command: {
          title: 'Insert Inline Link (line & range)',
          command: EditorCommands.INSERT_INLINE_LINK,
          arguments: [range],
        },
      });
    }

    return codeActions;
  }

  private wholeRange(doc: Document, range: Range): boolean {
    const whole = Range.create(0, 0, doc.lineCount, 0);
    return (
      whole.start.line === range.start.line &&
      whole.start.character === range.start.character &&
      whole.end.line === range.end.line &&
      whole.end.character === whole.end.character
    );
  }

  private lineRange(r: Range): boolean {
    return (
      (r.start.line + 1 === r.end.line && r.start.character === 0 && r.end.character === 0) ||
      (r.start.line === r.end.line && r.start.character === 0)
    );
  }
}
