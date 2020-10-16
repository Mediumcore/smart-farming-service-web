// source: Certificate.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.Certificate', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Certificate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Certificate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.Certificate.displayName = 'proto.Certificate';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Certificate.prototype.toObject = function(opt_includeInstance) {
  return proto.Certificate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Certificate} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Certificate.toObject = function(includeInstance, msg) {
  var f, obj = {
    deviceid: jspb.Message.getFieldWithDefault(msg, 1, 0),
    url: jspb.Message.getFieldWithDefault(msg, 2, ""),
    qos: jspb.Message.getFieldWithDefault(msg, 3, 0),
    username: jspb.Message.getFieldWithDefault(msg, 4, ""),
    password: jspb.Message.getFieldWithDefault(msg, 5, ""),
    clientid: jspb.Message.getFieldWithDefault(msg, 6, ""),
    eventtopic: jspb.Message.getFieldWithDefault(msg, 7, ""),
    commandtopic: jspb.Message.getFieldWithDefault(msg, 8, ""),
    rtcvideoclientid: jspb.Message.getFieldWithDefault(msg, 9, ""),
    rtcvideoreqtopic: jspb.Message.getFieldWithDefault(msg, 10, ""),
    rtcvideoanstopic: jspb.Message.getFieldWithDefault(msg, 11, ""),
    rtcdataclientid: jspb.Message.getFieldWithDefault(msg, 12, ""),
    rtcdatareqtopic: jspb.Message.getFieldWithDefault(msg, 13, ""),
    rtcdataanstopic: jspb.Message.getFieldWithDefault(msg, 14, ""),
    iceserverurls: jspb.Message.getFieldWithDefault(msg, 15, ""),
    iceserverusername: jspb.Message.getFieldWithDefault(msg, 16, ""),
    iceservercredential: jspb.Message.getFieldWithDefault(msg, 17, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Certificate}
 */
proto.Certificate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Certificate;
  return proto.Certificate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Certificate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Certificate}
 */
proto.Certificate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setDeviceid(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setUrl(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setQos(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setUsername(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setPassword(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setClientid(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventtopic(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setCommandtopic(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.setRtcvideoclientid(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setRtcvideoreqtopic(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readString());
      msg.setRtcvideoanstopic(value);
      break;
    case 12:
      var value = /** @type {string} */ (reader.readString());
      msg.setRtcdataclientid(value);
      break;
    case 13:
      var value = /** @type {string} */ (reader.readString());
      msg.setRtcdatareqtopic(value);
      break;
    case 14:
      var value = /** @type {string} */ (reader.readString());
      msg.setRtcdataanstopic(value);
      break;
    case 15:
      var value = /** @type {string} */ (reader.readString());
      msg.setIceserverurls(value);
      break;
    case 16:
      var value = /** @type {string} */ (reader.readString());
      msg.setIceserverusername(value);
      break;
    case 17:
      var value = /** @type {string} */ (reader.readString());
      msg.setIceservercredential(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Certificate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Certificate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Certificate} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Certificate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDeviceid();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getUrl();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getQos();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = message.getUsername();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getPassword();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getClientid();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getEventtopic();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getCommandtopic();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getRtcvideoclientid();
  if (f.length > 0) {
    writer.writeString(
      9,
      f
    );
  }
  f = message.getRtcvideoreqtopic();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getRtcvideoanstopic();
  if (f.length > 0) {
    writer.writeString(
      11,
      f
    );
  }
  f = message.getRtcdataclientid();
  if (f.length > 0) {
    writer.writeString(
      12,
      f
    );
  }
  f = message.getRtcdatareqtopic();
  if (f.length > 0) {
    writer.writeString(
      13,
      f
    );
  }
  f = message.getRtcdataanstopic();
  if (f.length > 0) {
    writer.writeString(
      14,
      f
    );
  }
  f = message.getIceserverurls();
  if (f.length > 0) {
    writer.writeString(
      15,
      f
    );
  }
  f = message.getIceserverusername();
  if (f.length > 0) {
    writer.writeString(
      16,
      f
    );
  }
  f = message.getIceservercredential();
  if (f.length > 0) {
    writer.writeString(
      17,
      f
    );
  }
};


/**
 * optional int32 deviceId = 1;
 * @return {number}
 */
proto.Certificate.prototype.getDeviceid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setDeviceid = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string url = 2;
 * @return {string}
 */
proto.Certificate.prototype.getUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int32 qos = 3;
 * @return {number}
 */
proto.Certificate.prototype.getQos = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setQos = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional string username = 4;
 * @return {string}
 */
proto.Certificate.prototype.getUsername = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setUsername = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string password = 5;
 * @return {string}
 */
proto.Certificate.prototype.getPassword = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setPassword = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string clientId = 6;
 * @return {string}
 */
proto.Certificate.prototype.getClientid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setClientid = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string eventTopic = 7;
 * @return {string}
 */
proto.Certificate.prototype.getEventtopic = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setEventtopic = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * optional string commandTopic = 8;
 * @return {string}
 */
proto.Certificate.prototype.getCommandtopic = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setCommandtopic = function(value) {
  return jspb.Message.setProto3StringField(this, 8, value);
};


/**
 * optional string rtcVideoClientId = 9;
 * @return {string}
 */
proto.Certificate.prototype.getRtcvideoclientid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setRtcvideoclientid = function(value) {
  return jspb.Message.setProto3StringField(this, 9, value);
};


/**
 * optional string rtcVideoReqTopic = 10;
 * @return {string}
 */
proto.Certificate.prototype.getRtcvideoreqtopic = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setRtcvideoreqtopic = function(value) {
  return jspb.Message.setProto3StringField(this, 10, value);
};


/**
 * optional string rtcVideoAnsTopic = 11;
 * @return {string}
 */
proto.Certificate.prototype.getRtcvideoanstopic = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 11, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setRtcvideoanstopic = function(value) {
  return jspb.Message.setProto3StringField(this, 11, value);
};


/**
 * optional string rtcDataClientId = 12;
 * @return {string}
 */
proto.Certificate.prototype.getRtcdataclientid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 12, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setRtcdataclientid = function(value) {
  return jspb.Message.setProto3StringField(this, 12, value);
};


/**
 * optional string rtcDataReqTopic = 13;
 * @return {string}
 */
proto.Certificate.prototype.getRtcdatareqtopic = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 13, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setRtcdatareqtopic = function(value) {
  return jspb.Message.setProto3StringField(this, 13, value);
};


/**
 * optional string rtcDataAnsTopic = 14;
 * @return {string}
 */
proto.Certificate.prototype.getRtcdataanstopic = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 14, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setRtcdataanstopic = function(value) {
  return jspb.Message.setProto3StringField(this, 14, value);
};


/**
 * optional string iceServerUrls = 15;
 * @return {string}
 */
proto.Certificate.prototype.getIceserverurls = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 15, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setIceserverurls = function(value) {
  return jspb.Message.setProto3StringField(this, 15, value);
};


/**
 * optional string iceServerUsername = 16;
 * @return {string}
 */
proto.Certificate.prototype.getIceserverusername = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 16, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setIceserverusername = function(value) {
  return jspb.Message.setProto3StringField(this, 16, value);
};


/**
 * optional string iceServerCredential = 17;
 * @return {string}
 */
proto.Certificate.prototype.getIceservercredential = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 17, ""));
};


/**
 * @param {string} value
 * @return {!proto.Certificate} returns this
 */
proto.Certificate.prototype.setIceservercredential = function(value) {
  return jspb.Message.setProto3StringField(this, 17, value);
};


goog.object.extend(exports, proto);
