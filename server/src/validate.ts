import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver'
import { hasDiagnosticRelatedInformationCapability } from './capabilities'
import { connection } from './connection'
import { TextDocument } from './documents'
import { DocumentSettings } from './settings'

export async function validateTextDocument(
  textDocument: TextDocument,
  settings: DocumentSettings
): Promise<void> {
  // The validator creates diagnostics for all uppercase words length 2 and more
  const text = textDocument.getText()
  const pattern = /\b[A-Z]{2,}\b/g
  let m: RegExpExecArray | null

  let problems = 0
  const diagnostics: Diagnostic[] = []
  while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
    problems++
    const diagnostic: Diagnostic = {
      severity: DiagnosticSeverity.Warning,
      range: {
        start: textDocument.positionAt(m.index),
        end: textDocument.positionAt(m.index + m[0].length),
      },
      message: `${m[0]} is all uppercase.`,
      source: 'ex',
    }
    if (hasDiagnosticRelatedInformationCapability) {
      diagnostic.relatedInformation = [
        {
          location: {
            uri: textDocument.uri,
            range: Object.assign({}, diagnostic.range),
          },
          message: 'Spelling matters',
        },
        {
          location: {
            uri: textDocument.uri,
            range: Object.assign({}, diagnostic.range),
          },
          message: 'Particularly for names',
        },
      ]
    }
    diagnostics.push(diagnostic)
  }

  // Send the computed diagnostics to VSCode.
  connection.sendDiagnostics({ uri: textDocument.uri, diagnostics })
}
