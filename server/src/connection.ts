import { createConnection, ProposedFeatures } from 'vscode-languageserver/node'

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
export const connection = createConnection(ProposedFeatures.all)
