import {
  DidChangeConfigurationParams,
  TextDocumentChangeEvent,
} from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { hasConfigurationCapability } from './capabilities'
import { connection } from './connection'

export interface DocumentSettings {
  maxNumberOfProblems: number
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: DocumentSettings = { maxNumberOfProblems: 1000 }
let globalSettings: DocumentSettings = defaultSettings

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<DocumentSettings>> = new Map()

export function resetDocumentSettings(
  change: DidChangeConfigurationParams | TextDocumentChangeEvent<TextDocument>
) {
  if ('document' in change) {
    documentSettings.delete(change.document.uri)
  } else if (hasConfigurationCapability) {
    documentSettings.clear()
  } else {
    globalSettings = <DocumentSettings>(
      (change.settings.languageServerExample || defaultSettings)
    )
  }
}

export function getDocumentSettings(
  resource: string
): Thenable<DocumentSettings> {
  if (!hasConfigurationCapability) {
    return Promise.resolve(globalSettings)
  }
  let result = documentSettings.get(resource)
  if (!result) {
    result = connection.workspace.getConfiguration({
      scopeUri: resource,
      section: 'languageServerExample',
    })
    documentSettings.set(resource, result)
  }
  return result
}
