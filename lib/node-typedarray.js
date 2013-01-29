var oBuffer=Buffer;

var _ArrayBuffer_=true;

Buffer.prototype.readUInt=function() {
	switch (this.length) {
		case 1 : return this[0];
		case 2 : return this.readUInt16BE(0);
		case 4 : return this.readUInt32BE(0);
		return 0;
	};
};

//node.js buffer.js
//modified not to throw - see #3159
Buffer.prototype.slice = function(start, end) {
	if (end === undefined) end = this.length;
	if (end > this.length) {
		end = this.length;
		console.log('BUFFER : slice - bad formatted buffer ')
	};
	if (start > end) {
		start=end;
		console.log('BUFFER : slice - bad formatted buffer ')
	};

	return new oBuffer(this.parent, end - start, +start + this.offset);
};

Buffer.prototype.writeUInt=function(val) {
	switch (this.length) {
		case 1 : this.writeUInt8(val,0);break;
		case 2 : this.writeUInt16BE(val,0);break;
		case 4 : this.writeUInt32BE(val,0);break;
	};
	return this;
};

Buffer.prototype.map=function(buff) {
	var l=buff.length;
	for (var i=0;i<l;i++) {
		this[i]=buff[i];
	};
	this.fill(0,l);
};

//Array.prototype.concatBuffers = function() {
//	var str=[];
//	this.forEach(function(val) {
//		str.push(val.toString('hex'));
//	});
//	return new Buffer(str.join(''),'hex');
//};

Array.prototype.concatBuffers = function() {
	var str=[];
	var n=0;
	this.forEach(function(val) {
		n +=val.length;
	});
	var buff=new Buffer(n);
	var index=0;
	this.forEach(function(val) {
		var l=val.length;
		for (var i=0;i<l;i++) {
			buff[index]=val[i];
			index++;
		};
	});
	return buff;
};

if (_ArrayBuffer_) {
	Buffer=function(a,e) {
		if ((!e)&&(typeof(a)==='string')) {
			e='utf8';
		};
		if ((a instanceof Array) || ((!isNaN(a))&&(!e))) {
			return new Uint8Array(a);
		};
		if (e==='utf8') {
			return (new TextEncoder('utf-8')).encode(a);
		};
		if (e==='hex') {
			var b=new Uint8Array(a.length/2);
			var l=a.length;
			for (var i=0;i<l;i+=2) {
				b[i/2]=parseInt(a[i]+a[i+1],16);
			};
		};
		if (e==='binary') {
			var b=new Uint8Array(a.length);
			var l=b.length;
			for (var i=0;i<l;i++) {
				b[i]=a.charCodeAt(i);
			};
		};
		return b;
	};
	
	oBuffer.isBuffer=function(b) {
		return b instanceof oBuffer;
	};

	Uint8Array.prototype.slice=function(start,end) {
		return this.subarray(start,end);
	};
	
	Uint8Array.prototype.isBuffer=function(b) {
		return b instanceof Uint8Array;
	};
	
	Uint8Array.prototype.map=oBuffer.prototype.map;
	
	Uint8Array.prototype.readUInt=oBuffer.prototype.readUInt;
	
	Uint8Array.prototype.writeUInt=oBuffer.prototype.writeUInt;
	
	Uint8Array.prototype.fill=function(val,offset) {
		var l=this.length;
		for (var i=offset;i<l;i++) {
			this[i]=val;
		};
	};
	Uint8Array.prototype.readUInt16BE=function(o) {
		var a=new DataView(this.buffer);
		return a.getUint16(this.byteOffset+o);
	};
	
	Uint8Array.prototype.readUInt32BE=function(o) {
		var a=new DataView(this.buffer);
		return a.getUint32(this.byteOffset+o);
	};
	
	Uint8Array.prototype.writeUInt8=function(val,o) {
		this[o]=val;
	};
	
	Uint8Array.prototype.writeUInt16BE=function(val,o) {
		var a=new DataView(this.buffer);
		a.setUint16(this.byteOffset+o,val);
	};
	
	Uint8Array.prototype.writeUInt32BE=function(val,o) {
		var a=new DataView(this.buffer);
		a.setUint32(this.byteOffset+o,val);
	};
	
	Uint8Array.prototype.readUInt=oBuffer.prototype.readUInt;
	
	Uint8Array.prototype.writeUInt=oBuffer.prototype.writeUInt;
	
	Uint8Array.prototype.toString=function(enc) {
		var l=this.length;
		var r=[];
		if (enc==='utf8') {
			return (new TextDecoder('utf-8')).decode(this);
		};
		for (var i=0;i<l;i++) {
			switch (enc) {
				case 'hex' : var tmp=this[i].toString(16);r.push(tmp.length===1?('0'+tmp):tmp);break;
				case 'binary' : r.push(String.fromCharCode(this[i]));break;
			};
		};
		return r.join('');
	};
	
};


/*
These two functions below are not mandatory if your are in an environment that understands both Buffers and ArrayBuffers (ie node.js)
As long as node.js's Buffers have the same properties as ArrayBuffers and Typed Arrays, you can use both without any conversion 
(example : var a buf=Buffer_based_on_typed_array;socket.write(buf);)
They can be usefull in an environment that does not understand Buffers (browsers for example) or ArrayBuffers
*/
var ArrayBufferToBuffer= function(data) {
	if (data instanceof Uint8Array) {
		var a=new oBuffer(data.length);
		a.map(data);
		data=a;
	};
	return data;
};

var BufferToArrayBuffer= function(data) {
	if (!(data instanceof Uint8Array)) {
		var a=new Buffer(data.length);
		a.map(data);
		data=a;
	};
	return data;
};

/* Examples - note that 'new' is not required for ArrayBuffer/Typed Array here but used for compatibility reasons with Buffers or if you want to construct Typed Arrays differently

	var a=new Buffer('aabbcc','hex');

	var b=a.toString('hex');

	console.log(b);

	a=new Buffer('יטאן','utf8');

	console.log(a.toString('utf8'));

	console.log(a.toString('hex'));

	console.log(a.toString('binary'));

	console.log((new Buffer('c3a9c3a8c3a0c3af','hex')).toString('binary'));

	a=new Buffer('10','hex');

	console.log(a.length);

	console.log(a.readUInt());

	a.writeUInt(0x20);

	console.log(a.readUInt());

	a=new Buffer('1020','hex');

	console.log((a.readUInt()).toString(16));

	a.writeUInt(0x2030);

	console.log((a.readUInt()).toString(16));

	a=new Buffer('10203040','hex');

	console.log((a.readUInt()).toString(16));

	a.writeUInt(0x20304050);

	console.log((a.readUInt()).toString(16));

	a=new Buffer(10);

	a[0]=0x10;
	a[1]=0x20;

	console.log(a.toString('hex'));

	a.fill(0x50,3);

	console.log(a.toString('hex'));

	b=a.slice(2);

	console.log(b.toString('hex'));

	b=a.slice(2,4);

	console.log(b.toString('hex'));

	console.log(b.readUInt);

	b=new Buffer(20);

	b.map(a);

	console.log(b.toString('hex'));

	console.log(b instanceof Uint8Array);

	var b=new Buffer('000007000200030000','hex');

	//var b=new Uint8Array([0x000007000200030000]);

	console.log(b instanceof Uint8Array);

	//b.slice=function(start,end) {return this.buffer.slice(start,end);};

	var c=b.slice(5,7);

	//console.log(c);

	console.log(c instanceof Uint8Array);

	console.log(c.readUInt());

*/