import {
  CodeAction,
  CodeActionContext,
  CodeActionProvider,
  Position,
  Range,
  TextEdit,
  TextDocument,
  workspace,
} from 'coc.nvim';

import { multibyteLength } from './util';

export class EsbonioCodeActionProvider implements CodeActionProvider {
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

    /** Line | level1 */
    if (range.start.line === range.end.line && range.start.character === 0) {
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

    /** Line | level2 */
    if (range.start.line === range.end.line && range.start.character === 0) {
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

    /** Line | level3 */
    if (range.start.line === range.end.line && range.start.character === 0) {
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

    return codeActions;
  }
}
