import serial
import asyncio
import websockets
import io
import time

PORT=8080
WEBSOCKET_PORT=5000
SERIAL_BAUDRATE=9600
SERIAL_PORT='COM3'

ser = serial.Serial()
ser.baudrate = SERIAL_BAUDRATE
ser.port = SERIAL_PORT
ser.open()

sio = io.TextIOWrapper(io.BufferedRWPair(ser, ser))

async def handler(websocket):
	while True:
		time.sleep(0.5)
		input_value = str(sio.readline()).rstrip()
		print(input_value)
		await websocket.send(input_value)

async def main():
	async with websockets.serve(handler, 'localhost', WEBSOCKET_PORT):
		await asyncio.Future()

asyncio.run(main())