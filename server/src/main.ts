import { CompletionItemKind } from 'vscode-languageserver/node'
import { connection } from './connection'
import { documents } from './documents'
import { getDocumentSettings, resetDocumentSettings } from './settings'
import { validateTextDocument } from './validate'

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(({ document }) => {
  getDocumentSettings(document.uri).then(settings => {
    return validateTextDocument(document, settings)
  })
})

connection.onDidChangeConfiguration(change => {
  resetDocumentSettings(change)

  // Revalidate all open text documents
  for (const document of documents.all()) {
    getDocumentSettings(document.uri).then(settings => {
      return validateTextDocument(document, settings)
    })
  }
})

// Only keep settings for open documents
documents.onDidClose(change => {
  resetDocumentSettings(change)
})

connection.onDidChangeWatchedFiles(_change => {
  // Monitored files have change in VSCode
  connection.console.log('We received an file change event')
})

// This handler provides the initial list of the completion items.
connection.onCompletion(_position => {
  // The pass parameter contains the position of the text document in
  // which code complete got requested. For the example we ignore this
  // info and always provide the same completion items.
  return [
    {
      label: 'TypeScript',
      kind: CompletionItemKind.Text,
      data: 1,
    },
    {
      label: 'JavaScript',
      kind: CompletionItemKind.Text,
      data: 2,
    },
  ]
})

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(item => {
  if (item.data === 1) {
    item.detail = 'TypeScript details'
    item.documentation = 'TypeScript documentation'
  } else if (item.data === 2) {
    item.detail = 'JavaScript details'
    item.documentation = 'JavaScript documentation'
  }
  return item
})

documents.listen(connection)
connection.listen()
