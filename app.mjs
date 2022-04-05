import { WebSocketServer } from 'ws'
import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import assert from 'assert/strict'
import express from 'express'

// check for required environment variables
assert.notStrictEqual(process.env.SERIAL_PATH, undefined, 'Must provide SERIAL_PATH environment variable.')
assert.notStrictEqual(process.env.SERIAL_PORT, undefined, 'Must provide SERIAL_PORT environment variable.')
assert.notStrictEqual(process.env.WEBSOCKET_PORT, undefined, 'Must provide WEB_SOCKET_PORT environment variable.')
assert.notStrictEqual(process.env.PORT, undefined, 'Must provide PORT environment variable.')

const server = new WebSocketServer({ port: process.env.WEBSOCKET_PORT })
let sockets = []
server.on('connection', socket => {
	sockets.push(socket)
	socket.on('close', () => {
		sockets = sockets.filter( s => s !== socket )
	})
})

const serialport = new SerialPort({
	path: process.env.SERIAL_PATH,
	baudRate: Number(process.env.SERIAL_PORT),
	//parser: new ReadlineParser({ delimiter: '\n' })
})
const parser = serialport.pipe(new ReadlineParser({ delimiter: '\n' }))
parser.on('data', data => {
	sockets.forEach( socket => socket.send(data) )
})

const app = express()
app.use(express.static('./static/'))
app.listen(process.env.PORT, () => console.log(`HTTP server listening on port ${process.env.PORT}
Web Socket server listening on port ${process.env.WEBSOCKET_PORT}`))

