import { TextDocument } from 'vscode-languageserver-textdocument'
import { TextDocuments } from 'vscode-languageserver/node'

export type { TextDocument }

// Create a simple text document manager.
export const documents: TextDocuments<TextDocument> = new TextDocuments(
  TextDocument
)
