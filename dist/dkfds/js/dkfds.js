(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DKFDS = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * array-foreach
 *   Array#forEach ponyfill for older browsers
 *   (Ponyfill: A polyfill that doesn't overwrite the native method)
 * 
 * https://github.com/twada/array-foreach
 *
 * Copyright (c) 2015-2016 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/twada/array-foreach/blob/master/MIT-LICENSE
 */
'use strict';

module.exports = function forEach(ary, callback, thisArg) {
    if (ary.forEach) {
        ary.forEach(callback, thisArg);
        return;
    }
    for (var i = 0; i < ary.length; i += 1) {
        callback.call(thisArg, ary[i], i, ary);
    }
};

},{}],2:[function(require,module,exports){
"use strict";

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in window.self) {

	// Full polyfill for browsers with no classList support
	// Including IE < Edge missing SVGElement.classList
	if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {

		(function (view) {

			"use strict";

			if (!('Element' in view)) return;

			var classListProp = "classList",
			    protoProp = "prototype",
			    elemCtrProto = view.Element[protoProp],
			    objCtr = Object,
			    strTrim = String[protoProp].trim || function () {
				return this.replace(/^\s+|\s+$/g, "");
			},
			    arrIndexOf = Array[protoProp].indexOf || function (item) {
				var i = 0,
				    len = this.length;
				for (; i < len; i++) {
					if (i in this && this[i] === item) {
						return i;
					}
				}
				return -1;
			}
			// Vendors: please allow content code to instantiate DOMExceptions
			,
			    DOMEx = function DOMEx(type, message) {
				this.name = type;
				this.code = DOMException[type];
				this.message = message;
			},
			    checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
				if (token === "") {
					throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
				}
				if (/\s/.test(token)) {
					throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
				}
				return arrIndexOf.call(classList, token);
			},
			    ClassList = function ClassList(elem) {
				var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
				    classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
				    i = 0,
				    len = classes.length;
				for (; i < len; i++) {
					this.push(classes[i]);
				}
				this._updateClassName = function () {
					elem.setAttribute("class", this.toString());
				};
			},
			    classListProto = ClassList[protoProp] = [],
			    classListGetter = function classListGetter() {
				return new ClassList(this);
			};
			// Most DOMException implementations don't allow calling DOMException's toString()
			// on non-DOMExceptions. Error's toString() is sufficient here.
			DOMEx[protoProp] = Error[protoProp];
			classListProto.item = function (i) {
				return this[i] || null;
			};
			classListProto.contains = function (token) {
				token += "";
				return checkTokenAndGetIndex(this, token) !== -1;
			};
			classListProto.add = function () {
				var tokens = arguments,
				    i = 0,
				    l = tokens.length,
				    token,
				    updated = false;
				do {
					token = tokens[i] + "";
					if (checkTokenAndGetIndex(this, token) === -1) {
						this.push(token);
						updated = true;
					}
				} while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.remove = function () {
				var tokens = arguments,
				    i = 0,
				    l = tokens.length,
				    token,
				    updated = false,
				    index;
				do {
					token = tokens[i] + "";
					index = checkTokenAndGetIndex(this, token);
					while (index !== -1) {
						this.splice(index, 1);
						updated = true;
						index = checkTokenAndGetIndex(this, token);
					}
				} while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.toggle = function (token, force) {
				token += "";

				var result = this.contains(token),
				    method = result ? force !== true && "remove" : force !== false && "add";

				if (method) {
					this[method](token);
				}

				if (force === true || force === false) {
					return force;
				} else {
					return !result;
				}
			};
			classListProto.toString = function () {
				return this.join(" ");
			};

			if (objCtr.defineProperty) {
				var classListPropDesc = {
					get: classListGetter,
					enumerable: true,
					configurable: true
				};
				try {
					objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
				} catch (ex) {
					// IE 8 doesn't support enumerable:true
					// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
					// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
					if (ex.number === undefined || ex.number === -0x7FF5EC54) {
						classListPropDesc.enumerable = false;
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					}
				}
			} else if (objCtr[protoProp].__defineGetter__) {
				elemCtrProto.__defineGetter__(classListProp, classListGetter);
			}
		})(window.self);
	}

	// There is full or partial native classList support, so just check if we need
	// to normalize the add/remove and toggle APIs.

	(function () {
		"use strict";

		var testElement = document.createElement("_");

		testElement.classList.add("c1", "c2");

		// Polyfill for IE 10/11 and Firefox <26, where classList.add and
		// classList.remove exist but support only one argument at a time.
		if (!testElement.classList.contains("c2")) {
			var createMethod = function createMethod(method) {
				var original = DOMTokenList.prototype[method];

				DOMTokenList.prototype[method] = function (token) {
					var i,
					    len = arguments.length;

					for (i = 0; i < len; i++) {
						token = arguments[i];
						original.call(this, token);
					}
				};
			};
			createMethod('add');
			createMethod('remove');
		}

		testElement.classList.toggle("c3", false);

		// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
		// support the second argument.
		if (testElement.classList.contains("c3")) {
			var _toggle = DOMTokenList.prototype.toggle;

			DOMTokenList.prototype.toggle = function (token, force) {
				if (1 in arguments && !this.contains(token) === !force) {
					return force;
				} else {
					return _toggle.call(this, token);
				}
			};
		}

		testElement = null;
	})();
}

},{}],3:[function(require,module,exports){
'use strict';

require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;

},{"../../modules/_core":10,"../../modules/es6.array.from":57,"../../modules/es6.string.iterator":59}],4:[function(require,module,exports){
'use strict';

require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/_core":10,"../../modules/es6.object.assign":58}],5:[function(require,module,exports){
'use strict';

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],6:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":26}],7:[function(require,module,exports){
'use strict';

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      }
    }return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":48,"./_to-iobject":50,"./_to-length":51}],8:[function(require,module,exports){
'use strict';

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
  // builtinTag case
  : ARG ? cof(O)
  // ES3 arguments fallback
  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":9,"./_wks":55}],9:[function(require,module,exports){
"use strict";

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],10:[function(require,module,exports){
'use strict';

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],11:[function(require,module,exports){
'use strict';

var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
};

},{"./_object-dp":35,"./_property-desc":42}],12:[function(require,module,exports){
'use strict';

// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () /* ...args */{
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":5}],13:[function(require,module,exports){
"use strict";

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],14:[function(require,module,exports){
'use strict';

// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_fails":18}],15:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":19,"./_is-object":26}],16:[function(require,module,exports){
'use strict';

// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

},{}],17:[function(require,module,exports){
'use strict';

var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":10,"./_ctx":12,"./_global":19,"./_hide":21,"./_redefine":43}],18:[function(require,module,exports){
"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],19:[function(require,module,exports){
'use strict';

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
// eslint-disable-next-line no-new-func
: Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],20:[function(require,module,exports){
"use strict";

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],21:[function(require,module,exports){
'use strict';

var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":14,"./_object-dp":35,"./_property-desc":42}],22:[function(require,module,exports){
'use strict';

var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":19}],23:[function(require,module,exports){
'use strict';

module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_descriptors":14,"./_dom-create":15,"./_fails":18}],24:[function(require,module,exports){
'use strict';

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":9}],25:[function(require,module,exports){
'use strict';

// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":31,"./_wks":55}],26:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
};

},{}],27:[function(require,module,exports){
'use strict';

// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":6}],28:[function(require,module,exports){
'use strict';

var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () {
  return this;
});

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":21,"./_object-create":34,"./_property-desc":42,"./_set-to-string-tag":44,"./_wks":55}],29:[function(require,module,exports){
'use strict';

var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function returnThis() {
  return this;
};

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":17,"./_hide":21,"./_iter-create":28,"./_iterators":31,"./_library":32,"./_object-gpo":38,"./_redefine":43,"./_set-to-string-tag":44,"./_wks":55}],30:[function(require,module,exports){
'use strict';

var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {/* empty */}

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () {
      return { done: safe = true };
    };
    arr[ITERATOR] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {/* empty */}
  return safe;
};

},{"./_wks":55}],31:[function(require,module,exports){
"use strict";

module.exports = {};

},{}],32:[function(require,module,exports){
"use strict";

module.exports = false;

},{}],33:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)

var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
    }
  }return T;
} : $assign;

},{"./_fails":18,"./_iobject":24,"./_object-gops":37,"./_object-keys":40,"./_object-pie":41,"./_to-object":52}],34:[function(require,module,exports){
'use strict';

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function Empty() {/* empty */};
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;
  while (i--) {
    delete _createDict[PROTOTYPE][enumBugKeys[i]];
  }return _createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = _createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":6,"./_dom-create":15,"./_enum-bug-keys":16,"./_html":22,"./_object-dps":36,"./_shared-key":45}],35:[function(require,module,exports){
'use strict';

var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":6,"./_descriptors":14,"./_ie8-dom-define":23,"./_to-primitive":53}],36:[function(require,module,exports){
'use strict';

var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) {
    dP.f(O, P = keys[i++], Properties[P]);
  }return O;
};

},{"./_an-object":6,"./_descriptors":14,"./_object-dp":35,"./_object-keys":40}],37:[function(require,module,exports){
"use strict";

exports.f = Object.getOwnPropertySymbols;

},{}],38:[function(require,module,exports){
'use strict';

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }return O instanceof Object ? ObjectProto : null;
};

},{"./_has":20,"./_shared-key":45,"./_to-object":52}],39:[function(require,module,exports){
'use strict';

var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) {
    if (key != IE_PROTO) has(O, key) && result.push(key);
  } // Don't enum bug & hidden keys
  while (names.length > i) {
    if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
  }return result;
};

},{"./_array-includes":7,"./_has":20,"./_shared-key":45,"./_to-iobject":50}],40:[function(require,module,exports){
'use strict';

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":16,"./_object-keys-internal":39}],41:[function(require,module,exports){
"use strict";

exports.f = {}.propertyIsEnumerable;

},{}],42:[function(require,module,exports){
"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],43:[function(require,module,exports){
'use strict';

var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":10,"./_global":19,"./_has":20,"./_hide":21,"./_uid":54}],44:[function(require,module,exports){
'use strict';

var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":20,"./_object-dp":35,"./_wks":55}],45:[function(require,module,exports){
'use strict';

var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":46,"./_uid":54}],46:[function(require,module,exports){
'use strict';

var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":10,"./_global":19,"./_library":32}],47:[function(require,module,exports){
'use strict';

var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":13,"./_to-integer":49}],48:[function(require,module,exports){
'use strict';

var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":49}],49:[function(require,module,exports){
"use strict";

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],50:[function(require,module,exports){
'use strict';

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":13,"./_iobject":24}],51:[function(require,module,exports){
'use strict';

// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":49}],52:[function(require,module,exports){
'use strict';

// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":13}],53:[function(require,module,exports){
'use strict';

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":26}],54:[function(require,module,exports){
'use strict';

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],55:[function(require,module,exports){
'use strict';

var store = require('./_shared')('wks');
var uid = require('./_uid');
var _Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof _Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":19,"./_shared":46,"./_uid":54}],56:[function(require,module,exports){
'use strict';

var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

},{"./_classof":8,"./_core":10,"./_iterators":31,"./_wks":55}],57:[function(require,module,exports){
'use strict';

var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) {
  Array.from(iter);
}), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":11,"./_ctx":12,"./_export":17,"./_is-array-iter":25,"./_iter-call":27,"./_iter-detect":30,"./_to-length":51,"./_to-object":52,"./core.get-iterator-method":56}],58:[function(require,module,exports){
'use strict';

// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":17,"./_object-assign":33}],59:[function(require,module,exports){
'use strict';

var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":29,"./_string-at":47}],60:[function(require,module,exports){
"use strict";

module.exports = function once(listener, options) {
  var wrapped = function wrappedOnce(e) {
    e.currentTarget.removeEventListener(e.type, wrapped, options);
    return listener.call(this, e);
  };
  return wrapped;
};

},{}],61:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var toggle = require('../utils/toggle');
var isElementInViewport = require('../utils/is-in-viewport');
var BUTTON = '.accordion-button[aria-controls]';
var EXPANDED = 'aria-expanded';
var MULTISELECTABLE = 'aria-multiselectable';

var Accordion = function () {
  function Accordion(accordion) {
    _classCallCheck(this, Accordion);

    this.accordion = accordion;
    this.buttons = accordion.querySelectorAll(BUTTON);
    this.eventClose = document.createEvent('Event');
    this.eventClose.initEvent('fds.accordion.close', true, true);
    this.eventOpen = document.createEvent('Event');
    this.eventOpen.initEvent('fds.accordion.open', true, true);
    this.init();
  }

  _createClass(Accordion, [{
    key: 'init',
    value: function init() {
      for (var i = 0; i < this.buttons.length; i++) {
        var currentButton = this.buttons[i];

        var expanded = currentButton.getAttribute(EXPANDED) === 'true';
        toggleButton(currentButton, expanded);

        var that = this;
        currentButton.removeEventListener('click', that.eventOnClick, false);
        currentButton.addEventListener('click', that.eventOnClick, false);
      }
    }
  }, {
    key: 'eventOnClick',
    value: function eventOnClick(event) {
      event.stopPropagation();
      var button = this;
      event.preventDefault();
      toggleButton(button);
      if (button.getAttribute(EXPANDED) === 'true') {
        // We were just expanded, but if another accordion was also just
        // collapsed, we may no longer be in the viewport. This ensures
        // that we are still visible, so the user isn't confused.
        if (!isElementInViewport(button)) button.scrollIntoView();
      }
    }

    /**
     * Toggle a button's "pressed" state, optionally providing a target
     * state.
     *
     * @param {HTMLButtonElement} button
     * @param {boolean?} expanded If no state is provided, the current
     * state will be toggled (from false to true, and vice-versa).
     * @return {boolean} the resulting state
     */

  }]);

  return Accordion;
}();

var toggleButton = function toggleButton(button, expanded) {
  var accordion = null;
  if (button.parentNode.parentNode.classList.contains('accordion')) {
    accordion = button.parentNode.parentNode;
  }

  var eventClose = document.createEvent('Event');
  eventClose.initEvent('fds.accordion.close', true, true);
  var eventOpen = document.createEvent('Event');
  eventOpen.initEvent('fds.accordion.open', true, true);
  expanded = toggle(button, expanded);

  if (expanded) {
    button.dispatchEvent(eventOpen);
  } else {
    button.dispatchEvent(eventClose);
  }

  // XXX multiselectable is opt-in, to preserve legacy behavior
  var multiselectable = false;
  if (accordion !== null && accordion.getAttribute(MULTISELECTABLE) === 'true') {
    multiselectable = true;
  }

  if (expanded && !multiselectable) {
    var buttons = [button];
    if (accordion !== null) {
      buttons = accordion.querySelectorAll(BUTTON);
    }
    for (var i = 0; i < buttons.length; i++) {
      var currentButtton = buttons[i];
      if (currentButtton !== button) {
        toggle(currentButtton, false);
        currentButtton.dispatchEvent(eventClose);
      }
    }
  }
};

module.exports = Accordion;

},{"../utils/is-in-viewport":76,"../utils/toggle":78}],62:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheckboxToggleContent = function () {
    function CheckboxToggleContent(el) {
        _classCallCheck(this, CheckboxToggleContent);

        this.jsToggleTrigger = '.js-checkbox-toggle-content';
        this.jsToggleTarget = 'data-js-target';
        this.eventClose = document.createEvent('Event');
        this.eventClose.initEvent('fds.collapse.close', true, true);
        this.eventOpen = document.createEvent('Event');
        this.eventOpen.initEvent('fds.collapse.open', true, true);
        this.targetEl = null;
        this.checkboxEl = null;

        this.init(el);
    }

    _createClass(CheckboxToggleContent, [{
        key: 'init',
        value: function init(el) {
            this.checkboxEl = el;
            var that = this;
            this.checkboxEl.addEventListener('change', function (event) {
                that.toggle(that.checkboxEl);
            });
            this.toggle(this.checkboxEl);
        }
    }, {
        key: 'toggle',
        value: function toggle(triggerEl) {
            var targetAttr = triggerEl.getAttribute(this.jsToggleTarget);
            if (targetAttr !== null && targetAttr !== undefined) {
                var targetEl = document.querySelector(targetAttr);
                if (targetEl !== null && targetEl !== undefined) {
                    if (triggerEl.checked) {
                        this.open(triggerEl, targetEl);
                    } else {
                        this.close(triggerEl, targetEl);
                    }
                }
            }
        }
    }, {
        key: 'open',
        value: function open(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute('aria-expanded', 'true');
                targetEl.classList.remove('collapsed');
                targetEl.setAttribute('aria-hidden', 'false');
                triggerEl.dispatchEvent(this.eventOpen);
            }
        }
    }, {
        key: 'close',
        value: function close(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute('aria-expanded', 'false');
                targetEl.classList.add('collapsed');
                targetEl.setAttribute('aria-hidden', 'true');
                triggerEl.dispatchEvent(this.eventClose);
            }
        }
    }]);

    return CheckboxToggleContent;
}();

module.exports = CheckboxToggleContent;

},{}],63:[function(require,module,exports){
/**
 * Collapse/expand.
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collapse = function () {
  function Collapse(element) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'toggle';

    _classCallCheck(this, Collapse);

    this.jsCollapseTarget = 'data-js-target';
    this.triggerEl = element;
    this.targetEl;
    this.animateInProgress = false;
    var that = this;
    this.eventClose = document.createEvent('Event');
    this.eventClose.initEvent('fds.collapse.close', true, true);
    this.eventOpen = document.createEvent('Event');
    this.eventOpen.initEvent('fds.collapse.open', true, true);
    this.triggerEl.addEventListener('click', function () {
      that.toggle();
    });
  }

  _createClass(Collapse, [{
    key: 'toggleCollapse',
    value: function toggleCollapse(forceClose) {
      var targetAttr = this.triggerEl.getAttribute(this.jsCollapseTarget);
      if (targetAttr !== null && targetAttr !== undefined) {
        this.targetEl = document.querySelector(targetAttr);
        if (this.targetEl !== null && this.targetEl !== undefined) {
          //change state
          if (this.triggerEl.getAttribute('aria-expanded') === 'true' || this.triggerEl.getAttribute('aria-expanded') === undefined || forceClose) {
            //close
            this.animateCollapse();
          } else {
            //open
            this.animateExpand();
          }
        }
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.triggerEl !== null && this.triggerEl !== undefined) {
        this.toggleCollapse();
      }
    }
  }, {
    key: 'animateCollapse',
    value: function animateCollapse() {
      if (!this.animateInProgress) {
        this.animateInProgress = true;

        this.targetEl.style.height = this.targetEl.clientHeight + 'px';
        this.targetEl.classList.add('collapse-transition-collapse');
        var that = this;
        setTimeout(function () {
          that.targetEl.removeAttribute('style');
        }, 5);
        setTimeout(function () {
          that.targetEl.classList.add('collapsed');
          that.targetEl.classList.remove('collapse-transition-collapse');

          that.triggerEl.setAttribute('aria-expanded', 'false');
          that.targetEl.setAttribute('aria-hidden', 'true');
          that.animateInProgress = false;
          that.triggerEl.dispatchEvent(that.eventClose);
        }, 200);
      }
    }
  }, {
    key: 'animateExpand',
    value: function animateExpand() {
      if (!this.animateInProgress) {
        this.animateInProgress = true;
        this.targetEl.classList.remove('collapsed');
        var expandedHeight = this.targetEl.clientHeight;
        this.targetEl.style.height = '0px';
        this.targetEl.classList.add('collapse-transition-expand');
        var that = this;
        setTimeout(function () {
          that.targetEl.style.height = expandedHeight + 'px';
        }, 5);

        setTimeout(function () {
          that.targetEl.classList.remove('collapse-transition-expand');
          that.targetEl.removeAttribute('style');

          that.targetEl.setAttribute('aria-hidden', 'false');
          that.triggerEl.setAttribute('aria-expanded', 'true');
          that.animateInProgress = false;
          that.triggerEl.dispatchEvent(that.eventOpen);
        }, 200);
      }
    }
  }]);

  return Collapse;
}();

module.exports = Collapse;

},{}],64:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var closest = require('../utils/closest');
var toggle = require('../utils/toggle');
var BUTTON = '.js-dropdown';
var TARGET = 'data-js-target';
var eventCloseName = 'fds.dropdown.close';
var eventOpenName = 'fds.dropdown.open';

var navResponsiveBreakpoint = 992; //same as $nav-responsive-breakpoint from the scss.
var tringuideBreakpoint = 768; //same as $nav-responsive-breakpoint from the scss.

var Dropdown = function () {
  function Dropdown(el) {
    _classCallCheck(this, Dropdown);

    this.jsDropdownTrigger = '.js-dropdown';

    //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown).
    this.jsResponsiveCollapseModifier = '.js-dropdown--responsive-collapse';
    this.refsponsiveCollapseEnabled = false;
    this.responsiveListCollapseEnabled = false;

    this.triggerEl = null;
    this.targetEl = null;

    this.init(el);

    if (this.triggerEl !== null && this.triggerEl !== undefined && this.targetEl !== null && this.targetEl !== undefined) {
      var that = this;

      if (this.triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive')) {
        this.responsiveListCollapseEnabled = true;
      }

      //Clicked outside dropdown -> close it
      document.getElementsByTagName('body')[0].removeEventListener('click', outsideClose);
      document.getElementsByTagName('body')[0].addEventListener('click', outsideClose);
      //Clicked on dropdown open button --> toggle it
      this.triggerEl.removeEventListener('click', toggleDropdown);
      this.triggerEl.addEventListener('click', toggleDropdown);

      // set aria-hidden correctly for screenreaders (Tringuide responsive)
      if (this.responsiveListCollapseEnabled) {
        var element = this.triggerEl;
        if (window.IntersectionObserver) {
          // trigger event when button changes visibility
          var observer = new IntersectionObserver(function (entries) {
            // button is visible
            if (entries[0].intersectionRatio) {
              if (element.getAttribute('aria-expanded') === 'false') {
                that.targetEl.setAttribute('aria-hidden', true);
              }
            } else {
              // button is not visible
              if (that.targetEl.getAttribute('aria-hidden') === 'true') {
                that.targetEl.setAttribute('aria-hidden', false);
              }
            }
          }, {
            root: document.body
          });
          observer.observe(element);
        } else {
          // IE: IntersectionObserver is not supported, so we listen for window resize and grid breakpoint instead
          if (doResponsiveStepguideCollapse(that.triggerEl)) {
            // small screen
            if (element.getAttribute('aria-expanded') === 'false') {
              that.targetEl.setAttribute('aria-hidden', true);
            } else {
              that.targetEl.setAttribute('aria-hidden', false);
            }
          } else {
            // Large screen
            that.targetEl.setAttribute('aria-hidden', false);
          }
          window.addEventListener('resize', function () {
            if (doResponsiveStepguideCollapse(that.triggerEl)) {
              if (element.getAttribute('aria-expanded') === 'false') {
                that.targetEl.setAttribute('aria-hidden', true);
              } else {
                that.targetEl.setAttribute('aria-hidden', false);
              }
            } else {
              that.targetEl.setAttribute('aria-hidden', false);
            }
          });
        }
      }

      document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode === 27) {
          closeAll();
        }
      };
    }
  }

  _createClass(Dropdown, [{
    key: 'init',
    value: function init(el) {
      this.triggerEl = el;
      if (this.triggerEl !== null && this.triggerEl !== undefined) {
        var targetAttr = this.triggerEl.getAttribute(TARGET);
        if (targetAttr !== null && targetAttr !== undefined) {
          var targetEl = document.getElementById(targetAttr.replace('#', ''));
          if (targetEl !== null && targetEl !== undefined) {
            this.targetEl = targetEl;
          }
        }
      }
    }
  }]);

  return Dropdown;
}();

/**
 * Toggle a button's "pressed" state, optionally providing a target
 * state.
 *
 * @param {HTMLButtonElement} button
 * @param {boolean?} expanded If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 * @return {boolean} the resulting state
 */


var toggleButton = function toggleButton(button, expanded) {
  toggle(button, expanded);
};

/**
 * Get an Array of button elements belonging directly to the given
 * accordion element.
 * @param {HTMLElement} accordion
 * @return {array<HTMLButtonElement>}
 */
var getButtons = function getButtons(parent) {
  return parent.querySelectorAll(BUTTON);
};
var closeAll = function closeAll() {

  var eventClose = document.createEvent('Event');
  eventClose.initEvent(eventCloseName, true, true);

  var body = document.querySelector('body');

  var overflowMenuEl = document.getElementsByClassName('overflow-menu');
  var triggerEl = null;
  var targetEl = null;
  for (var oi = 0; oi < overflowMenuEl.length; oi++) {
    var currentOverflowMenuEL = overflowMenuEl[oi];
    for (var a = 0; a < currentOverflowMenuEL.childNodes.length; a++) {
      if (currentOverflowMenuEL.childNodes[a].tagName !== undefined) {
        if (currentOverflowMenuEL.childNodes[a].classList.contains('js-dropdown')) {
          triggerEl = currentOverflowMenuEL.childNodes[a];
        } else if (currentOverflowMenuEL.childNodes[a].classList.contains('overflow-menu-inner')) {
          targetEl = currentOverflowMenuEL.childNodes[a];
        }
      }
    }
    if (targetEl !== null && triggerEl !== null) {
      if (body.classList.contains('mobile_nav-active')) {
        if (!closest(currentOverflowMenuEL, '.navbar')) {

          if (triggerEl.getAttribute('aria-expanded') === true) {
            triggerEl.dispatchEvent(eventClose);
          }
          triggerEl.setAttribute('aria-expanded', 'false');
          targetEl.classList.add('collapsed');
          targetEl.setAttribute('aria-hidden', 'true');
        }
      } else {
        if (triggerEl.getAttribute('aria-expanded') === true) {
          triggerEl.dispatchEvent(eventClose);
        }
        triggerEl.setAttribute('aria-expanded', 'false');
        targetEl.classList.add('collapsed');
        targetEl.setAttribute('aria-hidden', 'true');
      }
    }
  }
};
var offset = function offset(el) {
  var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

var toggleDropdown = function toggleDropdown(event) {
  var forceClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  event.stopPropagation();
  event.preventDefault();

  var eventClose = document.createEvent('Event');
  eventClose.initEvent(eventCloseName, true, true);

  var eventOpen = document.createEvent('Event');
  eventOpen.initEvent(eventOpenName, true, true);
  var triggerEl = this;
  var targetEl = null;
  if (triggerEl !== null && triggerEl !== undefined) {
    var targetAttr = triggerEl.getAttribute(TARGET);
    if (targetAttr !== null && targetAttr !== undefined) {
      targetEl = document.getElementById(targetAttr.replace('#', ''));
    }
  }
  if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
    //change state

    targetEl.style.left = null;
    targetEl.style.right = null;

    var rect = triggerEl.getBoundingClientRect();
    if (triggerEl.getAttribute('aria-expanded') === 'true' || forceClose) {
      //close
      triggerEl.setAttribute('aria-expanded', 'false');
      targetEl.classList.add('collapsed');
      targetEl.setAttribute('aria-hidden', 'true');
      triggerEl.dispatchEvent(eventClose);
    } else {
      closeAll();
      //open
      triggerEl.setAttribute('aria-expanded', 'true');
      targetEl.classList.remove('collapsed');
      targetEl.setAttribute('aria-hidden', 'false');
      triggerEl.dispatchEvent(eventOpen);
      var targetOffset = offset(targetEl);

      if (targetOffset.left < 0) {
        targetEl.style.left = '0px';
        targetEl.style.right = 'auto';
      }
      var right = targetOffset.left + targetEl.offsetWidth;
      if (right > window.innerWidth) {
        targetEl.style.left = 'auto';
        targetEl.style.right = '0px';
      }

      var offsetAgain = offset(targetEl);

      if (offsetAgain.left < 0) {

        targetEl.style.left = '0px';
        targetEl.style.right = 'auto';
      }
      right = offsetAgain.left + targetEl.offsetWidth;
      if (right > window.innerWidth) {

        targetEl.style.left = 'auto';
        targetEl.style.right = '0px';
      }
    }
  }
};

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} true
 */
var show = function show(button) {
  toggleButton(button, true);
};

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} false
 */
var hide = function hide(button) {
  toggleButton(button, false);
};

var outsideClose = function outsideClose(evt) {
  var openDropdowns = document.querySelectorAll('.js-dropdown[aria-expanded=true]');
  for (var i = 0; i < openDropdowns.length; i++) {
    var triggerEl = openDropdowns[i];
    var targetEl = null;
    var targetAttr = triggerEl.getAttribute(TARGET);
    if (targetAttr !== null && targetAttr !== undefined) {
      targetEl = document.getElementById(targetAttr.replace('#', ''));
    }
    if (!doResponsiveCollapse(triggerEl)) {
      //closes dropdown when clicked outside
      if (evt.target !== triggerEl) {
        //clicked outside trigger, force close
        triggerEl.setAttribute('aria-expanded', 'false');
        targetEl.classList.add('collapsed');
        targetEl.setAttribute('aria-hidden', 'true');

        var eventClose = document.createEvent('Event');
        eventClose.initEvent(eventCloseName, true, true);
        triggerEl.dispatchEvent(eventClose);
      }
    }
  }
};

var doResponsiveCollapse = function doResponsiveCollapse(triggerEl) {
  var responsiveCollapseEnabled = false;
  var responsiveListCollapseEnabled = false;

  if (triggerEl.classList.contains('js-dropdown--responsive-collapse')) {
    responsiveCollapseEnabled = true;
  }

  if (triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive')) {
    responsiveListCollapseEnabled = true;
  }

  //returns true if responsive collapse is enabled and we are on a small screen.
  if ((responsiveCollapseEnabled || responsiveListCollapseEnabled) && window.innerWidth <= navResponsiveBreakpoint) {
    return true;
  }
  return false;
};

var doResponsiveStepguideCollapse = function doResponsiveStepguideCollapse(triggerEl) {
  var responsiveListCollapseEnabled = false;

  if (triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive')) {
    responsiveListCollapseEnabled = true;
  }

  //returns true if responsive collapse is enabled and we are on a small screen.
  if (responsiveListCollapseEnabled && window.innerWidth <= tringuideBreakpoint) {
    return true;
  }
  return false;
};

module.exports = Dropdown;

},{"../utils/closest":75,"../utils/toggle":78}],65:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var forEach = require('array-foreach');
var select = require('../utils/select');
var dropdown = require('./dropdown');

var NAV = '.nav';
var NAV_LINKS = NAV + ' a';
var OPENERS = '.js-menu-open';
var CLOSE_BUTTON = '.js-menu-close';
var OVERLAY = '.overlay';
var CLOSERS = CLOSE_BUTTON + ', .overlay';
var TOGGLES = [NAV, OVERLAY].join(', ');

var ACTIVE_CLASS = 'mobile_nav-active';
var VISIBLE_CLASS = 'is-visible';

var isActive = function isActive() {
  return document.body.classList.contains(ACTIVE_CLASS);
};

var _focusTrap = function _focusTrap(trapContainer) {
  // Find all focusable children
  var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  var focusableElements = trapContainer.querySelectorAll(focusableElementsString);
  var firstTabStop = focusableElements[0];
  var lastTabStop = focusableElements[focusableElements.length - 1];

  function trapTabKey(e) {
    // Check for TAB key press
    if (e.keyCode === 9) {

      // SHIFT + TAB
      if (e.shiftKey) {
        if (document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        }

        // TAB
      } else {
        if (document.activeElement === lastTabStop) {
          e.preventDefault();
          firstTabStop.focus();
        }
      }
    }

    // ESCAPE
    if (e.key === 'Escape') {
      toggleNav.call(this, false);
    }
  }

  // Focus first child
  firstTabStop.focus();

  return {
    enable: function enable() {
      // Listen for and trap the keyboard
      trapContainer.addEventListener('keydown', trapTabKey);
    },
    release: function release() {
      trapContainer.removeEventListener('keydown', trapTabKey);
    }
  };
};

var focusTrap = void 0;

var toggleNav = function toggleNav(active) {
  var body = document.body;
  if (typeof active !== 'boolean') {
    active = !isActive();
  }
  body.classList.toggle(ACTIVE_CLASS, active);

  forEach(select(TOGGLES), function (el) {
    el.classList.toggle(VISIBLE_CLASS, active);
  });
  if (active) {
    focusTrap.enable();
  } else {
    focusTrap.release();
  }

  var closeButton = body.querySelector(CLOSE_BUTTON);
  var menuButton = body.querySelector(OPENERS);

  if (active && closeButton) {
    // The mobile nav was just activated, so focus on the close button,
    // which is just before all the nav elements in the tab order.
    closeButton.focus();
  } else if (!active && document.activeElement === closeButton && menuButton) {
    // The mobile nav was just deactivated, and focus was on the close
    // button, which is no longer visible. We don't want the focus to
    // disappear into the void, so focus on the menu button if it's
    // visible (this may have been what the user was just focused on,
    // if they triggered the mobile nav by mistake).
    menuButton.focus();
  }

  return active;
};

var resize = function resize() {
  var closer = document.body.querySelector(CLOSE_BUTTON);

  if (isActive() && closer && closer.getBoundingClientRect().width === 0) {
    // The mobile nav is active, but the close box isn't visible, which
    // means the user's viewport has been resized so that it is no longer
    // in mobile mode. Let's make the page state consistent by
    // deactivating the mobile nav.
    toggleNav.call(closer, false);
  }
};

var Navigation = function () {
  function Navigation() {
    _classCallCheck(this, Navigation);

    var openers = document.querySelectorAll(OPENERS);
    for (var o = 0; o < openers.length; o++) {
      openers[o].addEventListener('click', toggleNav);
    }

    var closers = document.querySelectorAll(CLOSERS);
    for (var c = 0; c < closers.length; c++) {
      closers[c].addEventListener('click', toggleNav);
    }

    var navLinks = document.querySelectorAll(NAV_LINKS);
    for (var n = 0; n < navLinks.length; n++) {
      navLinks[n].addEventListener('click', function () {
        // A navigation link has been clicked! We want to collapse any
        // hierarchical navigation UI it's a part of, so that the user
        // can focus on whatever they've just selected.

        // Some navigation links are inside dropdowns; when they're
        // clicked, we want to collapse those dropdowns.


        // If the mobile navigation menu is active, we want to hide it.
        if (isActive()) {
          toggleNav.call(this, false);
        }
      });
    }

    this.init();
  }

  _createClass(Navigation, [{
    key: 'init',
    value: function init() {
      var trapContainers = document.querySelectorAll(NAV);
      for (var i = 0; i < trapContainers.length; i++) {
        focusTrap = _focusTrap(trapContainers[i]);
      }

      resize();
      window.addEventListener('resize', resize, false);
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      window.removeEventListener('resize', resize, false);
    }
  }]);

  return Navigation;
}();

module.exports = Navigation;

},{"../utils/select":77,"./dropdown":64,"array-foreach":1}],66:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RadioToggleGroup = function () {
    function RadioToggleGroup(el) {
        _classCallCheck(this, RadioToggleGroup);

        this.jsToggleTrigger = '.js-radio-toggle-group';
        this.jsToggleTarget = 'data-js-target';

        this.eventClose = document.createEvent('Event');
        this.eventClose.initEvent('fds.collapse.close', true, true);

        this.eventOpen = document.createEvent('Event');
        this.eventOpen.initEvent('fds.collapse.open', true, true);
        this.radioEls = null;
        this.targetEl = null;

        this.init(el);
    }

    _createClass(RadioToggleGroup, [{
        key: 'init',
        value: function init(el) {
            this.radioGroup = el;
            this.radioEls = this.radioGroup.querySelectorAll('input[type="radio"]');
            var that = this;

            for (var i = 0; i < this.radioEls.length; i++) {
                var radio = this.radioEls[i];
                radio.addEventListener('change', function () {
                    for (var a = 0; a < that.radioEls.length; a++) {
                        that.toggle(that.radioEls[a]);
                    }
                });

                this.toggle(radio); //Initial value;
            }
        }
    }, {
        key: 'toggle',
        value: function toggle(triggerEl) {
            var targetAttr = triggerEl.getAttribute(this.jsToggleTarget);
            if (targetAttr !== null && targetAttr !== undefined) {
                var targetEl = document.querySelector(targetAttr);
                if (targetEl !== null && targetEl !== undefined) {
                    if (triggerEl.checked) {
                        this.open(triggerEl, targetEl);
                    } else {
                        this.close(triggerEl, targetEl);
                    }
                }
            }
        }
    }, {
        key: 'open',
        value: function open(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute('aria-expanded', 'true');
                targetEl.classList.remove('collapsed');
                targetEl.setAttribute('aria-hidden', 'false');
                triggerEl.dispatchEvent(this.eventOpen);
            }
        }
    }, {
        key: 'close',
        value: function close(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute('aria-expanded', 'false');
                targetEl.classList.add('collapsed');
                targetEl.setAttribute('aria-hidden', 'true');
                triggerEl.dispatchEvent(this.eventClose);
            }
        }
    }]);

    return RadioToggleGroup;
}();

module.exports = RadioToggleGroup;

},{}],67:[function(require,module,exports){
/*
* Prevents the user from inputting based on a regex.
* Does not work the same way af <input pattern="">, this pattern is only used for validation, not to prevent input.
* Usecase: number input for date-component.
* Example - number only: <input type="text" data-input-regex="^\d*$">
*/
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var modifierState = {
  shift: false,
  alt: false,
  ctrl: false,
  command: false
};

var InputRegexMask = function InputRegexMask(element) {
  _classCallCheck(this, InputRegexMask);

  element.addEventListener('paste', regexMask);
  element.addEventListener('keydown', regexMask);
};

var regexMask = function regexMask(event) {
  if (modifierState.ctrl || modifierState.command) {
    return;
  }
  var newChar = null;
  if (typeof event.key !== 'undefined') {
    if (event.key.length === 1) {
      newChar = event.key;
    }
  } else {
    if (!event.charCode) {
      newChar = String.fromCharCode(event.keyCode);
    } else {
      newChar = String.fromCharCode(event.charCode);
    }
  }

  var regexStr = this.getAttribute('data-input-regex');

  if (event.type !== undefined && event.type === 'paste') {
    console.log('paste');
  } else {
    var element = null;
    if (event.target !== undefined) {
      element = event.target;
    }
    if (newChar !== null && element !== null) {
      if (newChar.length > 0) {
        var newValue = this.value;
        if (element.type === 'number') {
          newValue = this.value; //Note input[type=number] does not have .selectionStart/End (Chrome).
        } else {
          newValue = this.value.slice(0, element.selectionStart) + this.value.slice(element.selectionEnd) + newChar; //removes the numbers selected by the user, then adds new char.
        }

        var r = new RegExp(regexStr);
        if (r.exec(newValue) === null) {
          if (event.preventDefault) {
            event.preventDefault();
          } else {
            event.returnValue = false;
          }
        }
      }
    }
  }
};

module.exports = InputRegexMask;

},{}],68:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var once = require('receptor/once');

var SetTabIndex = function SetTabIndex(element) {
  _classCallCheck(this, SetTabIndex);

  element.addEventListener('click', function () {
    // NB: we know because of the selector we're delegating to below that the
    // href already begins with '#'
    var id = this.getAttribute('href').slice(1);
    var target = document.getElementById(id);
    if (target) {
      target.setAttribute('tabindex', 0);
      target.addEventListener('blur', once(function (event) {
        target.setAttribute('tabindex', -1);
      }));
    } else {
      // throw an error?
    }
  });
};

module.exports = SetTabIndex;

},{"receptor/once":60}],69:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var select = require('../utils/select');

var ResponsiveTable = function () {
  function ResponsiveTable(table) {
    _classCallCheck(this, ResponsiveTable);

    this.insertHeaderAsAttributes(table);
  }

  // Add data attributes needed for responsive mode.


  _createClass(ResponsiveTable, [{
    key: 'insertHeaderAsAttributes',
    value: function insertHeaderAsAttributes(tableEl) {
      if (!tableEl) return;

      var header = tableEl.getElementsByTagName('thead');
      if (header.length !== 0) {
        var headerCellEls = header[0].getElementsByTagName('th');
        if (headerCellEls.length == 0) {
          headerCellEls = header[0].getElementsByTagName('td');
        }

        if (headerCellEls.length) {
          var bodyRowEls = select('tbody tr', tableEl);
          Array.from(bodyRowEls).forEach(function (rowEl) {
            var cellEls = rowEl.children;
            if (cellEls.length === headerCellEls.length) {
              Array.from(headerCellEls).forEach(function (headerCellEl, i) {
                // Grab header cell text and use it body cell data title.
                cellEls[i].setAttribute('data-title', headerCellEl.textContent);
              });
            }
          });
        }
      }
    }
  }]);

  return ResponsiveTable;
}();

module.exports = ResponsiveTable;

},{"../utils/select":77}],70:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tabnav = function () {
  function Tabnav(tabnav) {
    _classCallCheck(this, Tabnav);

    this.tabnav = tabnav;
    var tabMenuItems = this.tabnav.querySelectorAll('a');
    var that = this;
    for (var i = 0; i < tabMenuItems.length; i++) {
      tabMenuItems[i].addEventListener('click', function (event) {
        event.preventDefault();
        that.changeFocusTab(this);
      });
    }
    this.setTab();
  }

  _createClass(Tabnav, [{
    key: 'setTab',
    value: function setTab() {
      var targetID = location.hash.replace('#', '');
      if (targetID != '') {
        var triggerEL = this.tabnav.querySelector('a[href="#' + targetID + '"]');
        this.changeFocusTab(triggerEL);
      } else {
        // set margin-bottom on tabnav so content below doesn't overlap

        var targetId = this.tabnav.querySelector('li.active .tabnav-item').getAttribute('href').replace('#', '');
        var style = window.getComputedStyle(document.getElementById(targetId));
        var height = parseInt(document.getElementById(targetId).offsetHeight) + parseInt(style.getPropertyValue('margin-bottom'));

        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth;

        if (x >= 768) {
          this.tabnav.style.marginBottom = height + 'px';
        } else {
          this.tabnav.style.marginBottom = '';
        }
      }
    }
  }, {
    key: 'changeFocusTab',
    value: function changeFocusTab(triggerEl) {

      var changeTabEvent = document.createEvent('Event');
      changeTabEvent.initEvent('fds.tabnav.changed', true, true);
      var tabOpenEvent = document.createEvent('Event');
      tabOpenEvent.initEvent('fds.tabnav.open', true, true);
      var tabCloseEvent = document.createEvent('Event');
      tabCloseEvent.initEvent('fds.tabnav.close', true, true);
      // loop all elements in current tabnav and disable them
      var parentNode = triggerEl.parentNode.parentNode;
      var allNodes = triggerEl.parentNode.parentNode.childNodes;
      for (var i = 0; i < allNodes.length; i++) {
        if (allNodes[i].nodeName === 'LI') {
          for (var a = 0; a < allNodes[i].childNodes.length; a++) {
            if (allNodes[i].childNodes[a].nodeName === 'A') {
              if (allNodes[i].childNodes[a].classList.contains('tabnav-item')) {
                if (allNodes[i].childNodes[a].getAttribute('aria-expanded') === true) {
                  allNodes[i].childNodes[a].dispatchEvent(tabCloseEvent);
                }

                allNodes[i].childNodes[a].parentNode.classList.remove('active');
                allNodes[i].childNodes[a].setAttribute('aria-expanded', false);
                var nodeTarget = allNodes[i].childNodes[a].getAttribute('href').replace('#', '');
                document.getElementById(nodeTarget).setAttribute('aria-hidden', true);
              }
            }
          }
        }
      }
      // enable selected tab
      var targetId = triggerEl.getAttribute('href').replace('#', '');
      if (history.pushState) {
        history.pushState(null, null, '#' + targetId);
      } else {
        location.hash = '#' + targetId;
      }
      triggerEl.setAttribute('aria-expanded', true);
      triggerEl.parentNode.classList.add('active');
      document.getElementById(targetId).setAttribute('aria-hidden', false);
      triggerEl.dispatchEvent(tabOpenEvent);
      // set margin-bottom on tabnav so content below doesn't overlap
      var style = window.getComputedStyle(document.getElementById(targetId));
      var height = parseInt(document.getElementById(targetId).offsetHeight) + parseInt(style.getPropertyValue('margin-bottom'));
      parentNode.style.marginBottom = height + 'px';

      parentNode.dispatchEvent(changeTabEvent);
    }
  }]);

  return Tabnav;
}();

module.exports = Tabnav;

},{}],71:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tooltip = function () {
  function Tooltip(element) {
    _classCallCheck(this, Tooltip);

    this.element = element;
    this.setEvents();
  }

  _createClass(Tooltip, [{
    key: 'setEvents',
    value: function setEvents() {
      var that = this;
      if (this.element.getAttribute('data-tooltip-trigger') !== 'click') {
        this.element.addEventListener('mouseover', function (e) {
          var element = e.target;

          if (element.getAttribute('aria-describedby') !== null) return;
          e.preventDefault();

          var pos = element.getAttribute('data-tooltip-position') || 'top';

          var tooltip = that.createTooltip(element, pos);

          document.body.appendChild(tooltip);

          that.positionAt(element, tooltip, pos);
        });
        this.element.addEventListener('focus', function (e) {
          var element = e.target;

          if (element.getAttribute('aria-describedby') !== null) return;
          e.preventDefault();

          var pos = element.getAttribute('data-tooltip-position') || 'top';

          var tooltip = that.createTooltip(element, pos);

          document.body.appendChild(tooltip);

          that.positionAt(element, tooltip, pos);
        });

        this.element.addEventListener('blur', function (e) {
          var tooltip = this.getAttribute('aria-describedby');
          if (tooltip !== null && document.getElementById(tooltip) !== null) {
            document.body.removeChild(document.getElementById(tooltip));
          }
          this.removeAttribute('aria-describedby');
        });
        this.element.addEventListener('mouseout', function (e) {
          var tooltip = this.getAttribute('aria-describedby');
          if (tooltip !== null && document.getElementById(tooltip) !== null) {
            document.body.removeChild(document.getElementById(tooltip));
          }
          this.removeAttribute('aria-describedby');
        });
      } else {
        this.element.addEventListener('click', function (e) {
          var element = this;
          if (element.getAttribute('aria-describedby') === null) {
            var pos = element.getAttribute('data-tooltip-position') || 'top';
            var tooltip = that.createTooltip(element, pos);
            document.body.appendChild(tooltip);
            that.positionAt(element, tooltip, pos);
          } else {
            var popper = element.getAttribute('aria-describedby');
            document.body.removeChild(document.getElementById(popper));
            element.removeAttribute('aria-describedby');
          }
        });
      }

      document.getElementsByTagName('body')[0].addEventListener('click', function (event) {
        if (!event.target.classList.contains('js-tooltip')) {
          that.closeAll();
        }
      });
    }
  }, {
    key: 'closeAll',
    value: function closeAll() {
      var elements = document.querySelectorAll('.js-tooltip[aria-describedby]');
      for (var i = 0; i < elements.length; i++) {
        var popper = elements[i].getAttribute('aria-describedby');
        elements[i].removeAttribute('aria-describedby');
        document.body.removeChild(document.getElementById(popper));
      }
    }
  }, {
    key: 'createTooltip',
    value: function createTooltip(element, pos) {
      var tooltip = document.createElement('div');
      tooltip.className = 'tooltip-popper';
      var poppers = document.getElementsByClassName('tooltip-popper');
      var id = 'tooltip-' + poppers.length + 1;
      tooltip.setAttribute('id', id);
      tooltip.setAttribute('role', 'tooltip');
      tooltip.setAttribute('x-placement', pos);
      element.setAttribute('aria-describedby', id);

      var tooltipInner = document.createElement('div');
      tooltipInner.className = 'tooltip';

      var tooltipContent = document.createElement('div');
      tooltipContent.className = 'tooltip-content';
      tooltipContent.innerHTML = element.getAttribute('data-tooltip');
      tooltipInner.appendChild(tooltipContent);
      tooltip.appendChild(tooltipInner);

      return tooltip;
    }

    /**
     * Positions the tooltip.
     *
     * @param {object} parent - The trigger of the tooltip.
     * @param {object} tooltip - The tooltip itself.
     * @param {string} posHorizontal - Desired horizontal position of the tooltip relatively to the trigger (left/center/right)
     * @param {string} posVertical - Desired vertical position of the tooltip relatively to the trigger (top/center/bottom)
     *
     */

  }, {
    key: 'positionAt',
    value: function positionAt(parent, tooltip, pos) {
      var parentCoords = parent.getBoundingClientRect(),
          left,
          top;
      var tooltipWidth = tooltip.offsetWidth;

      var dist = 8;

      left = parseInt(parentCoords.left) + (parent.offsetWidth - tooltip.offsetWidth) / 2;

      switch (pos) {
        case 'bottom':
          top = parseInt(parentCoords.bottom) + dist;
          break;

        default:
        case 'top':
          top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
      }

      if (left < 0) {
        left = parseInt(parentCoords.left);
      }

      if (top + tooltip.offsetHeight >= window.innerHeight) {
        top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
      }

      top = top < 0 ? parseInt(parentCoords.bottom) + dist : top;
      if (window.innerWidth < left + tooltipWidth) {
        tooltip.style.right = dist + 'px';
      } else {
        tooltip.style.left = left + 'px';
      }
      tooltip.style.top = top + pageYOffset + 'px';
    }
  }]);

  return Tooltip;
}();

module.exports = Tooltip;

},{}],72:[function(require,module,exports){
'use strict';

var Collapse = require('./components/collapse');
var RadioToggleGroup = require('./components/radio-toggle-content');
var CheckboxToggleContent = require('./components/checkbox-toggle-content');
var Dropdown = require('./components/dropdown');
var Accordion = require('./components/accordion');
var ResponsiveTable = require('./components/table');
var Tabnav = require('./components/tabnav');
var Tooltip = require('./components/tooltip');
var SetTabIndex = require('./components/skipnav');
var Navigation = require('./components/navigation');
var InputRegexMask = require('./components/regex-input-mask');

/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require('./polyfills');

var init = function init() {

  new Navigation();

  var jsSelectorRegex = document.querySelectorAll('input[data-input-regex]');
  for (var c = 0; c < jsSelectorRegex.length; c++) {
    new InputRegexMask(jsSelectorRegex[c]);
  }
  var jsSelectorTabindex = document.querySelectorAll('.skipnav[href^="#"]');
  for (var _c = 0; _c < jsSelectorTabindex.length; _c++) {
    new SetTabIndex(jsSelectorTabindex[_c]);
  }
  var jsSelectorTooltip = document.getElementsByClassName('js-tooltip');
  for (var _c2 = 0; _c2 < jsSelectorTooltip.length; _c2++) {
    new Tooltip(jsSelectorTooltip[_c2]);
  }
  var jsSelectorTabnav = document.getElementsByClassName('tabnav');
  for (var _c3 = 0; _c3 < jsSelectorTabnav.length; _c3++) {
    new Tabnav(jsSelectorTabnav[_c3]);
  }

  var jsSelectorAccordion = document.getElementsByClassName('accordion');
  for (var _c4 = 0; _c4 < jsSelectorAccordion.length; _c4++) {
    new Accordion(jsSelectorAccordion[_c4]);
  }
  var jsSelectorAccordionBordered = document.querySelectorAll('.accordion-bordered:not(.accordion)');
  for (var _c5 = 0; _c5 < jsSelectorAccordionBordered.length; _c5++) {
    new Accordion(jsSelectorAccordionBordered[_c5]);
  }

  var jsSelectorTable = document.querySelectorAll('table:not(.dataTable)');
  for (var _c6 = 0; _c6 < jsSelectorTable.length; _c6++) {
    new ResponsiveTable(jsSelectorTable[_c6]);
  }

  var jsSelectorCollapse = document.getElementsByClassName('js-collapse');
  for (var _c7 = 0; _c7 < jsSelectorCollapse.length; _c7++) {
    new Collapse(jsSelectorCollapse[_c7]);
  }

  var jsSelectorRadioCollapse = document.getElementsByClassName('js-radio-toggle-group');
  for (var _c8 = 0; _c8 < jsSelectorRadioCollapse.length; _c8++) {
    new RadioToggleGroup(jsSelectorRadioCollapse[_c8]);
  }

  var jsSelectorCheckboxCollapse = document.getElementsByClassName('js-checkbox-toggle-content');
  for (var _c9 = 0; _c9 < jsSelectorCheckboxCollapse.length; _c9++) {
    new CheckboxToggleContent(jsSelectorCheckboxCollapse[_c9]);
  }

  var jsSelectorDropdown = document.getElementsByClassName('js-dropdown');
  for (var _c10 = 0; _c10 < jsSelectorDropdown.length; _c10++) {
    new Dropdown(jsSelectorDropdown[_c10]);
  }
};

module.exports = { init: init, Collapse: Collapse, RadioToggleGroup: RadioToggleGroup, CheckboxToggleContent: CheckboxToggleContent, Dropdown: Dropdown, ResponsiveTable: ResponsiveTable, Accordion: Accordion, Tabnav: Tabnav, Tooltip: Tooltip, SetTabIndex: SetTabIndex, Navigation: Navigation, InputRegexMask: InputRegexMask };

},{"./components/accordion":61,"./components/checkbox-toggle-content":62,"./components/collapse":63,"./components/dropdown":64,"./components/navigation":65,"./components/radio-toggle-content":66,"./components/regex-input-mask":67,"./components/skipnav":68,"./components/table":69,"./components/tabnav":70,"./components/tooltip":71,"./polyfills":74}],73:[function(require,module,exports){
'use strict';

var elproto = window.HTMLElement.prototype;
var HIDDEN = 'hidden';

if (!(HIDDEN in elproto)) {
  Object.defineProperty(elproto, HIDDEN, {
    get: function get() {
      return this.hasAttribute(HIDDEN);
    },
    set: function set(value) {
      if (value) {
        this.setAttribute(HIDDEN, '');
      } else {
        this.removeAttribute(HIDDEN);
      }
    }
  });
}

},{}],74:[function(require,module,exports){
'use strict';
// polyfills HTMLElement.prototype.classList and DOMTokenList

require('classlist-polyfill');
// polyfills HTMLElement.prototype.hidden
require('./element-hidden');

require('core-js/fn/object/assign');
require('core-js/fn/array/from');

},{"./element-hidden":73,"classlist-polyfill":2,"core-js/fn/array/from":3,"core-js/fn/object/assign":4}],75:[function(require,module,exports){
'use strict';

/**
 * @name closest
 * @desc get nearest parent element matching selector.
 * @param {HTMLElement} el - The HTML element where the search starts.
 * @param {string} selector - Selector to be found.
 * @return {HTMLElement} - Nearest parent element matching selector.
 */

module.exports = function closest(el, selector) {
  var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

  while (el) {
    if (matchesSelector.call(el, selector)) {
      break;
    }
    el = el.parentElement;
  }
  return el;
};

},{}],76:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;

  var rect = el.getBoundingClientRect();

  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}

module.exports = isElementInViewport;

},{}],77:[function(require,module,exports){
'use strict';

/**
 * @name isElement
 * @desc returns whether or not the given argument is a DOM element.
 * @param {any} value
 * @return {boolean}
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isElement = function isElement(value) {
  return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.nodeType === 1;
};

/**
 * @name select
 * @desc selects elements from the DOM by class selector or ID selector.
 * @param {string} selector - The selector to traverse the DOM with.
 * @param {Document|HTMLElement?} context - The context to traverse the DOM
 *   in. If not provided, it defaults to the document.
 * @return {HTMLElement[]} - An array of DOM nodes or an empty array.
 */
module.exports = function select(selector, context) {

  if (typeof selector !== 'string') {
    return [];
  }

  if (!context || !isElement(context)) {
    context = window.document;
  }

  var selection = context.querySelectorAll(selector);
  return Array.prototype.slice.call(selection);
};

},{}],78:[function(require,module,exports){
'use strict';

var EXPANDED = 'aria-expanded';
var CONTROLS = 'aria-controls';
var HIDDEN = 'aria-hidden';

module.exports = function (button, expanded) {

  if (typeof expanded !== 'boolean') {
    expanded = button.getAttribute(EXPANDED) === 'false';
  }
  button.setAttribute(EXPANDED, expanded);
  var id = button.getAttribute(CONTROLS);
  var controls = document.getElementById(id);
  if (!controls) {
    throw new Error('No toggle target found with id: "' + id + '"');
  }

  controls.setAttribute(HIDDEN, !expanded);
  return expanded;
};

},{}]},{},[72])(72)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9vbmNlL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWNjb3JkaW9uLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jb2xsYXBzZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbmF2aWdhdGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzay5qcyIsInNyYy9qcy9jb21wb25lbnRzL3NraXBuYXYuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYm5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3Rvb2x0aXAuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvcG9seWZpbGxzL2VsZW1lbnQtaGlkZGVuLmpzIiwic3JjL2pzL3BvbHlmaWxscy9pbmRleC5qcyIsInNyYy9qcy91dGlscy9jbG9zZXN0LmpzIiwic3JjL2pzL3V0aWxzL2lzLWluLXZpZXdwb3J0LmpzIiwic3JjL2pzL3V0aWxzL3NlbGVjdC5qcyIsInNyYy9qcy91dGlscy90b2dnbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxPQUFULENBQWtCLEdBQWxCLEVBQXVCLFFBQXZCLEVBQWlDLE9BQWpDLEVBQTBDO0FBQ3ZELFFBQUksSUFBSSxPQUFSLEVBQWlCO0FBQ2IsWUFBSSxPQUFKLENBQVksUUFBWixFQUFzQixPQUF0QjtBQUNBO0FBQ0g7QUFDRCxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdC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QixDQUFsQjtBQUNBLFNBQU8sTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLENBQTJCLFNBQTNCLENBQVA7QUFDRCxDQVpEOzs7QUNwQkE7O0FBQ0EsSUFBTSxXQUFXLGVBQWpCO0FBQ0EsSUFBTSxXQUFXLGVBQWpCO0FBQ0EsSUFBTSxTQUFTLGFBQWY7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFVBQUMsTUFBRCxFQUFTLFFBQVQsRUFBc0I7O0FBRXJDLE1BQUksT0FBTyxRQUFQLEtBQW9CLFNBQXhCLEVBQW1DO0FBQ2pDLGVBQVcsT0FBTyxZQUFQLENBQW9CLFFBQXBCLE1BQWtDLE9BQTdDO0FBQ0Q7QUFDRCxTQUFPLFlBQVAsQ0FBb0IsUUFBcEIsRUFBOEIsUUFBOUI7QUFDQSxNQUFNLEtBQUssT0FBTyxZQUFQLENBQW9CLFFBQXBCLENBQVg7QUFDQSxNQUFNLFdBQVcsU0FBUyxjQUFULENBQXdCLEVBQXhCLENBQWpCO0FBQ0EsTUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNiLFVBQU0sSUFBSSxLQUFKLENBQ0osc0NBQXNDLEVBQXRDLEdBQTJDLEdBRHZDLENBQU47QUFHRDs7QUFFRCxXQUFTLFlBQVQsQ0FBc0IsTUFBdEIsRUFBOEIsQ0FBQyxRQUEvQjtBQUNBLFNBQU8sUUFBUDtBQUNELENBaEJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBhcnJheS1mb3JlYWNoXG4gKiAgIEFycmF5I2ZvckVhY2ggcG9ueWZpbGwgZm9yIG9sZGVyIGJyb3dzZXJzXG4gKiAgIChQb255ZmlsbDogQSBwb2x5ZmlsbCB0aGF0IGRvZXNuJ3Qgb3ZlcndyaXRlIHRoZSBuYXRpdmUgbWV0aG9kKVxuICogXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHdhZGEvYXJyYXktZm9yZWFjaFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNS0yMDE2IFRha3V0byBXYWRhXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoL2Jsb2IvbWFzdGVyL01JVC1MSUNFTlNFXG4gKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JFYWNoIChhcnksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgaWYgKGFyeS5mb3JFYWNoKSB7XG4gICAgICAgIGFyeS5mb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyeS5sZW5ndGg7IGkrPTEpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBhcnlbaV0sIGksIGFyeSk7XG4gICAgfVxufTtcbiIsIi8qXG4gKiBjbGFzc0xpc3QuanM6IENyb3NzLWJyb3dzZXIgZnVsbCBlbGVtZW50LmNsYXNzTGlzdCBpbXBsZW1lbnRhdGlvbi5cbiAqIDEuMS4yMDE3MDQyN1xuICpcbiAqIEJ5IEVsaSBHcmV5LCBodHRwOi8vZWxpZ3JleS5jb21cbiAqIExpY2Vuc2U6IERlZGljYXRlZCB0byB0aGUgcHVibGljIGRvbWFpbi5cbiAqICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4gKi9cblxuLypnbG9iYWwgc2VsZiwgZG9jdW1lbnQsIERPTUV4Y2VwdGlvbiAqL1xuXG4vKiEgQHNvdXJjZSBodHRwOi8vcHVybC5lbGlncmV5LmNvbS9naXRodWIvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL2NsYXNzTGlzdC5qcyAqL1xuXG5pZiAoXCJkb2N1bWVudFwiIGluIHdpbmRvdy5zZWxmKSB7XG5cbi8vIEZ1bGwgcG9seWZpbGwgZm9yIGJyb3dzZXJzIHdpdGggbm8gY2xhc3NMaXN0IHN1cHBvcnRcbi8vIEluY2x1ZGluZyBJRSA8IEVkZ2UgbWlzc2luZyBTVkdFbGVtZW50LmNsYXNzTGlzdFxuaWYgKCEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKSkgXG5cdHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJiAhKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIikpKSB7XG5cbihmdW5jdGlvbiAodmlldykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaWYgKCEoJ0VsZW1lbnQnIGluIHZpZXcpKSByZXR1cm47XG5cbnZhclxuXHQgIGNsYXNzTGlzdFByb3AgPSBcImNsYXNzTGlzdFwiXG5cdCwgcHJvdG9Qcm9wID0gXCJwcm90b3R5cGVcIlxuXHQsIGVsZW1DdHJQcm90byA9IHZpZXcuRWxlbWVudFtwcm90b1Byb3BdXG5cdCwgb2JqQ3RyID0gT2JqZWN0XG5cdCwgc3RyVHJpbSA9IFN0cmluZ1twcm90b1Byb3BdLnRyaW0gfHwgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csIFwiXCIpO1xuXHR9XG5cdCwgYXJySW5kZXhPZiA9IEFycmF5W3Byb3RvUHJvcF0uaW5kZXhPZiB8fCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdHZhclxuXHRcdFx0ICBpID0gMFxuXHRcdFx0LCBsZW4gPSB0aGlzLmxlbmd0aFxuXHRcdDtcblx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAtMTtcblx0fVxuXHQvLyBWZW5kb3JzOiBwbGVhc2UgYWxsb3cgY29udGVudCBjb2RlIHRvIGluc3RhbnRpYXRlIERPTUV4Y2VwdGlvbnNcblx0LCBET01FeCA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlKSB7XG5cdFx0dGhpcy5uYW1lID0gdHlwZTtcblx0XHR0aGlzLmNvZGUgPSBET01FeGNlcHRpb25bdHlwZV07XG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0fVxuXHQsIGNoZWNrVG9rZW5BbmRHZXRJbmRleCA9IGZ1bmN0aW9uIChjbGFzc0xpc3QsIHRva2VuKSB7XG5cdFx0aWYgKHRva2VuID09PSBcIlwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdCAgXCJTWU5UQVhfRVJSXCJcblx0XHRcdFx0LCBcIkFuIGludmFsaWQgb3IgaWxsZWdhbCBzdHJpbmcgd2FzIHNwZWNpZmllZFwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRpZiAoL1xccy8udGVzdCh0b2tlbikpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIklOVkFMSURfQ0hBUkFDVEVSX0VSUlwiXG5cdFx0XHRcdCwgXCJTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXJcIlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGFyckluZGV4T2YuY2FsbChjbGFzc0xpc3QsIHRva2VuKTtcblx0fVxuXHQsIENsYXNzTGlzdCA9IGZ1bmN0aW9uIChlbGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIHRyaW1tZWRDbGFzc2VzID0gc3RyVHJpbS5jYWxsKGVsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIilcblx0XHRcdCwgY2xhc3NlcyA9IHRyaW1tZWRDbGFzc2VzID8gdHJpbW1lZENsYXNzZXMuc3BsaXQoL1xccysvKSA6IFtdXG5cdFx0XHQsIGkgPSAwXG5cdFx0XHQsIGxlbiA9IGNsYXNzZXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdHRoaXMucHVzaChjbGFzc2VzW2ldKTtcblx0XHR9XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLnRvU3RyaW5nKCkpO1xuXHRcdH07XG5cdH1cblx0LCBjbGFzc0xpc3RQcm90byA9IENsYXNzTGlzdFtwcm90b1Byb3BdID0gW11cblx0LCBjbGFzc0xpc3RHZXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5ldyBDbGFzc0xpc3QodGhpcyk7XG5cdH1cbjtcbi8vIE1vc3QgRE9NRXhjZXB0aW9uIGltcGxlbWVudGF0aW9ucyBkb24ndCBhbGxvdyBjYWxsaW5nIERPTUV4Y2VwdGlvbidzIHRvU3RyaW5nKClcbi8vIG9uIG5vbi1ET01FeGNlcHRpb25zLiBFcnJvcidzIHRvU3RyaW5nKCkgaXMgc3VmZmljaWVudCBoZXJlLlxuRE9NRXhbcHJvdG9Qcm9wXSA9IEVycm9yW3Byb3RvUHJvcF07XG5jbGFzc0xpc3RQcm90by5pdGVtID0gZnVuY3Rpb24gKGkpIHtcblx0cmV0dXJuIHRoaXNbaV0gfHwgbnVsbDtcbn07XG5jbGFzc0xpc3RQcm90by5jb250YWlucyA9IGZ1bmN0aW9uICh0b2tlbikge1xuXHR0b2tlbiArPSBcIlwiO1xuXHRyZXR1cm4gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSAhPT0gLTE7XG59O1xuY2xhc3NMaXN0UHJvdG8uYWRkID0gZnVuY3Rpb24gKCkge1xuXHR2YXJcblx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdCwgaSA9IDBcblx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0LCB0b2tlblxuXHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpZiAoY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMucHVzaCh0b2tlbik7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0XHQsIGluZGV4XG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0d2hpbGUgKGluZGV4ICE9PSAtMSkge1xuXHRcdFx0dGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0fVxuXHR9XG5cdHdoaWxlICgrK2kgPCBsKTtcblxuXHRpZiAodXBkYXRlZCkge1xuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9nZ2xlID0gZnVuY3Rpb24gKHRva2VuLCBmb3JjZSkge1xuXHR0b2tlbiArPSBcIlwiO1xuXG5cdHZhclxuXHRcdCAgcmVzdWx0ID0gdGhpcy5jb250YWlucyh0b2tlbilcblx0XHQsIG1ldGhvZCA9IHJlc3VsdCA/XG5cdFx0XHRmb3JjZSAhPT0gdHJ1ZSAmJiBcInJlbW92ZVwiXG5cdFx0OlxuXHRcdFx0Zm9yY2UgIT09IGZhbHNlICYmIFwiYWRkXCJcblx0O1xuXG5cdGlmIChtZXRob2QpIHtcblx0XHR0aGlzW21ldGhvZF0odG9rZW4pO1xuXHR9XG5cblx0aWYgKGZvcmNlID09PSB0cnVlIHx8IGZvcmNlID09PSBmYWxzZSkge1xuXHRcdHJldHVybiBmb3JjZTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gIXJlc3VsdDtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5qb2luKFwiIFwiKTtcbn07XG5cbmlmIChvYmpDdHIuZGVmaW5lUHJvcGVydHkpIHtcblx0dmFyIGNsYXNzTGlzdFByb3BEZXNjID0ge1xuXHRcdCAgZ2V0OiBjbGFzc0xpc3RHZXR0ZXJcblx0XHQsIGVudW1lcmFibGU6IHRydWVcblx0XHQsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHR9O1xuXHR0cnkge1xuXHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0fSBjYXRjaCAoZXgpIHsgLy8gSUUgOCBkb2Vzbid0IHN1cHBvcnQgZW51bWVyYWJsZTp0cnVlXG5cdFx0Ly8gYWRkaW5nIHVuZGVmaW5lZCB0byBmaWdodCB0aGlzIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9pc3N1ZXMvMzZcblx0XHQvLyBtb2Rlcm5pZSBJRTgtTVNXNyBtYWNoaW5lIGhhcyBJRTggOC4wLjYwMDEuMTg3MDIgYW5kIGlzIGFmZmVjdGVkXG5cdFx0aWYgKGV4Lm51bWJlciA9PT0gdW5kZWZpbmVkIHx8IGV4Lm51bWJlciA9PT0gLTB4N0ZGNUVDNTQpIHtcblx0XHRcdGNsYXNzTGlzdFByb3BEZXNjLmVudW1lcmFibGUgPSBmYWxzZTtcblx0XHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0XHR9XG5cdH1cbn0gZWxzZSBpZiAob2JqQ3RyW3Byb3RvUHJvcF0uX19kZWZpbmVHZXR0ZXJfXykge1xuXHRlbGVtQ3RyUHJvdG8uX19kZWZpbmVHZXR0ZXJfXyhjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RHZXR0ZXIpO1xufVxuXG59KHdpbmRvdy5zZWxmKSk7XG5cbn1cblxuLy8gVGhlcmUgaXMgZnVsbCBvciBwYXJ0aWFsIG5hdGl2ZSBjbGFzc0xpc3Qgc3VwcG9ydCwgc28ganVzdCBjaGVjayBpZiB3ZSBuZWVkXG4vLyB0byBub3JtYWxpemUgdGhlIGFkZC9yZW1vdmUgYW5kIHRvZ2dsZSBBUElzLlxuXG4oZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtcblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYzFcIiwgXCJjMlwiKTtcblxuXHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAvMTEgYW5kIEZpcmVmb3ggPDI2LCB3aGVyZSBjbGFzc0xpc3QuYWRkIGFuZFxuXHQvLyBjbGFzc0xpc3QucmVtb3ZlIGV4aXN0IGJ1dCBzdXBwb3J0IG9ubHkgb25lIGFyZ3VtZW50IGF0IGEgdGltZS5cblx0aWYgKCF0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjMlwiKSkge1xuXHRcdHZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QpIHtcblx0XHRcdHZhciBvcmlnaW5hbCA9IERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXTtcblxuXHRcdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odG9rZW4pIHtcblx0XHRcdFx0dmFyIGksIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdFx0dG9rZW4gPSBhcmd1bWVudHNbaV07XG5cdFx0XHRcdFx0b3JpZ2luYWwuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcblx0XHRjcmVhdGVNZXRob2QoJ2FkZCcpO1xuXHRcdGNyZWF0ZU1ldGhvZCgncmVtb3ZlJyk7XG5cdH1cblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYzNcIiwgZmFsc2UpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMCBhbmQgRmlyZWZveCA8MjQsIHdoZXJlIGNsYXNzTGlzdC50b2dnbGUgZG9lcyBub3Rcblx0Ly8gc3VwcG9ydCB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuXHRpZiAodGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzNcIikpIHtcblx0XHR2YXIgX3RvZ2dsZSA9IERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlO1xuXG5cdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbih0b2tlbiwgZm9yY2UpIHtcblx0XHRcdGlmICgxIGluIGFyZ3VtZW50cyAmJiAhdGhpcy5jb250YWlucyh0b2tlbikgPT09ICFmb3JjZSkge1xuXHRcdFx0XHRyZXR1cm4gZm9yY2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gX3RvZ2dsZS5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH1cblxuXHR0ZXN0RWxlbWVudCA9IG51bGw7XG59KCkpO1xuXG59XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LmFycmF5LmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLkFycmF5LmZyb207XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3QuYXNzaWduO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pIHtcbiAgICAgIGlmIChPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG4iLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBBUkcgPSBjb2YoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi41LjcnIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGlmIChpbmRleCBpbiBvYmplY3QpICRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBzb3VyY2UpIHtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkY7XG4gIHZhciBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HO1xuICB2YXIgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuUztcbiAgdmFyIElTX1BST1RPID0gdHlwZSAmICRleHBvcnQuUDtcbiAgdmFyIElTX0JJTkQgPSB0eXBlICYgJGV4cG9ydC5CO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIHx8IChnbG9iYWxbbmFtZV0gPSB7fSkgOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KTtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBleHAgPSBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYgKHRhcmdldCkgcmVkZWZpbmUodGFyZ2V0LCBrZXksIG91dCwgdHlwZSAmICRleHBvcnQuVSk7XG4gICAgLy8gZXhwb3J0XG4gICAgaWYgKGV4cG9ydHNba2V5XSAhPSBvdXQpIGhpZGUoZXhwb3J0cywga2V5LCBleHApO1xuICAgIGlmIChJU19QUk9UTyAmJiBleHBQcm90b1trZXldICE9IG91dCkgZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciAkaXRlckNyZWF0ZSA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1kgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSk7IC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbnZhciBGRl9JVEVSQVRPUiA9ICdAQGl0ZXJhdG9yJztcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIGlmICghQlVHR1kgJiYga2luZCBpbiBwcm90bykgcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVM7XG4gIHZhciBWQUxVRVNfQlVHID0gZmFsc2U7XG4gIHZhciBwcm90byA9IEJhc2UucHJvdG90eXBlO1xuICB2YXIgJG5hdGl2ZSA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXTtcbiAgdmFyICRkZWZhdWx0ID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVCk7XG4gIHZhciAkZW50cmllcyA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWQ7XG4gIHZhciAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZTtcbiAgdmFyIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYgKCRhbnlOYXRpdmUpIHtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEl0ZXJhdG9yUHJvdG90eXBlLm5leHQpIHtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZiAoIUxJQlJBUlkgJiYgdHlwZW9mIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXSAhPSAnZnVuY3Rpb24nKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUykge1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZiAoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpIHtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddID0gcmV0dXJuVGhpcztcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIGlmICghKGtleSBpbiBwcm90bykpIHJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCJ2YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbiAoKSB7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uICgpIHsgdGhyb3cgMjsgfSk7XG59IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgc2tpcENsb3NpbmcpIHtcbiAgaWYgKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IFs3XTtcbiAgICB2YXIgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7IGRvbmU6IHNhZmUgPSB0cnVlIH07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciAkYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICB2YXIgQSA9IHt9O1xuICB2YXIgQiA9IHt9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgdmFyIFMgPSBTeW1ib2woKTtcbiAgdmFyIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAoaykgeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCA9IHRvT2JqZWN0KHRhcmdldCk7XG4gIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgd2hpbGUgKGFMZW4gPiBpbmRleCkge1xuICAgIHZhciBTID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgIHZhciBrZXlzID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGogPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGopIGlmIChpc0VudW0uY2FsbChTLCBrZXkgPSBrZXlzW2orK10pKSBUW2tleV0gPSBTW2tleV07XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSBpZiAoa2V5ICE9IElFX1BST1RPKSBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBTUkMgPSByZXF1aXJlKCcuL191aWQnKSgnc3JjJyk7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciAkdG9TdHJpbmcgPSBGdW5jdGlvbltUT19TVFJJTkddO1xudmFyIFRQTCA9ICgnJyArICR0b1N0cmluZykuc3BsaXQoVE9fU1RSSU5HKTtcblxucmVxdWlyZSgnLi9fY29yZScpLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuICR0b1N0cmluZy5jYWxsKGl0KTtcbn07XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBrZXksIHZhbCwgc2FmZSkge1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJztcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsICduYW1lJykgfHwgaGlkZSh2YWwsICduYW1lJywga2V5KTtcbiAgaWYgKE9ba2V5XSA9PT0gdmFsKSByZXR1cm47XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCBTUkMpIHx8IGhpZGUodmFsLCBTUkMsIE9ba2V5XSA/ICcnICsgT1trZXldIDogVFBMLmpvaW4oU3RyaW5nKGtleSkpKTtcbiAgaWYgKE8gPT09IGdsb2JhbCkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIGlmICghc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH0gZWxzZSBpZiAoT1trZXldKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2Uge1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgJiYgdGhpc1tTUkNdIHx8ICR0b1N0cmluZy5jYWxsKHRoaXMpO1xufSk7XG4iLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIHRhZywgc3RhdCkge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkgZGVmKGl0LCBUQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnIH0pO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiBjb3JlLnZlcnNpb24sXG4gIG1vZGU6IHJlcXVpcmUoJy4vX2xpYnJhcnknKSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDE4IERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG4iLCJ2YXIgc3RvcmUgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sO1xudmFyIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSAvKiAsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkICovKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdChhcnJheUxpa2UpO1xuICAgIHZhciBDID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheTtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG1hcGZuID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihPKTtcbiAgICB2YXIgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmIChtYXBwaW5nKSBtYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmIChpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSkge1xuICAgICAgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQygpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IgKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYsICdPYmplY3QnLCB7IGFzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGluZGV4ID0gdGhpcy5faTtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gTy5sZW5ndGgpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHsgdmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZSB9O1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9uY2UobGlzdGVuZXIsIG9wdGlvbnMpIHtcbiAgdmFyIHdyYXBwZWQgPSBmdW5jdGlvbiB3cmFwcGVkT25jZShlKSB7XG4gICAgZS5jdXJyZW50VGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZS50eXBlLCB3cmFwcGVkLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbGlzdGVuZXIuY2FsbCh0aGlzLCBlKTtcbiAgfTtcbiAgcmV0dXJuIHdyYXBwZWQ7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCB0b2dnbGUgPSByZXF1aXJlKCcuLi91dGlscy90b2dnbGUnKTtcbmNvbnN0IGlzRWxlbWVudEluVmlld3BvcnQgPSByZXF1aXJlKCcuLi91dGlscy9pcy1pbi12aWV3cG9ydCcpO1xuY29uc3QgQlVUVE9OID0gYC5hY2NvcmRpb24tYnV0dG9uW2FyaWEtY29udHJvbHNdYDtcbmNvbnN0IEVYUEFOREVEID0gJ2FyaWEtZXhwYW5kZWQnO1xuY29uc3QgTVVMVElTRUxFQ1RBQkxFID0gJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJztcblxuY2xhc3MgQWNjb3JkaW9ue1xuICBjb25zdHJ1Y3RvciAoYWNjb3JkaW9uKXtcbiAgICB0aGlzLmFjY29yZGlvbiA9IGFjY29yZGlvbjtcbiAgICB0aGlzLmJ1dHRvbnMgPSBhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xuICAgIHRoaXMuZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgIHRoaXMuZXZlbnRDbG9zZS5pbml0RXZlbnQoJ2Zkcy5hY2NvcmRpb24uY2xvc2UnLCB0cnVlLCB0cnVlKTtcbiAgICB0aGlzLmV2ZW50T3BlbiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgIHRoaXMuZXZlbnRPcGVuLmluaXRFdmVudCgnZmRzLmFjY29yZGlvbi5vcGVuJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0ICgpe1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBjdXJyZW50QnV0dG9uID0gdGhpcy5idXR0b25zW2ldO1xuXG4gICAgICBsZXQgZXhwYW5kZWQgPSBjdXJyZW50QnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJztcbiAgICAgIHRvZ2dsZUJ1dHRvbihjdXJyZW50QnV0dG9uLCBleHBhbmRlZCk7XG5cbiAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgY3VycmVudEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoYXQuZXZlbnRPbkNsaWNrLCBmYWxzZSk7XG4gICAgICBjdXJyZW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhhdC5ldmVudE9uQ2xpY2ssIGZhbHNlKTtcblxuICAgIH1cbiAgfVxuXG5cbiAgZXZlbnRPbkNsaWNrIChldmVudCl7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgbGV0IGJ1dHRvbiA9IHRoaXM7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0b2dnbGVCdXR0b24oYnV0dG9uKTtcbiAgICBpZiAoYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJykge1xuICAgICAgLy8gV2Ugd2VyZSBqdXN0IGV4cGFuZGVkLCBidXQgaWYgYW5vdGhlciBhY2NvcmRpb24gd2FzIGFsc28ganVzdFxuICAgICAgLy8gY29sbGFwc2VkLCB3ZSBtYXkgbm8gbG9uZ2VyIGJlIGluIHRoZSB2aWV3cG9ydC4gVGhpcyBlbnN1cmVzXG4gICAgICAvLyB0aGF0IHdlIGFyZSBzdGlsbCB2aXNpYmxlLCBzbyB0aGUgdXNlciBpc24ndCBjb25mdXNlZC5cbiAgICAgIGlmICghaXNFbGVtZW50SW5WaWV3cG9ydChidXR0b24pKSBidXR0b24uc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUb2dnbGUgYSBidXR0b24ncyBcInByZXNzZWRcIiBzdGF0ZSwgb3B0aW9uYWxseSBwcm92aWRpbmcgYSB0YXJnZXRcbiAgICogc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxuICAgKiBAcGFyYW0ge2Jvb2xlYW4/fSBleHBhbmRlZCBJZiBubyBzdGF0ZSBpcyBwcm92aWRlZCwgdGhlIGN1cnJlbnRcbiAgICogc3RhdGUgd2lsbCBiZSB0b2dnbGVkIChmcm9tIGZhbHNlIHRvIHRydWUsIGFuZCB2aWNlLXZlcnNhKS5cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gdGhlIHJlc3VsdGluZyBzdGF0ZVxuICAgKi9cbn1cblxudmFyIHRvZ2dsZUJ1dHRvbiAgPSBmdW5jdGlvbiAoYnV0dG9uLCBleHBhbmRlZCkge1xuICBsZXQgYWNjb3JkaW9uID0gbnVsbDtcbiAgaWYoYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbicpKXtcbiAgICBhY2NvcmRpb24gPSBidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICB9XG5cbiAgbGV0IGV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgZXZlbnRDbG9zZS5pbml0RXZlbnQoJ2Zkcy5hY2NvcmRpb24uY2xvc2UnLCB0cnVlLCB0cnVlKTtcbiAgbGV0IGV2ZW50T3BlbiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICBldmVudE9wZW4uaW5pdEV2ZW50KCdmZHMuYWNjb3JkaW9uLm9wZW4nLCB0cnVlLCB0cnVlKTtcbiAgZXhwYW5kZWQgPSB0b2dnbGUoYnV0dG9uLCBleHBhbmRlZCk7XG5cbiAgaWYoZXhwYW5kZWQpe1xuICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XG4gIH0gZWxzZXtcbiAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcbiAgfVxuXG4gIC8vIFhYWCBtdWx0aXNlbGVjdGFibGUgaXMgb3B0LWluLCB0byBwcmVzZXJ2ZSBsZWdhY3kgYmVoYXZpb3JcbiAgbGV0IG11bHRpc2VsZWN0YWJsZSA9IGZhbHNlO1xuICBpZihhY2NvcmRpb24gIT09IG51bGwgJiYgYWNjb3JkaW9uLmdldEF0dHJpYnV0ZShNVUxUSVNFTEVDVEFCTEUpID09PSAndHJ1ZScpe1xuICAgIG11bHRpc2VsZWN0YWJsZSA9IHRydWU7XG4gIH1cblxuICBpZiAoZXhwYW5kZWQgJiYgIW11bHRpc2VsZWN0YWJsZSkge1xuICAgIGxldCBidXR0b25zID0gWyBidXR0b24gXTtcbiAgICBpZihhY2NvcmRpb24gIT09IG51bGwpIHtcbiAgICAgIGJ1dHRvbnMgPSBhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xuICAgIH1cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGN1cnJlbnRCdXR0dG9uID0gYnV0dG9uc1tpXTtcbiAgICAgIGlmIChjdXJyZW50QnV0dHRvbiAhPT0gYnV0dG9uKSB7XG4gICAgICAgIHRvZ2dsZShjdXJyZW50QnV0dHRvbiwgZmFsc2UpO1xuICAgICAgICBjdXJyZW50QnV0dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFjY29yZGlvbjtcbiIsIid1c2Ugc3RyaWN0JztcbmNsYXNzIENoZWNrYm94VG9nZ2xlQ29udGVudHtcbiAgICBjb25zdHJ1Y3RvcihlbCl7XG4gICAgICAgIHRoaXMuanNUb2dnbGVUcmlnZ2VyID0gJy5qcy1jaGVja2JveC10b2dnbGUtY29udGVudCc7XG4gICAgICAgIHRoaXMuanNUb2dnbGVUYXJnZXQgPSAnZGF0YS1qcy10YXJnZXQnO1xuICAgICAgICB0aGlzLmV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgdGhpcy5ldmVudENsb3NlLmluaXRFdmVudCgnZmRzLmNvbGxhcHNlLmNsb3NlJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZXZlbnRPcGVuID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgIHRoaXMuZXZlbnRPcGVuLmluaXRFdmVudCgnZmRzLmNvbGxhcHNlLm9wZW4nLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XG4gICAgICAgIHRoaXMuY2hlY2tib3hFbCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5pbml0KGVsKTtcbiAgICB9XG5cbiAgICBpbml0KGVsKXtcbiAgICAgICAgdGhpcy5jaGVja2JveEVsID0gZWw7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGVja2JveEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgdGhhdC50b2dnbGUodGhhdC5jaGVja2JveEVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudG9nZ2xlKHRoaXMuY2hlY2tib3hFbCk7XG4gICAgfVxuXG4gICAgdG9nZ2xlKHRyaWdnZXJFbCl7XG4gICAgICAgIHZhciB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZSh0aGlzLmpzVG9nZ2xlVGFyZ2V0KVxuICAgICAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldEF0dHIpO1xuICAgICAgICAgICAgaWYodGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgaWYodHJpZ2dlckVsLmNoZWNrZWQpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKXtcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRPcGVuKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjbG9zZSh0cmlnZ2VyRWwsIHRhcmdldEVsKXtcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRDbG9zZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hlY2tib3hUb2dnbGVDb250ZW50O1xuIiwiLyoqXG4gKiBDb2xsYXBzZS9leHBhbmQuXG4gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbmNsYXNzIENvbGxhcHNlIHtcbiAgY29uc3RydWN0b3IgKGVsZW1lbnQsIGFjdGlvbiA9ICd0b2dnbGUnKXtcbiAgICB0aGlzLmpzQ29sbGFwc2VUYXJnZXQgPSAnZGF0YS1qcy10YXJnZXQnO1xuICAgIHRoaXMudHJpZ2dlckVsID0gZWxlbWVudDtcbiAgICB0aGlzLnRhcmdldEVsO1xuICAgIHRoaXMuYW5pbWF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5ldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgdGhpcy5ldmVudENsb3NlLmluaXRFdmVudCgnZmRzLmNvbGxhcHNlLmNsb3NlJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgdGhpcy5ldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICB0aGlzLmV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5jb2xsYXBzZS5vcGVuJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgdGhpcy50cmlnZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKXtcbiAgICAgIHRoYXQudG9nZ2xlKCk7XG4gICAgfSk7XG4gIH1cblxuICB0b2dnbGVDb2xsYXBzZSAoZm9yY2VDbG9zZSkge1xuICAgIGxldCB0YXJnZXRBdHRyID0gdGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNDb2xsYXBzZVRhcmdldCk7XG4gICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xuICAgICAgdGhpcy50YXJnZXRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0QXR0cik7XG4gICAgICBpZih0aGlzLnRhcmdldEVsICE9PSBudWxsICYmIHRoaXMudGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIC8vY2hhbmdlIHN0YXRlXG4gICAgICAgIGlmKHRoaXMudHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScgfHwgdGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09IHVuZGVmaW5lZCB8fCBmb3JjZUNsb3NlICl7XG4gICAgICAgICAgLy9jbG9zZVxuICAgICAgICAgIHRoaXMuYW5pbWF0ZUNvbGxhcHNlKCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIC8vb3BlblxuICAgICAgICAgIHRoaXMuYW5pbWF0ZUV4cGFuZCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlICgpe1xuICAgIGlmKHRoaXMudHJpZ2dlckVsICE9PSBudWxsICYmIHRoaXMudHJpZ2dlckVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgdGhpcy50b2dnbGVDb2xsYXBzZSgpO1xuICAgIH1cbiAgfVxuXG5cbiAgYW5pbWF0ZUNvbGxhcHNlICgpIHtcbiAgICBpZighdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyl7XG4gICAgICB0aGlzLmFuaW1hdGVJblByb2dyZXNzID0gdHJ1ZTtcblxuICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSB0aGlzLnRhcmdldEVsLmNsaWVudEhlaWdodCsgJ3B4JztcbiAgICAgIHRoaXMudGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2UtdHJhbnNpdGlvbi1jb2xsYXBzZScpO1xuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKXtcbiAgICAgICAgdGhhdC50YXJnZXRFbC5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICB9LCA1KTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCl7XG4gICAgICAgIHRoYXQudGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG4gICAgICAgIHRoYXQudGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2UtdHJhbnNpdGlvbi1jb2xsYXBzZScpO1xuXG4gICAgICAgIHRoYXQudHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICB0aGF0LmFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIHRoYXQudHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhhdC5ldmVudENsb3NlKTtcbiAgICAgIH0sIDIwMCk7XG4gICAgfVxuICB9XG5cbiAgYW5pbWF0ZUV4cGFuZCAoKSB7XG4gICAgaWYoIXRoaXMuYW5pbWF0ZUluUHJvZ3Jlc3Mpe1xuICAgICAgdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xuICAgICAgbGV0IGV4cGFuZGVkSGVpZ2h0ID0gdGhpcy50YXJnZXRFbC5jbGllbnRIZWlnaHQ7XG4gICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLmhlaWdodCA9ICcwcHgnO1xuICAgICAgdGhpcy50YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZS10cmFuc2l0aW9uLWV4cGFuZCcpO1xuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKXtcbiAgICAgICAgdGhhdC50YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSBleHBhbmRlZEhlaWdodCsgJ3B4JztcbiAgICAgIH0sIDUpO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpe1xuICAgICAgICB0aGF0LnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlLXRyYW5zaXRpb24tZXhwYW5kJyk7XG4gICAgICAgIHRoYXQudGFyZ2V0RWwucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuXG4gICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICB0aGF0LnRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB0aGF0LmFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIHRoYXQudHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhhdC5ldmVudE9wZW4pO1xuICAgICAgfSwgMjAwKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsYXBzZTtcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgY2xvc2VzdCA9IHJlcXVpcmUoJy4uL3V0aWxzL2Nsb3Nlc3QnKTtcclxuY29uc3QgdG9nZ2xlID0gcmVxdWlyZSgnLi4vdXRpbHMvdG9nZ2xlJyk7XHJcbmNvbnN0IEJVVFRPTiA9ICcuanMtZHJvcGRvd24nO1xyXG5jb25zdCBUQVJHRVQgPSAnZGF0YS1qcy10YXJnZXQnO1xyXG5jb25zdCBldmVudENsb3NlTmFtZSA9ICdmZHMuZHJvcGRvd24uY2xvc2UnO1xyXG5jb25zdCBldmVudE9wZW5OYW1lID0gJ2Zkcy5kcm9wZG93bi5vcGVuJztcclxuXHJcbmNvbnN0IG5hdlJlc3BvbnNpdmVCcmVha3BvaW50ID0gOTkyOyAvL3NhbWUgYXMgJG5hdi1yZXNwb25zaXZlLWJyZWFrcG9pbnQgZnJvbSB0aGUgc2Nzcy5cclxuY29uc3QgdHJpbmd1aWRlQnJlYWtwb2ludCA9IDc2ODsgLy9zYW1lIGFzICRuYXYtcmVzcG9uc2l2ZS1icmVha3BvaW50IGZyb20gdGhlIHNjc3MuXHJcblxyXG5jbGFzcyBEcm9wZG93biB7XHJcbiAgY29uc3RydWN0b3IgKGVsKXtcclxuICAgIHRoaXMuanNEcm9wZG93blRyaWdnZXIgPSAnLmpzLWRyb3Bkb3duJztcclxuXHJcbiAgICAvL29wdGlvbjogbWFrZSBkcm9wZG93biBiZWhhdmUgYXMgdGhlIGNvbGxhcHNlIGNvbXBvbmVudCB3aGVuIG9uIHNtYWxsIHNjcmVlbnMgKHVzZWQgYnkgc3VibWVudXMgaW4gdGhlIGhlYWRlciBhbmQgc3RlcC1kcm9wZG93bikuXHJcbiAgICB0aGlzLmpzUmVzcG9uc2l2ZUNvbGxhcHNlTW9kaWZpZXIgPSAnLmpzLWRyb3Bkb3duLS1yZXNwb25zaXZlLWNvbGxhcHNlJztcclxuICAgIHRoaXMucmVmc3BvbnNpdmVDb2xsYXBzZUVuYWJsZWQgPSBmYWxzZTtcclxuICAgIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSBmYWxzZTtcclxuXHJcblxyXG4gICAgdGhpcy50cmlnZ2VyRWwgPSBudWxsO1xyXG4gICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5pbml0KGVsKTtcclxuXHJcbiAgICBpZih0aGlzLnRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0aGlzLnRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRoaXMudGFyZ2V0RWwgIT09IG51bGwgJiYgdGhpcy50YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG5cclxuXHJcbiAgICAgIGlmKHRoaXMudHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykpe1xyXG4gICAgICAgIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvL0NsaWNrZWQgb3V0c2lkZSBkcm9wZG93biAtPiBjbG9zZSBpdFxyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xvc2UpO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xvc2UpO1xyXG4gICAgICAvL0NsaWNrZWQgb24gZHJvcGRvd24gb3BlbiBidXR0b24gLS0+IHRvZ2dsZSBpdFxyXG4gICAgICB0aGlzLnRyaWdnZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZURyb3Bkb3duKTtcclxuICAgICAgdGhpcy50cmlnZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVEcm9wZG93bik7XHJcblxyXG4gICAgICAvLyBzZXQgYXJpYS1oaWRkZW4gY29ycmVjdGx5IGZvciBzY3JlZW5yZWFkZXJzIChUcmluZ3VpZGUgcmVzcG9uc2l2ZSlcclxuICAgICAgaWYodGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy50cmlnZ2VyRWw7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5JbnRlcnNlY3Rpb25PYnNlcnZlcikge1xyXG4gICAgICAgICAgLy8gdHJpZ2dlciBldmVudCB3aGVuIGJ1dHRvbiBjaGFuZ2VzIHZpc2liaWxpdHlcclxuICAgICAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihmdW5jdGlvbiAoZW50cmllcykge1xyXG4gICAgICAgICAgICAvLyBidXR0b24gaXMgdmlzaWJsZVxyXG4gICAgICAgICAgICBpZiAoZW50cmllc1swXS5pbnRlcnNlY3Rpb25SYXRpbykge1xyXG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy8gYnV0dG9uIGlzIG5vdCB2aXNpYmxlXHJcbiAgICAgICAgICAgICAgaWYgKHRoYXQudGFyZ2V0RWwuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAndHJ1ZScpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgcm9vdDogZG9jdW1lbnQuYm9keVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBJRTogSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgaXMgbm90IHN1cHBvcnRlZCwgc28gd2UgbGlzdGVuIGZvciB3aW5kb3cgcmVzaXplIGFuZCBncmlkIGJyZWFrcG9pbnQgaW5zdGVhZFxyXG4gICAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZVN0ZXBndWlkZUNvbGxhcHNlKHRoYXQudHJpZ2dlckVsKSkge1xyXG4gICAgICAgICAgICAvLyBzbWFsbCBzY3JlZW5cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTGFyZ2Ugc2NyZWVuXHJcbiAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChkb1Jlc3BvbnNpdmVTdGVwZ3VpZGVDb2xsYXBzZSh0aGF0LnRyaWdnZXJFbCkpIHtcclxuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgIGV2dCA9IGV2dCB8fCB3aW5kb3cuZXZlbnQ7XHJcbiAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSAyNykge1xyXG4gICAgICAgICAgY2xvc2VBbGwoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0IChlbCl7XHJcbiAgICB0aGlzLnRyaWdnZXJFbCA9IGVsO1xyXG4gICAgaWYodGhpcy50cmlnZ2VyRWwgIT09IG51bGwgJiYgdGhpcy50cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIGxldCB0YXJnZXRBdHRyID0gdGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgICAgIGlmKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICBsZXQgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJykpO1xyXG4gICAgICAgIGlmKHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgdGhpcy50YXJnZXRFbCA9IHRhcmdldEVsO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSBhIGJ1dHRvbidzIFwicHJlc3NlZFwiIHN0YXRlLCBvcHRpb25hbGx5IHByb3ZpZGluZyBhIHRhcmdldFxyXG4gKiBzdGF0ZS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbj99IGV4cGFuZGVkIElmIG5vIHN0YXRlIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudFxyXG4gKiBzdGF0ZSB3aWxsIGJlIHRvZ2dsZWQgKGZyb20gZmFsc2UgdG8gdHJ1ZSwgYW5kIHZpY2UtdmVyc2EpLlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0aGUgcmVzdWx0aW5nIHN0YXRlXHJcbiAqL1xyXG5jb25zdCB0b2dnbGVCdXR0b24gPSAoYnV0dG9uLCBleHBhbmRlZCkgPT4ge1xyXG4gIHRvZ2dsZShidXR0b24sIGV4cGFuZGVkKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgYW4gQXJyYXkgb2YgYnV0dG9uIGVsZW1lbnRzIGJlbG9uZ2luZyBkaXJlY3RseSB0byB0aGUgZ2l2ZW5cclxuICogYWNjb3JkaW9uIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGFjY29yZGlvblxyXG4gKiBAcmV0dXJuIHthcnJheTxIVE1MQnV0dG9uRWxlbWVudD59XHJcbiAqL1xyXG52YXIgZ2V0QnV0dG9ucyA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcclxuICByZXR1cm4gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxufTtcclxudmFyIGNsb3NlQWxsID0gZnVuY3Rpb24gKCl7XHJcblxyXG4gIHZhciBldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgZXZlbnRDbG9zZS5pbml0RXZlbnQoZXZlbnRDbG9zZU5hbWUsIHRydWUsIHRydWUpO1xyXG5cclxuICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG5cclxuICBsZXQgb3ZlcmZsb3dNZW51RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdvdmVyZmxvdy1tZW51Jyk7XHJcbiAgbGV0IHRyaWdnZXJFbCA9IG51bGw7XHJcbiAgbGV0IHRhcmdldEVsID0gbnVsbDtcclxuICBmb3IgKGxldCBvaSA9IDA7IG9pIDwgb3ZlcmZsb3dNZW51RWwubGVuZ3RoOyBvaSsrKSB7XHJcbiAgICBsZXQgY3VycmVudE92ZXJmbG93TWVudUVMID0gb3ZlcmZsb3dNZW51RWxbIG9pIF07XHJcbiAgICBmb3IgKGxldCBhID0gMDsgYSA8IGN1cnJlbnRPdmVyZmxvd01lbnVFTC5jaGlsZE5vZGVzLmxlbmd0aDsgYSsrKSB7XHJcbiAgICAgIGlmIChjdXJyZW50T3ZlcmZsb3dNZW51RUwuY2hpbGROb2Rlc1sgYSBdLnRhZ05hbWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChjdXJyZW50T3ZlcmZsb3dNZW51RUwuY2hpbGROb2Rlc1sgYSBdLmNsYXNzTGlzdC5jb250YWlucygnanMtZHJvcGRvd24nKSkge1xyXG4gICAgICAgICAgdHJpZ2dlckVsID0gY3VycmVudE92ZXJmbG93TWVudUVMLmNoaWxkTm9kZXNbIGEgXTtcclxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRPdmVyZmxvd01lbnVFTC5jaGlsZE5vZGVzWyBhIF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LWlubmVyJykpIHtcclxuICAgICAgICAgIHRhcmdldEVsID0gY3VycmVudE92ZXJmbG93TWVudUVMLmNoaWxkTm9kZXNbIGEgXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0YXJnZXRFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IG51bGwpIHtcclxuICAgICAgaWYgKGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2JpbGVfbmF2LWFjdGl2ZScpKSB7XHJcbiAgICAgICAgaWYgKCFjbG9zZXN0KGN1cnJlbnRPdmVyZmxvd01lbnVFTCwgJy5uYXZiYXInKSkge1xyXG5cclxuICAgICAgICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYodHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSB0cnVlKXtcclxuICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcblxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG52YXIgb2Zmc2V0ID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcclxuICAgIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsXHJcbiAgICBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuICByZXR1cm4geyB0b3A6IHJlY3QudG9wICsgc2Nyb2xsVG9wLCBsZWZ0OiByZWN0LmxlZnQgKyBzY3JvbGxMZWZ0IH1cclxufTtcclxuXHJcbnZhciB0b2dnbGVEcm9wZG93biA9IGZ1bmN0aW9uIChldmVudCwgZm9yY2VDbG9zZSA9IGZhbHNlKSB7XHJcbiAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgdmFyIGV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICBldmVudENsb3NlLmluaXRFdmVudChldmVudENsb3NlTmFtZSwgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG4gIHZhciBldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICBldmVudE9wZW4uaW5pdEV2ZW50KGV2ZW50T3Blbk5hbWUsIHRydWUsIHRydWUpO1xyXG4gIGxldCB0cmlnZ2VyRWwgPSB0aGlzO1xyXG4gIGxldCB0YXJnZXRFbCA9IG51bGw7XHJcbiAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgIGxldCB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZShUQVJHRVQpO1xyXG4gICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgIC8vY2hhbmdlIHN0YXRlXHJcblxyXG4gICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9IG51bGw7XHJcbiAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9IG51bGw7XHJcblxyXG4gICAgdmFyIHJlY3QgPSB0cmlnZ2VyRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBpZih0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJyB8fCBmb3JjZUNsb3NlKXtcclxuICAgICAgLy9jbG9zZVxyXG4gICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY2xvc2VBbGwoKTtcclxuICAgICAgLy9vcGVuXHJcbiAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcclxuICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gICAgICB2YXIgdGFyZ2V0T2Zmc2V0ID0gb2Zmc2V0KHRhcmdldEVsKTtcclxuXHJcbiAgICAgIGlmKHRhcmdldE9mZnNldC5sZWZ0IDwgMCl7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICcwcHgnO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciByaWdodCA9IHRhcmdldE9mZnNldC5sZWZ0ICsgdGFyZ2V0RWwub2Zmc2V0V2lkdGg7XHJcbiAgICAgIGlmKHJpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpe1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnYXV0byc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnMHB4JztcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIG9mZnNldEFnYWluID0gb2Zmc2V0KHRhcmdldEVsKTtcclxuXHJcbiAgICAgIGlmKG9mZnNldEFnYWluLmxlZnQgPCAwKXtcclxuXHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICcwcHgnO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xyXG4gICAgICB9XHJcbiAgICAgIHJpZ2h0ID0gb2Zmc2V0QWdhaW4ubGVmdCArIHRhcmdldEVsLm9mZnNldFdpZHRoO1xyXG4gICAgICBpZihyaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKXtcclxuXHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICdhdXRvJztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICcwcHgnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxufTtcclxuXHJcblxyXG4vKipcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWVcclxuICovXHJcbnZhciBzaG93ID0gZnVuY3Rpb24gKGJ1dHRvbil7XHJcbiAgdG9nZ2xlQnV0dG9uKGJ1dHRvbiwgdHJ1ZSk7XHJcbn07XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cclxuICogQHJldHVybiB7Ym9vbGVhbn0gZmFsc2VcclxuICovXHJcbnZhciBoaWRlID0gZnVuY3Rpb24gKGJ1dHRvbikge1xyXG4gIHRvZ2dsZUJ1dHRvbihidXR0b24sIGZhbHNlKTtcclxufTtcclxuXHJcblxyXG5sZXQgb3V0c2lkZUNsb3NlID0gZnVuY3Rpb24gKGV2dCl7XHJcbiAgbGV0IG9wZW5Ecm9wZG93bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtZHJvcGRvd25bYXJpYS1leHBhbmRlZD10cnVlXScpO1xyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBvcGVuRHJvcGRvd25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgdHJpZ2dlckVsID0gb3BlbkRyb3Bkb3duc1sgaSBdO1xyXG4gICAgbGV0IHRhcmdldEVsID0gbnVsbDtcclxuICAgIGxldCB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZShUQVJHRVQpO1xyXG4gICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoIWRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRyaWdnZXJFbCkpIHtcclxuICAgICAgLy9jbG9zZXMgZHJvcGRvd24gd2hlbiBjbGlja2VkIG91dHNpZGVcclxuICAgICAgaWYgKGV2dC50YXJnZXQgIT09IHRyaWdnZXJFbCkge1xyXG4gICAgICAgIC8vY2xpY2tlZCBvdXRzaWRlIHRyaWdnZXIsIGZvcmNlIGNsb3NlXHJcbiAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuICAgICAgICB2YXIgZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgICAgIGV2ZW50Q2xvc2UuaW5pdEV2ZW50KGV2ZW50Q2xvc2VOYW1lLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcblxyXG5sZXQgZG9SZXNwb25zaXZlQ29sbGFwc2UgPSBmdW5jdGlvbiAodHJpZ2dlckVsKXtcclxuICBsZXQgcmVzcG9uc2l2ZUNvbGxhcHNlRW5hYmxlZCA9IGZhbHNlO1xyXG4gIGxldCByZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuICBpZih0cmlnZ2VyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1kcm9wZG93bi0tcmVzcG9uc2l2ZS1jb2xsYXBzZScpKXtcclxuICAgIHJlc3BvbnNpdmVDb2xsYXBzZUVuYWJsZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYodHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykpe1xyXG4gICAgcmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLy9yZXR1cm5zIHRydWUgaWYgcmVzcG9uc2l2ZSBjb2xsYXBzZSBpcyBlbmFibGVkIGFuZCB3ZSBhcmUgb24gYSBzbWFsbCBzY3JlZW4uXHJcbiAgaWYoKHJlc3BvbnNpdmVDb2xsYXBzZUVuYWJsZWQgfHwgcmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQpICYmIHdpbmRvdy5pbm5lcldpZHRoIDw9IG5hdlJlc3BvbnNpdmVCcmVha3BvaW50KXtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5sZXQgZG9SZXNwb25zaXZlU3RlcGd1aWRlQ29sbGFwc2UgPSBmdW5jdGlvbiAodHJpZ2dlckVsKXtcclxuICBsZXQgcmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgaWYodHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykpe1xyXG4gICAgcmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLy9yZXR1cm5zIHRydWUgaWYgcmVzcG9uc2l2ZSBjb2xsYXBzZSBpcyBlbmFibGVkIGFuZCB3ZSBhcmUgb24gYSBzbWFsbCBzY3JlZW4uXHJcbiAgaWYoKHJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkKSAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSB0cmluZ3VpZGVCcmVha3BvaW50KXtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEcm9wZG93bjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xuY29uc3QgZHJvcGRvd24gPSByZXF1aXJlKCcuL2Ryb3Bkb3duJyk7XG5cbmNvbnN0IE5BViA9IGAubmF2YDtcbmNvbnN0IE5BVl9MSU5LUyA9IGAke05BVn0gYWA7XG5jb25zdCBPUEVORVJTID0gYC5qcy1tZW51LW9wZW5gO1xuY29uc3QgQ0xPU0VfQlVUVE9OID0gYC5qcy1tZW51LWNsb3NlYDtcbmNvbnN0IE9WRVJMQVkgPSBgLm92ZXJsYXlgO1xuY29uc3QgQ0xPU0VSUyA9IGAke0NMT1NFX0JVVFRPTn0sIC5vdmVybGF5YDtcbmNvbnN0IFRPR0dMRVMgPSBbIE5BViwgT1ZFUkxBWSBdLmpvaW4oJywgJyk7XG5cbmNvbnN0IEFDVElWRV9DTEFTUyA9ICdtb2JpbGVfbmF2LWFjdGl2ZSc7XG5jb25zdCBWSVNJQkxFX0NMQVNTID0gJ2lzLXZpc2libGUnO1xuXG5jb25zdCBpc0FjdGl2ZSA9ICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKEFDVElWRV9DTEFTUyk7XG5cbmNvbnN0IF9mb2N1c1RyYXAgPSAodHJhcENvbnRhaW5lcikgPT4ge1xuICAvLyBGaW5kIGFsbCBmb2N1c2FibGUgY2hpbGRyZW5cbiAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPSAnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0nO1xuICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IHRyYXBDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XG4gIGNvbnN0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWyAwIF07XG4gIGNvbnN0IGxhc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbIGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDEgXTtcblxuICBmdW5jdGlvbiB0cmFwVGFiS2V5IChlKSB7XG4gICAgLy8gQ2hlY2sgZm9yIFRBQiBrZXkgcHJlc3NcbiAgICBpZiAoZS5rZXlDb2RlID09PSA5KSB7XG5cbiAgICAgIC8vIFNISUZUICsgVEFCXG4gICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RUYWJTdG9wKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGxhc3RUYWJTdG9wLmZvY3VzKCk7XG4gICAgICAgIH1cblxuICAgICAgLy8gVEFCXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdFRhYlN0b3ApIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFU0NBUEVcbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICB0b2dnbGVOYXYuY2FsbCh0aGlzLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gRm9jdXMgZmlyc3QgY2hpbGRcbiAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XG5cbiAgcmV0dXJuIHtcbiAgICBlbmFibGUgKCkge1xuICAgICAgLy8gTGlzdGVuIGZvciBhbmQgdHJhcCB0aGUga2V5Ym9hcmRcbiAgICAgIHRyYXBDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBUYWJLZXkpO1xuICAgIH0sXG5cbiAgICByZWxlYXNlICgpIHtcbiAgICAgIHRyYXBDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBUYWJLZXkpO1xuICAgIH0sXG4gIH07XG59O1xuXG5sZXQgZm9jdXNUcmFwO1xuXG5jb25zdCB0b2dnbGVOYXYgPSBmdW5jdGlvbiAoYWN0aXZlKSB7XG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICBpZiAodHlwZW9mIGFjdGl2ZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgYWN0aXZlID0gIWlzQWN0aXZlKCk7XG4gIH1cbiAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKEFDVElWRV9DTEFTUywgYWN0aXZlKTtcblxuICBmb3JFYWNoKHNlbGVjdChUT0dHTEVTKSwgZWwgPT4ge1xuICAgIGVsLmNsYXNzTGlzdC50b2dnbGUoVklTSUJMRV9DTEFTUywgYWN0aXZlKTtcbiAgfSk7XG4gIGlmIChhY3RpdmUpIHtcbiAgICBmb2N1c1RyYXAuZW5hYmxlKCk7XG4gIH0gZWxzZSB7XG4gICAgZm9jdXNUcmFwLnJlbGVhc2UoKTtcbiAgfVxuXG4gIGNvbnN0IGNsb3NlQnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XG4gIGNvbnN0IG1lbnVCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoT1BFTkVSUyk7XG5cbiAgaWYgKGFjdGl2ZSAmJiBjbG9zZUJ1dHRvbikge1xuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGFjdGl2YXRlZCwgc28gZm9jdXMgb24gdGhlIGNsb3NlIGJ1dHRvbixcbiAgICAvLyB3aGljaCBpcyBqdXN0IGJlZm9yZSBhbGwgdGhlIG5hdiBlbGVtZW50cyBpbiB0aGUgdGFiIG9yZGVyLlxuICAgIGNsb3NlQnV0dG9uLmZvY3VzKCk7XG4gIH0gZWxzZSBpZiAoIWFjdGl2ZSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBjbG9zZUJ1dHRvbiAmJlxuICAgICAgICAgICAgIG1lbnVCdXR0b24pIHtcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBkZWFjdGl2YXRlZCwgYW5kIGZvY3VzIHdhcyBvbiB0aGUgY2xvc2VcbiAgICAvLyBidXR0b24sIHdoaWNoIGlzIG5vIGxvbmdlciB2aXNpYmxlLiBXZSBkb24ndCB3YW50IHRoZSBmb2N1cyB0b1xuICAgIC8vIGRpc2FwcGVhciBpbnRvIHRoZSB2b2lkLCBzbyBmb2N1cyBvbiB0aGUgbWVudSBidXR0b24gaWYgaXQnc1xuICAgIC8vIHZpc2libGUgKHRoaXMgbWF5IGhhdmUgYmVlbiB3aGF0IHRoZSB1c2VyIHdhcyBqdXN0IGZvY3VzZWQgb24sXG4gICAgLy8gaWYgdGhleSB0cmlnZ2VyZWQgdGhlIG1vYmlsZSBuYXYgYnkgbWlzdGFrZSkuXG4gICAgbWVudUJ1dHRvbi5mb2N1cygpO1xuICB9XG5cbiAgcmV0dXJuIGFjdGl2ZTtcbn07XG5cbmNvbnN0IHJlc2l6ZSA9ICgpID0+IHtcbiAgY29uc3QgY2xvc2VyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XG5cbiAgaWYgKGlzQWN0aXZlKCkgJiYgY2xvc2VyICYmIGNsb3Nlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCA9PT0gMCkge1xuICAgIC8vIFRoZSBtb2JpbGUgbmF2IGlzIGFjdGl2ZSwgYnV0IHRoZSBjbG9zZSBib3ggaXNuJ3QgdmlzaWJsZSwgd2hpY2hcbiAgICAvLyBtZWFucyB0aGUgdXNlcidzIHZpZXdwb3J0IGhhcyBiZWVuIHJlc2l6ZWQgc28gdGhhdCBpdCBpcyBubyBsb25nZXJcbiAgICAvLyBpbiBtb2JpbGUgbW9kZS4gTGV0J3MgbWFrZSB0aGUgcGFnZSBzdGF0ZSBjb25zaXN0ZW50IGJ5XG4gICAgLy8gZGVhY3RpdmF0aW5nIHRoZSBtb2JpbGUgbmF2LlxuICAgIHRvZ2dsZU5hdi5jYWxsKGNsb3NlciwgZmFsc2UpO1xuICB9XG59O1xuXG5jbGFzcyBOYXZpZ2F0aW9uIHtcbiAgY29uc3RydWN0b3IgKCl7XG4gICAgbGV0IG9wZW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKE9QRU5FUlMpO1xuICAgIGZvcihsZXQgbyA9IDA7IG8gPCBvcGVuZXJzLmxlbmd0aDsgbysrKSB7XG4gICAgICBvcGVuZXJzWyBvIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVOYXYpO1xuICAgIH1cblxuICAgIGxldCBjbG9zZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChDTE9TRVJTKTtcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2xvc2Vycy5sZW5ndGg7IGMrKykge1xuICAgICAgY2xvc2Vyc1sgYyBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTmF2KTtcbiAgICB9XG5cbiAgICBsZXQgbmF2TGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKE5BVl9MSU5LUyk7XG4gICAgZm9yKGxldCBuID0gMDsgbiA8IG5hdkxpbmtzLmxlbmd0aDsgbisrKSB7XG4gICAgICBuYXZMaW5rc1sgbiBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gQSBuYXZpZ2F0aW9uIGxpbmsgaGFzIGJlZW4gY2xpY2tlZCEgV2Ugd2FudCB0byBjb2xsYXBzZSBhbnlcbiAgICAgICAgLy8gaGllcmFyY2hpY2FsIG5hdmlnYXRpb24gVUkgaXQncyBhIHBhcnQgb2YsIHNvIHRoYXQgdGhlIHVzZXJcbiAgICAgICAgLy8gY2FuIGZvY3VzIG9uIHdoYXRldmVyIHRoZXkndmUganVzdCBzZWxlY3RlZC5cblxuICAgICAgICAvLyBTb21lIG5hdmlnYXRpb24gbGlua3MgYXJlIGluc2lkZSBkcm9wZG93bnM7IHdoZW4gdGhleSdyZVxuICAgICAgICAvLyBjbGlja2VkLCB3ZSB3YW50IHRvIGNvbGxhcHNlIHRob3NlIGRyb3Bkb3ducy5cblxuXG4gICAgICAgIC8vIElmIHRoZSBtb2JpbGUgbmF2aWdhdGlvbiBtZW51IGlzIGFjdGl2ZSwgd2Ugd2FudCB0byBoaWRlIGl0LlxuICAgICAgICBpZiAoaXNBY3RpdmUoKSkge1xuICAgICAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0ICgpIHtcbiAgICBjb25zdCB0cmFwQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoTkFWKTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdHJhcENvbnRhaW5lcnMubGVuZ3RoOyBpKyspe1xuICAgICAgICBmb2N1c1RyYXAgPSBfZm9jdXNUcmFwKHRyYXBDb250YWluZXJzW2ldKTtcbiAgICB9XG5cbiAgICByZXNpemUoKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplLCBmYWxzZSk7XG4gIH1cblxuICB0ZWFyZG93biAoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSwgZmFsc2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmF2aWdhdGlvbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgUmFkaW9Ub2dnbGVHcm91cHtcbiAgICBjb25zdHJ1Y3RvcihlbCl7XG4gICAgICAgIHRoaXMuanNUb2dnbGVUcmlnZ2VyID0gJy5qcy1yYWRpby10b2dnbGUtZ3JvdXAnO1xuICAgICAgICB0aGlzLmpzVG9nZ2xlVGFyZ2V0ID0gJ2RhdGEtanMtdGFyZ2V0JztcblxuICAgICAgICB0aGlzLmV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgdGhpcy5ldmVudENsb3NlLmluaXRFdmVudCgnZmRzLmNvbGxhcHNlLmNsb3NlJywgdHJ1ZSwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5ldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgdGhpcy5ldmVudE9wZW4uaW5pdEV2ZW50KCdmZHMuY29sbGFwc2Uub3BlbicsIHRydWUsIHRydWUpO1xuICAgICAgICB0aGlzLnJhZGlvRWxzID0gbnVsbDtcbiAgICAgICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5pbml0KGVsKTtcbiAgICB9XG5cbiAgICBpbml0IChlbCl7XG4gICAgICAgIHRoaXMucmFkaW9Hcm91cCA9IGVsO1xuICAgICAgICB0aGlzLnJhZGlvRWxzID0gdGhpcy5yYWRpb0dyb3VwLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMucmFkaW9FbHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIHZhciByYWRpbyA9IHRoaXMucmFkaW9FbHNbIGkgXTtcbiAgICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgIGZvcihsZXQgYSA9IDA7IGEgPCB0aGF0LnJhZGlvRWxzLmxlbmd0aDsgYSsrICl7XG4gICAgICAgICAgICAgIHRoYXQudG9nZ2xlKHRoYXQucmFkaW9FbHNbIGEgXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnRvZ2dsZShyYWRpbyk7IC8vSW5pdGlhbCB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZSAodHJpZ2dlckVsKXtcbiAgICAgICAgdmFyIHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNUb2dnbGVUYXJnZXQpO1xuICAgICAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldEF0dHIpO1xuICAgICAgICAgICAgaWYodGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgaWYodHJpZ2dlckVsLmNoZWNrZWQpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKXtcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRPcGVuKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjbG9zZSh0cmlnZ2VyRWwsIHRhcmdldEVsKXtcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRDbG9zZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmFkaW9Ub2dnbGVHcm91cDtcbiIsIi8qXG4qIFByZXZlbnRzIHRoZSB1c2VyIGZyb20gaW5wdXR0aW5nIGJhc2VkIG9uIGEgcmVnZXguXG4qIERvZXMgbm90IHdvcmsgdGhlIHNhbWUgd2F5IGFmIDxpbnB1dCBwYXR0ZXJuPVwiXCI+LCB0aGlzIHBhdHRlcm4gaXMgb25seSB1c2VkIGZvciB2YWxpZGF0aW9uLCBub3QgdG8gcHJldmVudCBpbnB1dC5cbiogVXNlY2FzZTogbnVtYmVyIGlucHV0IGZvciBkYXRlLWNvbXBvbmVudC5cbiogRXhhbXBsZSAtIG51bWJlciBvbmx5OiA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWlucHV0LXJlZ2V4PVwiXlxcZCokXCI+XG4qL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBtb2RpZmllclN0YXRlID0ge1xuICBzaGlmdDogZmFsc2UsXG4gIGFsdDogZmFsc2UsXG4gIGN0cmw6IGZhbHNlLFxuICBjb21tYW5kOiBmYWxzZVxufTtcblxuY2xhc3MgSW5wdXRSZWdleE1hc2sge1xuICBjb25zdHJ1Y3RvciAoZWxlbWVudCl7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIHJlZ2V4TWFzayk7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgcmVnZXhNYXNrKTtcbiAgfVxufVxudmFyIHJlZ2V4TWFzayA9IGZ1bmN0aW9uIChldmVudCkge1xuICBpZihtb2RpZmllclN0YXRlLmN0cmwgfHwgbW9kaWZpZXJTdGF0ZS5jb21tYW5kKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuZXdDaGFyID0gbnVsbDtcbiAgaWYodHlwZW9mIGV2ZW50LmtleSAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgIGlmKGV2ZW50LmtleS5sZW5ndGggPT09IDEpe1xuICAgICAgbmV3Q2hhciA9IGV2ZW50LmtleTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYoIWV2ZW50LmNoYXJDb2RlKXtcbiAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmtleUNvZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5jaGFyQ29kZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHJlZ2V4U3RyID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5wdXQtcmVnZXgnKTtcblxuICBpZihldmVudC50eXBlICE9PSB1bmRlZmluZWQgJiYgZXZlbnQudHlwZSA9PT0gJ3Bhc3RlJyl7XG4gICAgY29uc29sZS5sb2coJ3Bhc3RlJyk7XG4gIH0gZWxzZXtcbiAgICB2YXIgZWxlbWVudCA9IG51bGw7XG4gICAgaWYoZXZlbnQudGFyZ2V0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcbiAgICB9XG4gICAgaWYobmV3Q2hhciAhPT0gbnVsbCAmJiBlbGVtZW50ICE9PSBudWxsKSB7XG4gICAgICBpZihuZXdDaGFyLmxlbmd0aCA+IDApe1xuICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICBpZihlbGVtZW50LnR5cGUgPT09ICdudW1iZXInKXtcbiAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMudmFsdWU7Ly9Ob3RlIGlucHV0W3R5cGU9bnVtYmVyXSBkb2VzIG5vdCBoYXZlIC5zZWxlY3Rpb25TdGFydC9FbmQgKENocm9tZSkuXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZS5zbGljZSgwLCBlbGVtZW50LnNlbGVjdGlvblN0YXJ0KSArIHRoaXMudmFsdWUuc2xpY2UoZWxlbWVudC5zZWxlY3Rpb25FbmQpICsgbmV3Q2hhcjsgLy9yZW1vdmVzIHRoZSBudW1iZXJzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCB0aGVuIGFkZHMgbmV3IGNoYXIuXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAocmVnZXhTdHIpO1xuICAgICAgICBpZihyLmV4ZWMobmV3VmFsdWUpID09PSBudWxsKXtcbiAgICAgICAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0UmVnZXhNYXNrO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3Qgb25jZSA9IHJlcXVpcmUoJ3JlY2VwdG9yL29uY2UnKTtcblxuY2xhc3MgU2V0VGFiSW5kZXgge1xuICBjb25zdHJ1Y3RvciAoZWxlbWVudCl7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpe1xuICAgICAgLy8gTkI6IHdlIGtub3cgYmVjYXVzZSBvZiB0aGUgc2VsZWN0b3Igd2UncmUgZGVsZWdhdGluZyB0byBiZWxvdyB0aGF0IHRoZVxuICAgICAgLy8gaHJlZiBhbHJlYWR5IGJlZ2lucyB3aXRoICcjJ1xuICAgICAgY29uc3QgaWQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnaHJlZicpLnNsaWNlKDEpO1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIG9uY2UoZXZlbnQgPT4ge1xuICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgLTEpO1xuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0aHJvdyBhbiBlcnJvcj9cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNldFRhYkluZGV4O1xuIiwiY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XG5cbmNsYXNzIFJlc3BvbnNpdmVUYWJsZSB7XG4gICAgY29uc3RydWN0b3IgKHRhYmxlKSB7XG4gICAgICAgIHRoaXMuaW5zZXJ0SGVhZGVyQXNBdHRyaWJ1dGVzKHRhYmxlKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgZGF0YSBhdHRyaWJ1dGVzIG5lZWRlZCBmb3IgcmVzcG9uc2l2ZSBtb2RlLlxuICAgIGluc2VydEhlYWRlckFzQXR0cmlidXRlcyAodGFibGVFbCl7XG4gICAgICAgIGlmICghdGFibGVFbCkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBoZWFkZXIgPSAgdGFibGVFbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGhlYWQnKTtcbiAgICAgICAgaWYoaGVhZGVyLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgIGxldCBoZWFkZXJDZWxsRWxzID0gaGVhZGVyWyAwIF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoJyk7XG4gICAgICAgICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGhlYWRlckNlbGxFbHMgPSBoZWFkZXJbIDAgXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaGVhZGVyQ2VsbEVscy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGJvZHlSb3dFbHMgPSBzZWxlY3QoJ3Rib2R5IHRyJywgdGFibGVFbCk7XG4gICAgICAgICAgICBBcnJheS5mcm9tKGJvZHlSb3dFbHMpLmZvckVhY2gocm93RWwgPT4ge1xuICAgICAgICAgICAgICBsZXQgY2VsbEVscyA9IHJvd0VsLmNoaWxkcmVuO1xuICAgICAgICAgICAgICBpZiAoY2VsbEVscy5sZW5ndGggPT09IGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbShoZWFkZXJDZWxsRWxzKS5mb3JFYWNoKChoZWFkZXJDZWxsRWwsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vIEdyYWIgaGVhZGVyIGNlbGwgdGV4dCBhbmQgdXNlIGl0IGJvZHkgY2VsbCBkYXRhIHRpdGxlLlxuICAgICAgICAgICAgICAgICAgY2VsbEVsc1sgaSBdLnNldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScsIGhlYWRlckNlbGxFbC50ZXh0Q29udGVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNwb25zaXZlVGFibGU7XG4iLCIndXNlIHN0cmljdCc7XG5jbGFzcyBUYWJuYXYge1xuICBjb25zdHJ1Y3RvciAodGFibmF2KXtcbiAgICB0aGlzLnRhYm5hdiA9IHRhYm5hdjtcbiAgICBsZXQgdGFiTWVudUl0ZW1zID0gdGhpcy50YWJuYXYucXVlcnlTZWxlY3RvckFsbCgnYScpO1xuICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGFiTWVudUl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0YWJNZW51SXRlbXNbIGkgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoYXQuY2hhbmdlRm9jdXNUYWIodGhpcyk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5zZXRUYWIoKTtcbiAgfVxuXG4gIHNldFRhYiAoKXtcbiAgICB2YXIgdGFyZ2V0SUQgPSBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJyk7XG4gICAgaWYodGFyZ2V0SUQgIT0gJycpIHtcbiAgICAgIHZhciB0cmlnZ2VyRUwgPSB0aGlzLnRhYm5hdi5xdWVyeVNlbGVjdG9yKCdhW2hyZWY9XCIjJyt0YXJnZXRJRCsnXCJdJyk7XG4gICAgICB0aGlzLmNoYW5nZUZvY3VzVGFiKHRyaWdnZXJFTCk7XG4gICAgfSBlbHNle1xuICAgICAgLy8gc2V0IG1hcmdpbi1ib3R0b20gb24gdGFibmF2IHNvIGNvbnRlbnQgYmVsb3cgZG9lc24ndCBvdmVybGFwXG5cbiAgICAgIHZhciB0YXJnZXRJZCA9IHRoaXMudGFibmF2LnF1ZXJ5U2VsZWN0b3IoJ2xpLmFjdGl2ZSAudGFibmF2LWl0ZW0nKS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5yZXBsYWNlKCcjJywgJycpO1xuICAgICAgdmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0SWQpKTtcbiAgICAgIHZhciBoZWlnaHQgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRJZCkub2Zmc2V0SGVpZ2h0KSArIHBhcnNlSW50KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ21hcmdpbi1ib3R0b20nKSk7XG5cbiAgICAgIHZhciB3PXdpbmRvdyxcbiAgICAgICAgZD1kb2N1bWVudCxcbiAgICAgICAgZT1kLmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgZz1kLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0sXG4gICAgICAgIHg9dy5pbm5lcldpZHRofHxlLmNsaWVudFdpZHRofHxnLmNsaWVudFdpZHRoO1xuXG4gICAgICBpZih4ID49IDc2OCkge1xuICAgICAgICB0aGlzLnRhYm5hdi5zdHlsZS5tYXJnaW5Cb3R0b20gPSBoZWlnaHQgKyAncHgnO1xuICAgICAgfSBlbHNle1xuICAgICAgICB0aGlzLnRhYm5hdi5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnJztcbiAgICAgIH1cblxuICAgIH1cblxuICB9XG5cbiAgY2hhbmdlRm9jdXNUYWIgKHRyaWdnZXJFbCkge1xuXG4gICAgbGV0IGNoYW5nZVRhYkV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgY2hhbmdlVGFiRXZlbnQuaW5pdEV2ZW50KCdmZHMudGFibmF2LmNoYW5nZWQnLCB0cnVlLCB0cnVlKTtcbiAgICBsZXQgdGFiT3BlbkV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgdGFiT3BlbkV2ZW50LmluaXRFdmVudCgnZmRzLnRhYm5hdi5vcGVuJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbGV0IHRhYkNsb3NlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICB0YWJDbG9zZUV2ZW50LmluaXRFdmVudCgnZmRzLnRhYm5hdi5jbG9zZScsIHRydWUsIHRydWUpO1xuICAgIC8vIGxvb3AgYWxsIGVsZW1lbnRzIGluIGN1cnJlbnQgdGFibmF2IGFuZCBkaXNhYmxlIHRoZW1cbiAgICBsZXQgcGFyZW50Tm9kZSA9IHRyaWdnZXJFbC5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgbGV0IGFsbE5vZGVzID0gdHJpZ2dlckVsLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jaGlsZE5vZGVzO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhbGxOb2Rlc1tpXS5ub2RlTmFtZSA9PT0gJ0xJJykge1xuICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IGFsbE5vZGVzW2ldLmNoaWxkTm9kZXMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgICBpZiAoYWxsTm9kZXNbaV0uY2hpbGROb2Rlc1thXS5ub2RlTmFtZSA9PT0gJ0EnKSB7XG4gICAgICAgICAgICBpZihhbGxOb2Rlc1tpXS5jaGlsZE5vZGVzW2FdLmNsYXNzTGlzdC5jb250YWlucygndGFibmF2LWl0ZW0nKSkge1xuICAgICAgICAgICAgICBpZiAoYWxsTm9kZXNbaV0uY2hpbGROb2Rlc1thXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGFsbE5vZGVzW2ldLmNoaWxkTm9kZXNbYV0uZGlzcGF0Y2hFdmVudCh0YWJDbG9zZUV2ZW50KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGFsbE5vZGVzW2ldLmNoaWxkTm9kZXNbYV0ucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgYWxsTm9kZXNbaV0uY2hpbGROb2Rlc1thXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgIHZhciBub2RlVGFyZ2V0ID0gYWxsTm9kZXNbaV0uY2hpbGROb2Rlc1thXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5yZXBsYWNlKCcjJywgJycpO1xuICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChub2RlVGFyZ2V0KS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGVuYWJsZSBzZWxlY3RlZCB0YWJcbiAgICBsZXQgdGFyZ2V0SWQgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdocmVmJykucmVwbGFjZSgnIycsICcnKTtcbiAgICBpZihoaXN0b3J5LnB1c2hTdGF0ZSkge1xuICAgICAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgJyMnK3RhcmdldElkKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2NhdGlvbi5oYXNoID0gJyMnK3RhcmdldElkO1xuICAgIH1cbiAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XG4gICAgdHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0SWQpLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG4gICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGFiT3BlbkV2ZW50KTtcbiAgICAvLyBzZXQgbWFyZ2luLWJvdHRvbSBvbiB0YWJuYXYgc28gY29udGVudCBiZWxvdyBkb2Vzbid0IG92ZXJsYXBcbiAgICB2YXIgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRJZCkpO1xuICAgIHZhciBoZWlnaHQgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRJZCkub2Zmc2V0SGVpZ2h0KSArIHBhcnNlSW50KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ21hcmdpbi1ib3R0b20nKSk7XG4gICAgcGFyZW50Tm9kZS5zdHlsZS5tYXJnaW5Cb3R0b20gPSBoZWlnaHQgKyAncHgnO1xuXG4gICAgcGFyZW50Tm9kZS5kaXNwYXRjaEV2ZW50KGNoYW5nZVRhYkV2ZW50KTtcblxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGFibmF2O1xuIiwiY2xhc3MgVG9vbHRpcHtcbiAgY29uc3RydWN0b3IoZWxlbWVudCl7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLnNldEV2ZW50cygpO1xuICB9XG5cbiAgc2V0RXZlbnRzICgpe1xuICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICBpZih0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtdHJpZ2dlcicpICE9PSAnY2xpY2snKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBlLnRhcmdldDtcblxuICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSAhPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdmFyIHBvcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nKSB8fCAndG9wJztcblxuICAgICAgICB2YXIgdG9vbHRpcCA9IHRoYXQuY3JlYXRlVG9vbHRpcChlbGVtZW50LCBwb3MpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9vbHRpcCk7XG5cbiAgICAgICAgdGhhdC5wb3NpdGlvbkF0KGVsZW1lbnQsIHRvb2x0aXAsIHBvcyk7XG5cbiAgICAgIH0pO1xuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBlLnRhcmdldDtcblxuICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSAhPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdmFyIHBvcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nKSB8fCAndG9wJztcblxuICAgICAgICB2YXIgdG9vbHRpcCA9IHRoYXQuY3JlYXRlVG9vbHRpcChlbGVtZW50LCBwb3MpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9vbHRpcCk7XG5cbiAgICAgICAgdGhhdC5wb3NpdGlvbkF0KGVsZW1lbnQsIHRvb2x0aXAsIHBvcyk7XG5cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB0b29sdGlwID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgICAgaWYodG9vbHRpcCAhPT0gbnVsbCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSAhPT0gbnVsbCl7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHRvb2x0aXAgPSB0aGlzLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgICBpZih0b29sdGlwICE9PSBudWxsICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApICE9PSBudWxsKXtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcztcbiAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JykgPT09IG51bGwpIHtcbiAgICAgICAgICB2YXIgcG9zID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC1wb3NpdGlvbicpIHx8ICd0b3AnO1xuICAgICAgICAgIHZhciB0b29sdGlwID0gdGhhdC5jcmVhdGVUb29sdGlwKGVsZW1lbnQsIHBvcyk7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b29sdGlwKTtcbiAgICAgICAgICB0aGF0LnBvc2l0aW9uQXQoZWxlbWVudCwgdG9vbHRpcCwgcG9zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgcG9wcGVyID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBvcHBlcikpO1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmICghZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnanMtdG9vbHRpcCcpKSB7XG4gICAgICAgIHRoYXQuY2xvc2VBbGwoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9XG5cbiAgY2xvc2VBbGwgKCl7XG4gICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRvb2x0aXBbYXJpYS1kZXNjcmliZWRieV0nKTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwb3BwZXIgPSBlbGVtZW50c1sgaSBdLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgZWxlbWVudHNbIGkgXS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocG9wcGVyKSk7XG4gICAgfVxuICB9XG4gIGNyZWF0ZVRvb2x0aXAgKGVsZW1lbnQsIHBvcykge1xuICAgIHZhciB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdG9vbHRpcC5jbGFzc05hbWUgPSAndG9vbHRpcC1wb3BwZXInO1xuICAgIHZhciBwb3BwZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1wb3BwZXInKTtcbiAgICB2YXIgaWQgPSAndG9vbHRpcC0nK3BvcHBlcnMubGVuZ3RoKzE7XG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Rvb2x0aXAnKTtcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnLCBwb3MpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgaWQpO1xuXG4gICAgdmFyIHRvb2x0aXBJbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRvb2x0aXBJbm5lci5jbGFzc05hbWUgPSAndG9vbHRpcCc7XG5cbiAgICB2YXIgdG9vbHRpcENvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0b29sdGlwQ29udGVudC5jbGFzc05hbWUgPSAndG9vbHRpcC1jb250ZW50JztcbiAgICB0b29sdGlwQ29udGVudC5pbm5lckhUTUwgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwJyk7XG4gICAgdG9vbHRpcElubmVyLmFwcGVuZENoaWxkKHRvb2x0aXBDb250ZW50KTtcbiAgICB0b29sdGlwLmFwcGVuZENoaWxkKHRvb2x0aXBJbm5lcik7XG5cbiAgICByZXR1cm4gdG9vbHRpcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQb3NpdGlvbnMgdGhlIHRvb2x0aXAuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJlbnQgLSBUaGUgdHJpZ2dlciBvZiB0aGUgdG9vbHRpcC5cbiAgICogQHBhcmFtIHtvYmplY3R9IHRvb2x0aXAgLSBUaGUgdG9vbHRpcCBpdHNlbGYuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwb3NIb3Jpem9udGFsIC0gRGVzaXJlZCBob3Jpem9udGFsIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlbHkgdG8gdGhlIHRyaWdnZXIgKGxlZnQvY2VudGVyL3JpZ2h0KVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcG9zVmVydGljYWwgLSBEZXNpcmVkIHZlcnRpY2FsIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlbHkgdG8gdGhlIHRyaWdnZXIgKHRvcC9jZW50ZXIvYm90dG9tKVxuICAgKlxuICAgKi9cbiAgcG9zaXRpb25BdCAocGFyZW50LCB0b29sdGlwLCBwb3MpIHtcbiAgICB2YXIgcGFyZW50Q29vcmRzID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBsZWZ0LCB0b3A7XG4gICAgdmFyIHRvb2x0aXBXaWR0aCA9IHRvb2x0aXAub2Zmc2V0V2lkdGg7XG5cbiAgICB2YXIgZGlzdCA9IDg7XG5cbiAgICBsZWZ0ID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLmxlZnQpICsgKChwYXJlbnQub2Zmc2V0V2lkdGggLSB0b29sdGlwLm9mZnNldFdpZHRoKSAvIDIpO1xuXG4gICAgc3dpdGNoIChwb3MpIHtcbiAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5ib3R0b20pICsgZGlzdDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICBjYXNlICd0b3AnOlxuICAgICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMudG9wKSAtIHRvb2x0aXAub2Zmc2V0SGVpZ2h0IC0gZGlzdDtcbiAgICB9XG5cbiAgICBpZihsZWZ0IDwgMCkge1xuICAgICAgbGVmdCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5sZWZ0KTtcbiAgICB9XG5cbiAgICBpZigodG9wICsgdG9vbHRpcC5vZmZzZXRIZWlnaHQpID49IHdpbmRvdy5pbm5lckhlaWdodCl7XG4gICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMudG9wKSAtIHRvb2x0aXAub2Zmc2V0SGVpZ2h0IC0gZGlzdDtcbiAgICB9XG5cblxuICAgIHRvcCAgPSAodG9wIDwgMCkgPyBwYXJzZUludChwYXJlbnRDb29yZHMuYm90dG9tKSArIGRpc3QgOiB0b3A7XG4gICAgaWYod2luZG93LmlubmVyV2lkdGggPCAobGVmdCArIHRvb2x0aXBXaWR0aCkpe1xuICAgICAgdG9vbHRpcC5zdHlsZS5yaWdodCA9IGRpc3QgKyAncHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b29sdGlwLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICB9XG4gICAgdG9vbHRpcC5zdHlsZS50b3AgID0gdG9wICsgcGFnZVlPZmZzZXQgKyAncHgnO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVG9vbHRpcDtcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgQ29sbGFwc2UgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY29sbGFwc2UnKTtcclxuY29uc3QgUmFkaW9Ub2dnbGVHcm91cCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9yYWRpby10b2dnbGUtY29udGVudCcpO1xyXG5jb25zdCBDaGVja2JveFRvZ2dsZUNvbnRlbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnKTtcclxuY29uc3QgRHJvcGRvd24gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZHJvcGRvd24nKTtcclxuY29uc3QgQWNjb3JkaW9uID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2FjY29yZGlvbicpO1xyXG5jb25zdCBSZXNwb25zaXZlVGFibGUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdGFibGUnKTtcclxuY29uc3QgVGFibmF2ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3RhYm5hdicpO1xyXG5jb25zdCBUb29sdGlwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3Rvb2x0aXAnKTtcclxuY29uc3QgU2V0VGFiSW5kZXggPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvc2tpcG5hdicpO1xyXG5jb25zdCBOYXZpZ2F0aW9uID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL25hdmlnYXRpb24nKTtcclxuY29uc3QgSW5wdXRSZWdleE1hc2sgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzaycpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSAncG9seWZpbGxzJyBkZWZpbmUga2V5IEVDTUFTY3JpcHQgNSBtZXRob2RzIHRoYXQgbWF5IGJlIG1pc3NpbmcgZnJvbVxyXG4gKiBvbGRlciBicm93c2Vycywgc28gbXVzdCBiZSBsb2FkZWQgZmlyc3QuXHJcbiAqL1xyXG5yZXF1aXJlKCcuL3BvbHlmaWxscycpO1xyXG5cclxudmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gIG5ldyBOYXZpZ2F0aW9uKCk7XHJcblxyXG4gIGNvbnN0IGpzU2VsZWN0b3JSZWdleCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W2RhdGEtaW5wdXQtcmVnZXhdJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JSZWdleC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgSW5wdXRSZWdleE1hc2soanNTZWxlY3RvclJlZ2V4WyBjIF0pO1xyXG4gIH1cclxuICBjb25zdCBqc1NlbGVjdG9yVGFiaW5kZXggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2tpcG5hdltocmVmXj1cIiNcIl0nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRhYmluZGV4Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBTZXRUYWJJbmRleChqc1NlbGVjdG9yVGFiaW5kZXhbIGMgXSk7XHJcbiAgfVxyXG4gIGNvbnN0IGpzU2VsZWN0b3JUb29sdGlwID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtdG9vbHRpcCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVG9vbHRpcC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVG9vbHRpcChqc1NlbGVjdG9yVG9vbHRpcFsgYyBdKTtcclxuICB9XHJcbiAgY29uc3QganNTZWxlY3RvclRhYm5hdiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhYm5hdicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibmF2Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBUYWJuYXYoanNTZWxlY3RvclRhYm5hdlsgYyBdKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGpzU2VsZWN0b3JBY2NvcmRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhY2NvcmRpb24nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckFjY29yZGlvbi5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQWNjb3JkaW9uKGpzU2VsZWN0b3JBY2NvcmRpb25bIGMgXSk7XHJcbiAgfVxyXG4gIGNvbnN0IGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24tYm9yZGVyZWQ6bm90KC5hY2NvcmRpb24pJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQWNjb3JkaW9uKGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZFsgYyBdKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGpzU2VsZWN0b3JUYWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RhYmxlOm5vdCguZGF0YVRhYmxlKScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibGUubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFJlc3BvbnNpdmVUYWJsZShqc1NlbGVjdG9yVGFibGVbIGMgXSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc1NlbGVjdG9yQ29sbGFwc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1jb2xsYXBzZScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQ29sbGFwc2UubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IENvbGxhcHNlKGpzU2VsZWN0b3JDb2xsYXBzZVsgYyBdKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtcmFkaW8tdG9nZ2xlLWdyb3VwJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBSYWRpb1RvZ2dsZUdyb3VwKGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlWyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3QganNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1jaGVja2JveC10b2dnbGUtY29udGVudCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQ2hlY2tib3hUb2dnbGVDb250ZW50KGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlWyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3QganNTZWxlY3RvckRyb3Bkb3duID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtZHJvcGRvd24nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckRyb3Bkb3duLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBEcm9wZG93bihqc1NlbGVjdG9yRHJvcGRvd25bIGMgXSk7XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7IGluaXQsIENvbGxhcHNlLCBSYWRpb1RvZ2dsZUdyb3VwLCBDaGVja2JveFRvZ2dsZUNvbnRlbnQsIERyb3Bkb3duLCBSZXNwb25zaXZlVGFibGUsIEFjY29yZGlvbiwgVGFibmF2LCBUb29sdGlwLCBTZXRUYWJJbmRleCwgTmF2aWdhdGlvbiwgSW5wdXRSZWdleE1hc2sgfTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBlbHByb3RvID0gd2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZTtcclxuY29uc3QgSElEREVOID0gJ2hpZGRlbic7XHJcblxyXG5pZiAoIShISURERU4gaW4gZWxwcm90bykpIHtcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxwcm90bywgSElEREVOLCB7XHJcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKEhJRERFTik7XHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoSElEREVOLCAnJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9KTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NMaXN0IGFuZCBET01Ub2tlbkxpc3RcclxucmVxdWlyZSgnY2xhc3NsaXN0LXBvbHlmaWxsJyk7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuaGlkZGVuXHJcbnJlcXVpcmUoJy4vZWxlbWVudC1oaWRkZW4nKTtcclxuXHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vb2JqZWN0L2Fzc2lnbicpO1xyXG5yZXF1aXJlKCdjb3JlLWpzL2ZuL2FycmF5L2Zyb20nKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQG5hbWUgY2xvc2VzdFxyXG4gKiBAZGVzYyBnZXQgbmVhcmVzdCBwYXJlbnQgZWxlbWVudCBtYXRjaGluZyBzZWxlY3Rvci5cclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgSFRNTCBlbGVtZW50IHdoZXJlIHRoZSBzZWFyY2ggc3RhcnRzLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBTZWxlY3RvciB0byBiZSBmb3VuZC5cclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9IC0gTmVhcmVzdCBwYXJlbnQgZWxlbWVudCBtYXRjaGluZyBzZWxlY3Rvci5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xvc2VzdCAoZWwsIHNlbGVjdG9yKSB7XHJcbiAgdmFyIG1hdGNoZXNTZWxlY3RvciA9IGVsLm1hdGNoZXMgfHwgZWwud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGVsLm1vek1hdGNoZXNTZWxlY3RvciB8fCBlbC5tc01hdGNoZXNTZWxlY3RvcjtcclxuXHJcbiAgd2hpbGUgKGVsKSB7XHJcbiAgICAgIGlmIChtYXRjaGVzU2VsZWN0b3IuY2FsbChlbCwgc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgfVxyXG4gIHJldHVybiBlbDtcclxufTtcclxuIiwiLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzNcclxuZnVuY3Rpb24gaXNFbGVtZW50SW5WaWV3cG9ydCAoZWwsIHdpbj13aW5kb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0VsPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICByZWN0LnRvcCA+PSAwICYmXHJcbiAgICByZWN0LmxlZnQgPj0gMCAmJlxyXG4gICAgcmVjdC5ib3R0b20gPD0gKHdpbi5pbm5lckhlaWdodCB8fCBkb2NFbC5jbGllbnRIZWlnaHQpICYmXHJcbiAgICByZWN0LnJpZ2h0IDw9ICh3aW4uaW5uZXJXaWR0aCB8fCBkb2NFbC5jbGllbnRXaWR0aClcclxuICApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudEluVmlld3BvcnQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBpc0VsZW1lbnRcclxuICogQGRlc2MgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBET00gZWxlbWVudC5cclxuICogQHBhcmFtIHthbnl9IHZhbHVlXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VsZW1lbnQgPSB2YWx1ZSA9PiB7XHJcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUubm9kZVR5cGUgPT09IDE7XHJcbn07XHJcblxyXG4vKipcclxuICogQG5hbWUgc2VsZWN0XHJcbiAqIEBkZXNjIHNlbGVjdHMgZWxlbWVudHMgZnJvbSB0aGUgRE9NIGJ5IGNsYXNzIHNlbGVjdG9yIG9yIElEIHNlbGVjdG9yLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBUaGUgc2VsZWN0b3IgdG8gdHJhdmVyc2UgdGhlIERPTSB3aXRoLlxyXG4gKiBAcGFyYW0ge0RvY3VtZW50fEhUTUxFbGVtZW50P30gY29udGV4dCAtIFRoZSBjb250ZXh0IHRvIHRyYXZlcnNlIHRoZSBET01cclxuICogICBpbi4gSWYgbm90IHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byB0aGUgZG9jdW1lbnQuXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50W119IC0gQW4gYXJyYXkgb2YgRE9NIG5vZGVzIG9yIGFuIGVtcHR5IGFycmF5LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZWxlY3QgKHNlbGVjdG9yLCBjb250ZXh0KSB7XHJcblxyXG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT09ICdzdHJpbmcnKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBpZiAoIWNvbnRleHQgfHwgIWlzRWxlbWVudChjb250ZXh0KSkge1xyXG4gICAgY29udGV4dCA9IHdpbmRvdy5kb2N1bWVudDtcclxuICB9XHJcblxyXG4gIGNvbnN0IHNlbGVjdGlvbiA9IGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlbGVjdGlvbik7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IEVYUEFOREVEID0gJ2FyaWEtZXhwYW5kZWQnO1xuY29uc3QgQ09OVFJPTFMgPSAnYXJpYS1jb250cm9scyc7XG5jb25zdCBISURERU4gPSAnYXJpYS1oaWRkZW4nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChidXR0b24sIGV4cGFuZGVkKSA9PiB7XG5cbiAgaWYgKHR5cGVvZiBleHBhbmRlZCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgZXhwYW5kZWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ2ZhbHNlJztcbiAgfVxuICBidXR0b24uc2V0QXR0cmlidXRlKEVYUEFOREVELCBleHBhbmRlZCk7XG4gIGNvbnN0IGlkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShDT05UUk9MUyk7XG4gIGNvbnN0IGNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICBpZiAoIWNvbnRyb2xzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ05vIHRvZ2dsZSB0YXJnZXQgZm91bmQgd2l0aCBpZDogXCInICsgaWQgKyAnXCInXG4gICAgKTtcbiAgfVxuXG4gIGNvbnRyb2xzLnNldEF0dHJpYnV0ZShISURERU4sICFleHBhbmRlZCk7XG4gIHJldHVybiBleHBhbmRlZDtcbn07XG4iXX0=
