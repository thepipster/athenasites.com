// The MIT License

// Copyright (c) 2008 Tjeerd Jan 'Aidamina' van der Molen
// http://jsocket.googlecode.com

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

package
{
	public class jSocket 
	{		
		import flash.external.ExternalInterface;
		import flash.events.*;
		import flash.net.Socket;
		import flash.utils.ByteArray;
		private var socket:Socket;
		private var id:String;
				
		private function add(name:String, f:Function):void{
			ExternalInterface.addCallback(name, f);
		}
		
		public function jSocket(id:String){
			this.id = id;
			socket = new Socket();
			socket.addEventListener("close", onClose);
			socket.addEventListener("connect", onConnect);
			socket.addEventListener("ioError", onError);
			socket.addEventListener("securityError", onSecurityError);
			socket.addEventListener("socketData", onData);
			
			add("connect", connect);
			add("close", close);
			add("flush", flush);
						
			// Generic write
			add("write", write);			
			
			// Boolean
			add("writeBoolean", writeBoolean);
			add("readBoolean", readBoolean);
			
			// Byte
			add("writeByte", writeByte);
			add("readByte", writeByte);
			add("writeBytes", writeBytes);
			add("readBytes", readBytes);
			
			// Short
			add("writeShort", writeShort);
			add("readShort", readShort);
			
			// Int
			add("writeInt", writeInt);
			add("readInt", readInt);
			
			// Uint
			add("writeUnsignedInt", writeUnsignedInt);
			add("readUnsignedInt", readUnsignedInt);
			
			// Float
			add("writeFloat", writeFloat);
			add("readFloat", readFloat);
			
			// Double
			add("writeDouble", writeDouble);
			add("readDouble", readDouble);
			
			// MultiByte
			add("writeMultiByte", writeMultiByte);
			add("readMultiByte", readMultiByte);
			
			// UTF
			add("writeUTFBytes", writeUTFBytes);
			add("readUTFBytes", readUTFBytes);
			add("writeUTF", writeUTF);
			add("readUTF", readUTF);
			
			// Array
			add("writeArray", writeArray);
			
			// Object
			add("writeObject", writeObject);
			add("readObject", readObject);			
			
			// Properties
			add("setObjectEncoding", setObjectEncoding);
			add("getObjectEncoding", getObjectEncoding);
			
			add("setEndian", setEndian);
			add("getEndian", getEndian);
			
			add("getBytesAvailable", getBytesAvailable);			
			
			ExternalInterface.call("jSocket_onInit",id);			
		}
		
		public function connect(host:String, port:int):void{
			socket.connect(host, port);	
		}
		
		public function close():void{
			socket.close();
		}
		
		public function flush():void{
			socket.flush();
		}
		
		private function onConnect(event:Event):void{
			ExternalInterface.call("jSocket_onConnect", id);
		}
		
		private function onError(event:IOErrorEvent):void{
			ExternalInterface.call("jSocket_onError", id, event.text);
		}
		
		private function onSecurityError(event:SecurityErrorEvent):void{
			ExternalInterface.call("jSocket_onError", id, event.text);
		}
		
		private function onClose(event:Event):void{
			ExternalInterface.call("jSocket_onClose", id);
		}
		
		private function onData(event:ProgressEvent):void{
			ExternalInterface.call("jSocket_onData", id, event.bytesLoaded);
		}
		
		// Generic write
		public function write(data):void{
			switch(typeof(data))
			{
				case Boolean:
				socket.writeBoolean(data);
				break;
				
				case int:
				socket.writeInt(data);
				break;
				
				case uint:
				socket.writeUnsignedInt(data);
				break;
				
				case Number:
				socket.writeDouble(data);
				break;
				
				case String:
				socket.writeUTF(data);
				break;
				
				case Array:
				writeArray(data);
				break;
				
				case Object:
				socket.writeObject(data);
				break;
				
				default:
				throw "Unknown type";				
			}			
		}
				
		// Boolean
		public function writeBoolean(data:Boolean):void{
			socket.writeBoolean(data);
		}
		
		public function readBoolean():Boolean{
			return socket.readBoolean();
		}
		
		// Byte
		public function writeByte(data:int):void{
			socket.writeByte(data);
		}
		
		public function readByte():int{
			return socket.readByte();
		}
						
		public function writeBytes(array:Array, offset:uint, length:uint):void{
			var buffer:ByteArray = new ByteArray();			
			for each ( var o:int in array )
				buffer.writeByte(o);			
			socket.writeBytes(buffer, offset, length);
		}
		
		public function readBytes(length:uint):Array{
			var bytes:ByteArray = new ByteArray();			
			socket.readBytes(bytes, 0, length);
			var array:Array = new Array();
			bytes.position = 0;
			while (bytes.bytesAvailable > 0)			
				array.push(bytes.readByte());				
			return array;
		}
		
		// Short
		public function writeShort(data:int):void{
			socket.writeShort(data);
		}
		
		public function readShort():int{
			return socket.readShort();
		}
		
		// Int
		public function writeInt(data:int):void{
			socket.writeInt(data);
		}
		
		public function readInt():int{
			return socket.readInt();
		}
		
		// Uint
		public function writeUnsignedInt(data:uint):void{
			socket.writeUnsignedInt(data);
		}
		
		public function readUnsignedInt():uint{
			return socket.readUnsignedInt();
		}
		
		// Float
		public function writeFloat(data:Number):void{
			socket.writeFloat(data);
		}
		
		public function readFloat():Number{
			return socket.readFloat();
		}
		
		// Double
		public function writeDouble(data:Number):void{
			socket.writeDouble(data);
		}
		
		public function readDouble():Number{
			return socket.readDouble();
		}
		
		// MultiByte
		public function writeMultiByte	(value:String, charSet:String):void{
			socket.writeMultiByte(value, charSet);
		}
		
		public function readMultiByte(length:uint,charSet:String):String{
			return socket.readMultiByte(length, charSet);
		}
		
		//UTF
		public function writeUTFBytes(data:String):void{
			socket.writeUTFBytes(data);
		}
		
		public function readUTFBytes(length:int):String{
			return socket.readUTFBytes(length);
		}
		
		public function writeUTF(data:String):void{
			socket.writeUTF(data);
		}
		
		public function readUTF():String{
			return socket.readUTF();
		}
		
		// Array
		public function writeArray(array:Array):void{			
			for each ( var o in array )
				this.write(o);			
		}
		
		// Object
		public function writeObject(data:Object):void{
			socket.writeObject(data);
		}
		
		public function readObject():Object{
			return socket.readObject();			
		}
		
		// Properties
		public function setObjectEncoding(value:uint):void{			
			socket.objectEncoding = value;			
		}
		
		public function getObjectEncoding():uint{
			return socket.objectEncoding;			
		}
		
		public function setEndian(value:String):void{			
			socket.endian = value;			
		}
		
		public function getEndian():String{
			return socket.endian;
		}
		
		public function getBytesAvailable():uint{
			return socket.bytesAvailable;
		}		
	}	
}