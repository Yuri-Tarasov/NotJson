/*
 * Project: NotJson (https://github.com/Yuri-Tarasov/NotJson)
 * Version: v1.0.12
 * File: njsUtil.js
 * Author: Yuri Tarasov
 */




function utf16to8(str) {
    var out, i, len, c;


    len = str.length;
    out = [];    
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out[out.length] = c;    
        } else if (c > 0x07FF) {
            out[out.length] = (0xE0 | ((c >> 12) & 0x0F));
            out[out.length] = (0x80 | ((c >>  6) & 0x3F));
            out[out.length] = (0x80 | ((c >>  0) & 0x3F));
        } else {
            out[out.length] = (0xC0 | ((c >>  6) & 0x1F));
            out[out.length] = (0x80 | ((c >>  0) & 0x3F));
        }
    }
    return new Uint8Array (out);
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
        c = str[i++];
        switch(c >> 4)
        { 
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
            out += String.fromCharCode(str[i-1]);
            break;
        case 12: case 13:
        // 110x xxxx   10xx xxxx
            char2 = str[i++];
            out  += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
        case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
            char2 = str[i++];
            char3 = str[i++];
            out  += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
            break;
        }
    }

    return out;
}


/*
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
}
*/

module.exports = {
    utf16to8 : utf16to8,
    utf8to16 : utf8to16 
};