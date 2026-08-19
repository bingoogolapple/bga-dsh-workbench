// node_modules/.pnpm/@deepseek-ai+cosmokit@1.8.2/node_modules/@deepseek-ai/cosmokit/lib/index.js
function isNullable(value) {
  return value === null || value === void 0;
}
function isPlainObject(data) {
  return data && typeof data === "object" && !Array.isArray(data);
}
function filterKeys(object, filter) {
  return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
}
function mapValues(object, transform) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
}
function pick(source, keys, forced) {
  if (!keys) return { ...source };
  const result = {};
  for (const key of keys) if (forced || source[key] !== void 0) result[key] = source[key];
  return result;
}
function is(type, value) {
  if (arguments.length === 1) return (value2) => is(type, value2);
  return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
}
function isArrayBufferLike(value) {
  return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
}
function isArrayBufferSource(value) {
  return isArrayBufferLike(value) || ArrayBuffer.isView(value);
}
var Binary;
(function(Binary2) {
  Binary2.is = isArrayBufferLike;
  Binary2.isSource = isArrayBufferSource;
  function fromSource(source) {
    if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
    else return source;
  }
  Binary2.fromSource = fromSource;
  function toBase64(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") return Buffer.from(source).toString("base64");
    let binary = "";
    const bytes = new Uint8Array(source);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }
  Binary2.toBase64 = toBase64;
  function fromBase64(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
    return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
  }
  Binary2.fromBase64 = fromBase64;
  function toHex(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
    return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  Binary2.toHex = toHex;
  function fromHex(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
    const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
    const buffer = [];
    for (let i = 0; i < hex.length; i += 2) buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
    return Uint8Array.from(buffer).buffer;
  }
  Binary2.fromHex = fromHex;
})(Binary || (Binary = {}));
var base64ToArrayBuffer = Binary.fromBase64;
var arrayBufferToBase64 = Binary.toBase64;
var hexToArrayBuffer = Binary.fromHex;
var arrayBufferToHex = Binary.toHex;
function clone(source, refs = /* @__PURE__ */ new Map()) {
  if (!source || typeof source !== "object") return source;
  if (is("Date", source)) return new Date(source.valueOf());
  if (is("RegExp", source)) return new RegExp(source.source, source.flags);
  if (isArrayBufferLike(source)) return source.slice(0);
  if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
  const cached = refs.get(source);
  if (cached) return cached;
  if (Array.isArray(source)) {
    const result2 = [];
    refs.set(source, result2);
    source.forEach((value, index) => {
      result2[index] = Reflect.apply(clone, null, [value, refs]);
    });
    return result2;
  }
  const result = Object.create(Object.getPrototypeOf(source));
  refs.set(source, result);
  for (const key of Reflect.ownKeys(source)) {
    const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
    if ("value" in descriptor) descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
    Reflect.defineProperty(result, key, descriptor);
  }
  return result;
}
function deepEqual(a, b, strict) {
  if (a === b) return true;
  if (!strict && isNullable(a) && isNullable(b)) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (!a || !b) return false;
  function check(test, then) {
    return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
  }
  return check(Array.isArray, (a2, b2) => a2.length === b2.length && a2.every((item, index) => deepEqual(item, b2[index]))) ?? check(is("Date"), (a2, b2) => a2.valueOf() === b2.valueOf()) ?? check(is("RegExp"), (a2, b2) => a2.source === b2.source && a2.flags === b2.flags) ?? check(isArrayBufferLike, (a2, b2) => {
    if (a2.byteLength !== b2.byteLength) return false;
    const viewA = new Uint8Array(a2);
    const viewB = new Uint8Array(b2);
    for (let i = 0; i < viewA.length; i++) if (viewA[i] !== viewB[i]) return false;
    return true;
  }) ?? Object.keys({
    ...a,
    ...b
  }).every((key) => deepEqual(a[key], b[key], strict));
}
var Time;
(function(Time2) {
  Time2.millisecond = 1;
  Time2.second = 1e3;
  Time2.minute = Time2.second * 60;
  Time2.hour = Time2.minute * 60;
  Time2.day = Time2.hour * 24;
  Time2.week = Time2.day * 7;
  let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
  function setTimezoneOffset(offset) {
    timezoneOffset = offset;
  }
  Time2.setTimezoneOffset = setTimezoneOffset;
  function getTimezoneOffset() {
    return timezoneOffset;
  }
  Time2.getTimezoneOffset = getTimezoneOffset;
  function getDateNumber(date2 = /* @__PURE__ */ new Date(), offset) {
    if (typeof date2 === "number") date2 = new Date(date2);
    if (offset === void 0) offset = timezoneOffset;
    return Math.floor((date2.valueOf() / Time2.minute - offset) / 1440);
  }
  Time2.getDateNumber = getDateNumber;
  function fromDateNumber(value, offset) {
    const date2 = new Date(value * Time2.day);
    if (offset === void 0) offset = timezoneOffset;
    return new Date(+date2 + offset * Time2.minute);
  }
  Time2.fromDateNumber = fromDateNumber;
  const numeric = /\d+(?:\.\d+)?/.source;
  const timeRegExp = new RegExp(`^${[
    "w(?:eek(?:s)?)?",
    "d(?:ay(?:s)?)?",
    "h(?:our(?:s)?)?",
    "m(?:in(?:ute)?(?:s)?)?",
    "s(?:ec(?:ond)?(?:s)?)?"
  ].map((unit) => `(${numeric}${unit})?`).join("")}$`);
  function parseTime(source) {
    const capture = timeRegExp.exec(source);
    if (!capture) return 0;
    return (parseFloat(capture[1]) * Time2.week || 0) + (parseFloat(capture[2]) * Time2.day || 0) + (parseFloat(capture[3]) * Time2.hour || 0) + (parseFloat(capture[4]) * Time2.minute || 0) + (parseFloat(capture[5]) * Time2.second || 0);
  }
  Time2.parseTime = parseTime;
  function parseDate(date2) {
    const parsed = parseTime(date2);
    if (parsed) date2 = Date.now() + parsed;
    else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date2)) date2 = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date2}`;
    else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date2)) date2 = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date2}`;
    return date2 ? new Date(date2) : /* @__PURE__ */ new Date();
  }
  Time2.parseDate = parseDate;
  function format(ms) {
    const abs = Math.abs(ms);
    if (abs >= Time2.day - Time2.hour / 2) return Math.round(ms / Time2.day) + "d";
    else if (abs >= Time2.hour - Time2.minute / 2) return Math.round(ms / Time2.hour) + "h";
    else if (abs >= Time2.minute - Time2.second / 2) return Math.round(ms / Time2.minute) + "m";
    else if (abs >= Time2.second) return Math.round(ms / Time2.second) + "s";
    return ms + "ms";
  }
  Time2.format = format;
  function toDigits(source, length = 2) {
    return source.toString().padStart(length, "0");
  }
  Time2.toDigits = toDigits;
  function template(template2, time = /* @__PURE__ */ new Date()) {
    return template2.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
  }
  Time2.template = template;
})(Time || (Time = {}));

// node_modules/.pnpm/@deepseek-ai+schemastery@3.18.1/node_modules/@deepseek-ai/schemastery/lib/index.mjs
var kSchema = Symbol.for("schemastery");
var kValidationError = Symbol.for("ValidationError");
globalThis.__schemastery_index__ ??= 0;
globalThis.__schemastery_refs__ = void 0;
var ValidationError = class extends TypeError {
  options;
  name = "ValidationError";
  constructor(message, options) {
    let prefix = "$";
    for (const segment of options.path || []) if (typeof segment === "string") prefix += "." + segment;
    else if (typeof segment === "number") prefix += "[" + segment + "]";
    else if (typeof segment === "symbol") prefix += `[Symbol(${segment.toString()})]`;
    if (prefix.startsWith(".")) prefix = prefix.slice(1);
    super((prefix === "$" ? "" : `${prefix} `) + message);
    this.options = options;
  }
  static is(error) {
    return !!error?.[kValidationError];
  }
};
Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
var Schema = function(options) {
  const schema = function(data, options2 = {}) {
    return Schema.resolve(data, schema, options2)[0];
  };
  if (options.refs) {
    const refs = mapValues(options.refs, (options2) => new Schema(options2));
    const getRef = (uid) => refs[uid];
    for (const key in refs) {
      const options2 = refs[key];
      options2.sKey = getRef(options2.sKey);
      options2.inner = getRef(options2.inner);
      options2.list = options2.list && options2.list.map(getRef);
      options2.dict = options2.dict && mapValues(options2.dict, getRef);
    }
    return refs[options.uid];
  }
  Object.assign(schema, options);
  if (typeof schema.callback === "string") try {
    schema.callback = new Function("return " + schema.callback)();
  } catch {
  }
  Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
  Object.setPrototypeOf(schema, Schema.prototype);
  schema.meta ||= {};
  schema.toString = schema.toString.bind(schema);
  return schema;
};
Schema.prototype = Object.create(Function.prototype);
Schema.prototype[kSchema] = true;
Object.defineProperty(Schema.prototype, "~standard", { get() {
  return {
    version: 1,
    vendor: "schemastery",
    validate: (value) => {
      try {
        return { value: Schema.resolve(value, this, {})[0] };
      } catch (error) {
        if (ValidationError.is(error)) return { issues: [{
          message: error.message,
          path: error.options.path
        }] };
        throw error;
      }
    }
  };
} });
Schema.ValidationError = ValidationError;
Schema.prototype.toJSON = function toJSON() {
  if (globalThis.__schemastery_refs__) {
    globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
    return this.uid;
  }
  globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
  globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
  const result = {
    uid: this.uid,
    refs: globalThis.__schemastery_refs__
  };
  globalThis.__schemastery_refs__ = void 0;
  return result;
};
Schema.prototype.set = function set(key, value) {
  this.dict[key] = value;
  return this;
};
Schema.prototype.push = function push(value) {
  this.list.push(value);
  return this;
};
function mergeDesc(original, messages) {
  const result = typeof original === "string" ? { "": original } : { ...original };
  for (const locale in messages) {
    const value = messages[locale];
    if (value?.$description || value?.$desc) result[locale] = value.$description || value.$desc;
    else if (typeof value === "string") result[locale] = value;
  }
  return result;
}
function getInner(value) {
  return value?.$value ?? value?.$inner;
}
function extractKeys(data) {
  return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
}
Schema.prototype.i18n = function i18n(messages) {
  const schema = Schema(this);
  const desc = mergeDesc(schema.meta.description, messages);
  if (Object.keys(desc).length) schema.meta.description = desc;
  if (schema.dict) schema.dict = mapValues(schema.dict, (inner, key) => {
    return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
  });
  if (schema.list) schema.list = schema.list.map((inner, index) => {
    return inner.i18n(mapValues(messages, (data = {}) => {
      if (Array.isArray(getInner(data))) return getInner(data)[index];
      if (Array.isArray(data)) return data[index];
      return extractKeys(data);
    }));
  });
  if (schema.inner) schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
    if (getInner(data)) return getInner(data);
    return extractKeys(data);
  }));
  if (schema.sKey) schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
  return schema;
};
Schema.prototype.extra = function extra(key, value) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
};
for (const key of [
  "required",
  "disabled",
  "collapse",
  "hidden",
  "loose"
]) Object.assign(Schema.prototype, { [key](value = true) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
} });
Schema.prototype.deprecated = function deprecated() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "deprecated",
    type: "danger"
  });
  return schema;
};
Schema.prototype.experimental = function experimental() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "experimental",
    type: "warning"
  });
  return schema;
};
Schema.prototype.pattern = function pattern(regexp) {
  const schema = Schema(this);
  const pattern2 = pick(regexp, ["source", "flags"]);
  schema.meta = {
    ...schema.meta,
    pattern: pattern2
  };
  return schema;
};
Schema.prototype.simplify = function simplify(value) {
  if (deepEqual(value, this.meta.default, this.type === "dict")) return null;
  if (isNullable(value)) return value;
  if (this.type === "object" || this.type === "dict") {
    const result = {};
    for (const key in value) {
      const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
      if (this.type === "dict" || !isNullable(item)) result[key] = item;
    }
    if (deepEqual(result, this.meta.default, this.type === "dict")) return null;
    return result;
  } else if (this.type === "array" || this.type === "tuple") {
    const result = [];
    value.forEach((value2, index) => {
      const schema = this.type === "array" ? this.inner : this.list[index];
      const item = schema ? schema.simplify(value2) : value2;
      result.push(item);
    });
    return result;
  } else if (this.type === "intersect") {
    const result = {};
    for (const item of this.list) Object.assign(result, item.simplify(value));
    return result;
  } else if (this.type === "union") for (const schema of this.list) try {
    Schema.resolve(value, schema, {});
    return schema.simplify(value);
  } catch {
  }
  return value;
};
Schema.prototype.toString = function toString(inline) {
  return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
};
Schema.prototype.role = function role(role, extra2) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    role,
    extra: extra2
  };
  return schema;
};
for (const key of [
  "default",
  "link",
  "comment",
  "description",
  "max",
  "min",
  "step"
]) Object.assign(Schema.prototype, { [key](value) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
} });
var resolvers = {};
Schema.extend = function extend(type, resolve3) {
  resolvers[type] = resolve3;
};
Schema.resolve = function resolve(data, schema, options = {}, strict = false) {
  if (!schema) return [data];
  if (options.ignore?.(data, schema)) return [data];
  if (isNullable(data) && schema.type !== "lazy") {
    if (schema.meta.required) throw new ValidationError(`missing required value`, options);
    let current = schema;
    let fallback = schema.meta.default;
    while (current?.type === "intersect" && isNullable(fallback)) {
      current = current.list[0];
      fallback = current?.meta.default;
    }
    if (isNullable(fallback)) return [data];
    data = clone(fallback);
  }
  const callback = resolvers[schema.type];
  if (!callback) throw new ValidationError(`unsupported type "${schema.type}"`, options);
  try {
    return callback(data, schema, options, strict);
  } catch (error) {
    if (!schema.meta.loose) throw error;
    return [schema.meta.default];
  }
};
Schema.from = function from(source) {
  if (isNullable(source)) return Schema.any();
  else if ([
    "string",
    "number",
    "boolean"
  ].includes(typeof source)) return Schema.const(source).required();
  else if (source[kSchema]) return source;
  else if (typeof source === "function") switch (source) {
    case String:
      return Schema.string().required();
    case Number:
      return Schema.number().required();
    case Boolean:
      return Schema.boolean().required();
    case Function:
      return Schema.function().required();
    default:
      return Schema.is(source).required();
  }
  else throw new TypeError(`cannot infer schema from ${source}`);
};
Schema.lazy = function lazy(builder) {
  const toJSON2 = () => {
    if (!schema.inner[kSchema]) {
      schema.inner = schema.builder();
      schema.inner.meta = {
        ...schema.meta,
        ...schema.inner.meta
      };
    }
    return schema.inner.toJSON();
  };
  const schema = new Schema({
    type: "lazy",
    builder,
    inner: { toJSON: toJSON2 }
  });
  return schema;
};
Schema.natural = function natural() {
  return Schema.number().step(1).min(0);
};
Schema.percent = function percent() {
  return Schema.number().step(0.01).min(0).max(1).role("slider");
};
Schema.date = function date() {
  return Schema.union([Schema.is(Date), Schema.transform(Schema.string().role("datetime"), (value, options) => {
    const date2 = new Date(value);
    if (isNaN(+date2)) throw new ValidationError(`invalid date "${value}"`, options);
    return date2;
  }, true)]);
};
Schema.regExp = function regExp(flag = "") {
  return Schema.union([Schema.is(RegExp), Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
    try {
      return new RegExp(value, flag);
    } catch (e) {
      throw new ValidationError(e.message, options);
    }
  }, true)]);
};
Schema.arrayBuffer = function arrayBuffer(encoding) {
  return Schema.union([
    Schema.is(ArrayBuffer),
    Schema.is(SharedArrayBuffer),
    Schema.transform(Schema.any(), (value, options) => {
      if (Binary.isSource(value)) return Binary.fromSource(value);
      throw new ValidationError(`expected ArrayBufferSource but got ${value}`, options);
    }, true),
    ...encoding ? [Schema.transform(Schema.string(), (value, options) => {
      try {
        return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
      } catch (e) {
        throw new ValidationError(e.message, options);
      }
    }, true)] : []
  ]);
};
Schema.extend("lazy", (data, schema, options, strict) => {
  if (!schema.inner[kSchema]) {
    schema.inner = schema.builder();
    schema.inner.meta = {
      ...schema.meta,
      ...schema.inner.meta
    };
  }
  return Schema.resolve(data, schema.inner, options, strict);
});
Schema.extend("any", (data) => {
  return [data];
});
Schema.extend("never", (data, _, options) => {
  throw new ValidationError(`expected nullable but got ${data}`, options);
});
Schema.extend("const", (data, { value }, options) => {
  if (deepEqual(data, value)) return [value];
  throw new ValidationError(`expected ${value} but got ${data}`, options);
});
function checkWithinRange(data, meta, description, options, skipMin = false) {
  const { max = Infinity, min = -Infinity } = meta;
  if (data > max) throw new ValidationError(`expected ${description} <= ${max} but got ${data}`, options);
  if (data < min && !skipMin) throw new ValidationError(`expected ${description} >= ${min} but got ${data}`, options);
}
Schema.extend("string", (data, { meta }, options) => {
  if (typeof data !== "string") throw new ValidationError(`expected string but got ${data}`, options);
  if (meta.pattern) {
    const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
    if (!regexp.test(data)) throw new ValidationError(`expect string to match regexp ${regexp}`, options);
  }
  checkWithinRange(data.length, meta, "string length", options);
  return [data];
});
function decimalShift(data, digits) {
  const str = data.toString();
  if (str.includes("e")) return data * Math.pow(10, digits);
  const index = str.indexOf(".");
  if (index === -1) return data * Math.pow(10, digits);
  const frac = str.slice(index + 1);
  const integer = str.slice(0, index);
  if (frac.length <= digits) return +(integer + frac.padEnd(digits, "0"));
  return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
}
function isMultipleOf(data, min, step) {
  step = Math.abs(step);
  if (!/^\d+\.\d+$/.test(step.toString())) return (data - min) % step === 0;
  const index = step.toString().indexOf(".");
  const digits = step.toString().slice(index + 1).length;
  return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
}
Schema.extend("number", (data, { meta }, options) => {
  if (typeof data !== "number") throw new ValidationError(`expected number but got ${data}`, options);
  checkWithinRange(data, meta, "number", options);
  const { step } = meta;
  if (step && !isMultipleOf(data, meta.min ?? 0, step)) throw new ValidationError(`expected number multiple of ${step} but got ${data}`, options);
  return [data];
});
Schema.extend("boolean", (data, _, options) => {
  if (typeof data === "boolean") return [data];
  throw new ValidationError(`expected boolean but got ${data}`, options);
});
Schema.extend("bitset", (data, { bits, meta }, options) => {
  let value = 0, keys = [];
  if (typeof data === "number") {
    value = data;
    for (const key in bits) if (data & bits[key]) keys.push(key);
  } else if (Array.isArray(data)) {
    keys = data;
    for (const key of keys) {
      if (typeof key !== "string") throw new ValidationError(`expected string but got ${key}`, options);
      if (key in bits) value |= bits[key];
    }
  } else throw new ValidationError(`expected number or array but got ${data}`, options);
  if (value === meta.default) return [value];
  return [value, keys];
});
Schema.extend("function", (data, _, options) => {
  if (typeof data === "function") return [data];
  throw new ValidationError(`expected function but got ${data}`, options);
});
Schema.extend("is", (data, { constructor }, options) => {
  if (typeof constructor === "function") {
    if (data instanceof constructor) return [data];
    throw new ValidationError(`expected ${constructor.name} but got ${data}`, options);
  } else {
    if (isNullable(data)) throw new ValidationError(`expected ${constructor} but got ${data}`, options);
    let prototype = Object.getPrototypeOf(data);
    while (prototype) {
      if (prototype.constructor?.name === constructor) return [data];
      prototype = Object.getPrototypeOf(prototype);
    }
    throw new ValidationError(`expected ${constructor} but got ${data}`, options);
  }
});
function property(data, key, schema, options) {
  try {
    const [value, adapted] = Schema.resolve(data[key], schema, {
      ...options,
      path: [...options.path || [], key]
    });
    if (adapted !== void 0) data[key] = adapted;
    return value;
  } catch (e) {
    if (!options?.autofix) throw e;
    delete data[key];
    return schema.meta.default;
  }
}
Schema.extend("array", (data, { inner, meta }, options) => {
  if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
  checkWithinRange(data.length, meta, "array length", options, !isNullable(inner.meta.default));
  return [data.map((_, index) => property(data, index, inner, options))];
});
Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
  const result = {};
  for (const key in data) {
    let rKey;
    try {
      rKey = Schema.resolve(key, sKey, options)[0];
    } catch (error) {
      if (strict) continue;
      throw error;
    }
    result[rKey] = property(data, key, inner, options);
    data[rKey] = data[key];
    if (key !== rKey) delete data[key];
  }
  return [result];
});
Schema.extend("tuple", (data, { list }, options, strict) => {
  if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
  const result = list.map((inner, index) => property(data, index, inner, options));
  if (strict) return [result];
  result.push(...data.slice(list.length));
  return [result];
});
function merge(result, data) {
  for (const key in data) {
    if (key in result) continue;
    result[key] = data[key];
  }
}
Schema.extend("object", (data, { dict }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
  const result = {};
  for (const key in dict) {
    const value = property(data, key, dict[key], options);
    if (!isNullable(value) || key in data) result[key] = value;
  }
  if (!strict) merge(result, data);
  return [result];
});
Schema.extend("union", (data, { list, toString: toString2 }, options, strict) => {
  const messages = [];
  for (const inner of list) try {
    return Schema.resolve(data, inner, options, strict);
  } catch (error) {
    messages.push(error);
  }
  throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
});
Schema.extend("intersect", (data, { list, toString: toString2 }, options, strict) => {
  if (!list.length) return [data];
  let result;
  for (const inner of list) {
    const value = Schema.resolve(data, inner, options, true)[0];
    if (isNullable(value)) continue;
    if (isNullable(result)) result = value;
    else if (typeof result !== typeof value) throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
    else if (typeof value === "object") merge(result ??= {}, value);
    else if (result !== value) throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
  }
  if (!strict && isPlainObject(data)) merge(result, data);
  return [result];
});
Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
  const [result, adapted = data] = Schema.resolve(data, inner, options, true);
  if (preserve) return [callback(result)];
  else return [callback(result), callback(adapted)];
});
var formatters = {};
function defineMethod(name2, keys, format) {
  formatters[name2] = format;
  Object.assign(Schema, { [name2](...args) {
    const schema = new Schema({ type: name2 });
    keys.forEach((key, index) => {
      switch (key) {
        case "sKey":
          schema.sKey = args[index] ?? Schema.string();
          break;
        case "inner":
          schema.inner = Schema.from(args[index]);
          break;
        case "list":
          schema.list = args[index].map(Schema.from);
          break;
        case "dict":
          schema.dict = mapValues(args[index], Schema.from);
          break;
        case "bits":
          schema.bits = {};
          for (const key2 in args[index]) {
            if (typeof args[index][key2] !== "number") continue;
            schema.bits[key2] = args[index][key2];
          }
          break;
        case "callback": {
          const callback = schema.callback = args[index];
          callback["toJSON"] ||= () => callback.toString();
          break;
        }
        case "constructor": {
          const constructor = schema.constructor = args[index];
          if (typeof constructor === "function") constructor["toJSON"] ||= () => constructor["name"];
          break;
        }
        default:
          schema[key] = args[index];
      }
    });
    if (name2 === "object" || name2 === "dict") schema.meta.default = {};
    else if (name2 === "array" || name2 === "tuple") schema.meta.default = [];
    else if (name2 === "bitset") schema.meta.default = 0;
    return schema;
  } });
}
defineMethod("is", ["constructor"], ({ constructor }) => {
  if (typeof constructor === "function") return constructor.name;
  else return constructor;
});
defineMethod("any", [], () => "any");
defineMethod("never", [], () => "never");
defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
defineMethod("string", [], () => "string");
defineMethod("number", [], () => "number");
defineMethod("boolean", [], () => "boolean");
defineMethod("bitset", ["bits"], () => "bitset");
defineMethod("function", [], () => "function");
defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
defineMethod("object", ["dict"], ({ dict }) => {
  if (Object.keys(dict).length === 0) return "{}";
  return `{ ${Object.entries(dict).map(([key, inner]) => {
    return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
  }).join(", ")} }`;
});
defineMethod("union", ["list"], ({ list }, inline) => {
  const result = list.map(({ toString: format }) => format()).join(" | ");
  return inline ? `(${result})` : result;
});
defineMethod("intersect", ["list"], ({ list }) => {
  return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
});
defineMethod("transform", [
  "inner",
  "callback",
  "preserve"
], ({ inner }, isInner) => inner.toString(isInner));

// src/index.ts
import { mkdir as mkdir2, writeFile as writeFile2 } from "node:fs/promises";
import { homedir } from "node:os";
import { join as join3, resolve as resolve2 } from "node:path";

// src/routes.ts
import { readFile, stat, writeFile, unlink, mkdir } from "node:fs/promises";
import { extname, join as join2, isAbsolute } from "node:path";

// src/default-avatar.ts
var DEFAULT_AVATAR_BASE64 = "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";
var DEFAULT_AVATAR_CONTENT_TYPE = "image/png";
var DEFAULT_AVATAR_BYTES = Buffer.from(DEFAULT_AVATAR_BASE64, "base64");

// src/open-app.ts
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
var EXTRA_OPEN_KINDS = [
  "android-studio",
  "xcode",
  "wechat-devtools",
  "intellij-idea",
  "deveco-studio",
  "webstorm",
  "pycharm",
  "goland"
];
function isExtraOpenKind(value) {
  return EXTRA_OPEN_KINDS.includes(value);
}
function extraOpenLabel(kind) {
  switch (kind) {
    case "android-studio":
      return "Android Studio";
    case "xcode":
      return "Xcode";
    case "wechat-devtools":
      return "\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177";
    case "intellij-idea":
      return "IntelliJ IDEA";
    case "deveco-studio":
      return "DevEco Studio";
    case "webstorm":
      return "WebStorm";
    case "pycharm":
      return "PyCharm";
    case "goland":
      return "GoLand";
  }
}
function extraOpenCommand(platform, kind, path) {
  switch (kind) {
    case "android-studio": {
      if (platform === "darwin") return [{ command: "open", args: ["-a", "Android Studio", path] }];
      if (platform === "win32") return [{ command: "studio64.exe", args: [path] }];
      if (platform === "linux") return [{ command: "studio.sh", args: [path] }];
      return [];
    }
    case "xcode":
      if (platform === "darwin") return [{ command: "open", args: ["-a", "Xcode", path] }];
      return [];
    case "wechat-devtools": {
      const projectArgs = ["open", "--project", path];
      if (platform === "darwin") {
        return [
          { command: "/Applications/wechatwebdevtools.app/Contents/MacOS/cli", args: projectArgs },
          { command: "/Applications/\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177.app/Contents/MacOS/cli", args: projectArgs },
          // 兼容旧版 CLI：-o <path>（仅兜底）
          { command: "/Applications/wechatwebdevtools.app/Contents/MacOS/cli", args: ["-o", path] }
        ];
      }
      if (platform === "win32") {
        return [
          { command: "C:\\Program Files (x86)\\Tencent\\\u5FAE\u4FE1web\u5F00\u53D1\u8005\u5DE5\u5177\\cli.bat", args: projectArgs },
          { command: `${process.env.LOCALAPPDATA ?? "C:\\Users\\%USERNAME%"}\\\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177\\cli.bat`, args: projectArgs },
          { command: "cli", args: projectArgs }
        ];
      }
      return [];
    }
    case "intellij-idea":
      if (platform === "darwin") return [{ command: "open", args: ["-a", "IntelliJ IDEA", path] }];
      return [{ command: "idea", args: [path] }];
    case "webstorm":
      if (platform === "darwin") return [{ command: "open", args: ["-a", "WebStorm", path] }];
      return [{ command: "webstorm", args: [path] }];
    case "pycharm":
      if (platform === "darwin") return [{ command: "open", args: ["-a", "PyCharm", path] }];
      return [{ command: "pycharm", args: [path] }];
    case "goland":
      if (platform === "darwin") return [{ command: "open", args: ["-a", "GoLand", path] }];
      return [{ command: "goland", args: [path] }];
    case "deveco-studio":
      if (platform === "darwin") return [{ command: "open", args: ["-a", "DevEco Studio", path] }];
      return [{ command: "devecostudio", args: [path] }];
  }
}
function filterExistingCandidates(candidates) {
  return candidates.filter((candidate) => {
    const isAbsolutePath = /^[\/\\]/.test(candidate.command) || /^[A-Za-z]:\\/.test(candidate.command);
    if (!isAbsolutePath) return true;
    return existsSync(candidate.command);
  });
}
function isOpenKind(value) {
  return value === "finder" || value === "terminal" || value === "vscode";
}
function isTerminalPreference(value) {
  return value === "terminal-default" || value === "terminal-iterm" || value === "terminal-wterm" || value === "terminal-gnome" || value === "terminal-konsole" || value === "terminal-xfce";
}
function isEditorPreference(value) {
  return value === "editor-default" || value === "editor-insiders" || value === "editor-cursor" || value === "editor-codebuddy" || value === "editor-codebuddycn" || value === "editor-catpaw" || value === "editor-catpawai" || value === "editor-trae" || value === "editor-traecn" || value === "editor-qoder" || value === "editor-qodercn";
}
function shSingleQuote(value) {
  return `'${value.replace(/'/gu, `'\\''`)}'`;
}
function darwinCandidates(kind, path) {
  switch (kind) {
    case "finder":
      return [{ command: "open", args: [path] }];
    case "terminal":
      return [
        { command: "open", args: ["-a", "Terminal", path] },
        { command: "open", args: ["-a", "iTerm", path] }
      ];
    case "vscode":
      return [
        { command: "code", args: [path] },
        { command: "code-insiders", args: [path] }
      ];
  }
}
function win32Candidates(kind, path) {
  switch (kind) {
    case "finder":
      return [{ command: "explorer", args: [path] }];
    case "terminal":
      return [
        { command: "wt", args: ["-d", path] },
        { command: "powershell.exe", args: ["-NoExit", "-Command", `Set-Location -LiteralPath '${path.replace(/'/gu, "''")}'`] }
      ];
    case "vscode":
      return [
        { command: "code", args: [path] },
        { command: "code-insiders", args: [path] }
      ];
  }
}
function linuxCandidates(kind, path) {
  switch (kind) {
    case "finder":
      return [{ command: "xdg-open", args: [path] }];
    case "terminal":
      return [
        { command: "x-terminal-emulator", args: ["-e", "sh", "-c", `cd ${shSingleQuote(path)} && exec sh`] },
        { command: "gnome-terminal", args: [`--working-directory=${path}`] },
        { command: "konsole", args: ["--workdir", path] },
        { command: "xfce4-terminal", args: ["--working-directory", path] }
      ];
    case "vscode":
      return [
        { command: "code", args: [path] },
        { command: "code-insiders", args: [path] }
      ];
  }
}
function defaultCandidates(platform, kind, path) {
  switch (platform) {
    case "darwin":
      return darwinCandidates(kind, path);
    case "win32":
      return win32Candidates(kind, path);
    case "linux":
      return linuxCandidates(kind, path);
    default:
      return [];
  }
}
function resolveTerminalPreference(platform, id, path) {
  switch (id) {
    // default：交给默认候选链
    case "terminal-default":
      return void 0;
    case "terminal-iterm":
      if (platform === "darwin") return [{ command: "open", args: ["-a", "iTerm", path] }];
      return void 0;
    case "terminal-wterm":
      if (platform === "win32") return [{ command: "wt", args: ["-d", path] }];
      return void 0;
    case "terminal-gnome":
      if (platform === "linux") return [{ command: "gnome-terminal", args: [`--working-directory=${path}`] }];
      return void 0;
    case "terminal-konsole":
      if (platform === "linux") return [{ command: "konsole", args: ["--workdir", path] }];
      return void 0;
    case "terminal-xfce":
      if (platform === "linux") return [{ command: "xfce4-terminal", args: ["--working-directory", path] }];
      return void 0;
    default:
      return void 0;
  }
}
function resolveEditorPreference(_platform, id, path) {
  switch (id) {
    case "editor-default":
      return void 0;
    case "editor-insiders":
      return [{ command: "code-insiders", args: [path] }];
    case "editor-cursor":
      return [{ command: "cursor", args: [path] }];
    case "editor-codebuddy":
      return [{ command: "buddy", args: [path] }];
    case "editor-codebuddycn":
      return [{ command: "buddycn", args: [path] }];
    case "editor-catpaw":
      return [{ command: "catpaw", args: [path] }];
    case "editor-catpawai":
      return [{ command: "catpawai", args: [path] }];
    case "editor-trae":
      return [{ command: "trae", args: [path] }];
    case "editor-traecn":
      return [{ command: "trae-cn", args: [path] }];
    case "editor-qoder":
      return [{ command: "qoder", args: [path] }];
    case "editor-qodercn":
      return [{ command: "qoder-cn", args: [path] }];
    default:
      return void 0;
  }
}
function openCommandCandidates(platform, kind, path, preference) {
  if (preference !== void 0) {
    if (kind === "terminal") {
      const id = preference.terminal;
      if (id !== void 0 && isTerminalPreference(id)) {
        const resolved = resolveTerminalPreference(platform, id, path);
        if (resolved !== void 0) return resolved;
      }
    } else if (kind === "vscode") {
      const id = preference.editor;
      if (id !== void 0 && isEditorPreference(id)) {
        const resolved = resolveEditorPreference(platform, id, path);
        if (resolved !== void 0) return resolved;
      }
    }
  }
  return defaultCandidates(platform, kind, path);
}
var defaultSpawn = (command, args, options) => spawn(command, [...args], options);
async function openPathIn(kind, path, options = {}) {
  const platform = options.platform ?? process.platform;
  const spawnFn = options.spawnFn ?? defaultSpawn;
  const prefId = kind === "terminal" ? options.preference?.terminal : kind === "vscode" ? options.preference?.editor : void 0;
  const candidates = openCommandCandidates(platform, kind, path, options.preference);
  const prefValid = prefId !== void 0 && (kind === "terminal" ? isTerminalPreference(prefId) : isEditorPreference(prefId));
  const usedPreference = prefValid && candidates.length === 1 && prefId !== "terminal-default" && prefId !== "editor-default";
  if (candidates.length === 0) {
    return { ok: false, error: `unsupported platform "${platform}"` };
  }
  let lastError = "no candidate command found";
  for (const candidate of candidates) {
    try {
      const opened = await new Promise((resolve3) => {
        const child = spawnFn(candidate.command, candidate.args, { detached: true, stdio: "ignore" });
        child.on("error", (error) => {
          resolve3({ ok: false, error: error.message });
        });
        child.on("spawn", () => {
          child.unref();
          resolve3({ ok: true });
        });
      });
      if (opened.ok) return opened;
      lastError = opened.error ?? lastError;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  if (usedPreference) {
    return { ok: false, error: `preferred "${prefId}" not available: ${lastError}` };
  }
  return { ok: false, error: lastError };
}
async function openExtraPathIn(kind, path, options = {}) {
  const platform = options.platform ?? process.platform;
  const spawnFn = options.spawnFn ?? defaultSpawn;
  if (kind === "wechat-devtools") {
    const configJson = join(path, "project.config.json");
    if (!existsSync(configJson)) {
      return {
        ok: false,
        error: `\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177\u53EA\u80FD\u7528\u5C0F\u7A0B\u5E8F\u9879\u76EE\u6839\u76EE\u5F55\u6253\u5F00\uFF1A${path} \u4E0B\u672A\u627E\u5230 project.config.json\uFF08\u8BF7\u9009\u62E9\u542B project.config.json \u7684\u5C0F\u7A0B\u5E8F\u9879\u76EE\u76EE\u5F55\uFF09`
      };
    }
  }
  const candidates = filterExistingCandidates(extraOpenCommand(platform, kind, path));
  if (candidates.length === 0) {
    return { ok: false, error: `"${extraOpenLabel(kind)}" is not available on platform "${platform}"` };
  }
  let lastError = "no candidate command found";
  for (const candidate of candidates) {
    try {
      const opened = await new Promise((resolve3) => {
        const child = spawnFn(candidate.command, candidate.args, { detached: true, stdio: "ignore" });
        child.on("error", (error) => {
          resolve3({ ok: false, error: error.message });
        });
        child.on("spawn", () => {
          child.unref();
          resolve3({ ok: true });
        });
      });
      if (opened.ok) return opened;
      lastError = opened.error ?? lastError;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  if (kind === "wechat-devtools") {
    return {
      ok: false,
      error: `\u672A\u80FD\u5524\u8D77\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177\uFF1A${lastError}\uFF08\u82E5\u547D\u4EE4\u5DF2\u6267\u884C\u4F46\u5DE5\u5177\u672A\u6253\u5F00\uFF0C\u8BF7\u5148\u5728\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177\u300C\u8BBE\u7F6E \u2192 \u5B89\u5168\u8BBE\u7F6E \u2192 \u5F00\u542F\u670D\u52A1\u7AEF\u53E3\u300D\uFF09`
    };
  }
  return { ok: false, error: `"${extraOpenLabel(kind)}" failed: ${lastError}` };
}

// src/routes.ts
var CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};
function avatarContentType(path) {
  return CONTENT_TYPES[extname(path).toLowerCase()] ?? "image/png";
}
var MAX_AVATAR_BYTES = 10 * 1024 * 1024;
var OK = (value) => JSON.stringify({ ok: true, ...value });
function readBody(req, maxBytes) {
  return new Promise((resolve3, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error(`request body exceeds ${maxBytes} bytes`));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      resolve3(Buffer.concat(chunks));
    });
    req.on("error", reject);
  });
}
function sniffImageType(buffer) {
  if (buffer.length >= 8 && buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71) {
    return ".png";
  }
  if (buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) {
    return ".jpg";
  }
  if (buffer.length >= 4 && buffer[0] === 71 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 56) {
    return ".gif";
  }
  if (buffer.length >= 12 && buffer.toString("latin1", 0, 4) === "RIFF" && buffer.toString("latin1", 8, 12) === "WEBP") {
    return ".webp";
  }
  return void 0;
}
function createWorkbenchRoutes(runtime) {
  const avatarHandler = async (_req, res) => {
    const avatarPath = runtime.resolve().banner.avatarPath;
    if (avatarPath.length > 0) {
      try {
        const info = await stat(avatarPath);
        if (info.isFile()) {
          const body = await readFile(avatarPath);
          res.writeHead(200, {
            "Content-Type": avatarContentType(avatarPath),
            "Content-Length": body.length,
            "Cache-Control": "no-cache"
          });
          res.end(body);
          return;
        }
      } catch {
      }
    }
    res.writeHead(200, {
      "Content-Type": DEFAULT_AVATAR_CONTENT_TYPE,
      "Content-Length": DEFAULT_AVATAR_BYTES.length,
      "Cache-Control": "no-cache"
    });
    res.end(DEFAULT_AVATAR_BYTES);
  };
  return [
    {
      kind: "exact",
      path: "/bga-dsh-workbench/avatar",
      handler: async (req, res) => {
        if (req.method === "POST") {
          try {
            const body = await readBody(req, MAX_AVATAR_BYTES);
            if (sniffImageType(body) === void 0) {
              throw new Error("unsupported image type (png, jpg, gif, webp supported)");
            }
            const avatarPath = await runtime.saveAvatar(body);
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(OK({ avatarPath }));
          } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ ok: false, error: error.message }));
          }
          return;
        }
        await avatarHandler(req, res);
      }
    },
    {
      kind: "exact",
      path: "/bga-dsh-workbench/config",
      handler: (_req, res) => {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(runtime.resolve()));
      }
    },
    {
      kind: "exact",
      path: "/bga-dsh-workbench/settings",
      handler: async (req, res) => {
        try {
          const body = await readBody(req, 64 * 1024);
          const parsed = JSON.parse(body.toString("utf8"));
          if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
            throw new Error("settings patch must be an object");
          }
          const banner = parsed.banner;
          const confetti = parsed.confetti;
          const open = parsed.open;
          const openExtra = parsed.openExtra;
          const patch = {};
          if (banner !== void 0) {
            if (typeof banner !== "object" || banner === null || Array.isArray(banner)) {
              throw new Error("banner must be an object");
            }
            const fields = banner;
            const item = {};
            if (fields.avatarPath !== void 0) {
              if (typeof fields.avatarPath !== "string") throw new Error("banner.avatarPath must be a string");
              item.avatarPath = fields.avatarPath;
            }
            if (fields.text !== void 0) {
              if (typeof fields.text !== "string") throw new Error("banner.text must be a string");
              item.text = fields.text;
            }
            if (fields.show !== void 0) {
              if (typeof fields.show !== "boolean") throw new Error("banner.show must be a boolean");
              item.show = fields.show;
            }
            patch.banner = item;
          }
          if (confetti !== void 0) {
            if (typeof confetti !== "object" || confetti === null || Array.isArray(confetti)) {
              throw new Error("confetti must be an object");
            }
            const fields = confetti;
            const item = {};
            if (fields.sound !== void 0) {
              if (typeof fields.sound !== "boolean") throw new Error("confetti.sound must be a boolean");
              item.sound = fields.sound;
            }
            patch.confetti = item;
          }
          if (open !== void 0) {
            if (typeof open !== "object" || open === null || Array.isArray(open)) {
              throw new Error("open must be an object");
            }
            const fields = open;
            const item = {};
            if (fields.terminal !== void 0) {
              if (typeof fields.terminal !== "string") throw new Error("open.terminal must be a string");
              if (!isTerminalPreference(fields.terminal)) {
                throw new Error(`open.terminal is not a known terminal preference: ${fields.terminal}`);
              }
              item.terminal = fields.terminal;
            }
            if (fields.editor !== void 0) {
              if (typeof fields.editor !== "string") throw new Error("open.editor must be a string");
              if (!isEditorPreference(fields.editor)) {
                throw new Error(`open.editor is not a known editor preference: ${fields.editor}`);
              }
              item.editor = fields.editor;
            }
            patch.open = item;
          }
          if (openExtra !== void 0) {
            if (typeof openExtra !== "object" || openExtra === null || Array.isArray(openExtra)) {
              throw new Error("openExtra must be an object");
            }
            const fields = openExtra;
            const keys = ["androidStudio", "xcode", "wechatDevtools", "intellijIdea", "devecoStudio", "webstorm", "pycharm", "goland"];
            const item = {};
            for (const key of keys) {
              if (fields[key] !== void 0) {
                if (typeof fields[key] !== "boolean") {
                  throw new Error(`openExtra.${key} must be a boolean`);
                }
                item[key] = Boolean(fields[key]);
              }
            }
            patch.openExtra = item;
          }
          await runtime.updateSettings(patch);
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(OK({}));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: error.message }));
        }
      }
    },
    /**
     * 任务看板持久化端点。
     * - GET    读 tasks.json（文件不存在时返回 '[]'）；
     * - POST   原子写回整个任务列表（先校验 JSON 合法再落盘）；
     * - DELETE 清空任务文件。
     */
    {
      kind: "exact",
      path: "/bga-dsh-workbench/tasks",
      handler: async (req, res) => {
        const tasksFile = join2(runtime.storageDir, "tasks.json");
        try {
          if (req.method === "DELETE") {
            await unlink(tasksFile).catch(() => {
            });
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(OK({}));
            return;
          }
          if (req.method === "POST") {
            const body = await readBody(req, 2 * 1024 * 1024);
            const text = body.toString("utf8");
            JSON.parse(text);
            await mkdir(runtime.storageDir, { recursive: true });
            await writeFile(tasksFile, text, "utf8");
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(OK({}));
            return;
          }
          const data = await readFile(tasksFile, "utf8").catch(() => "[]");
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(data);
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: error.message }));
        }
      }
    },
    {
      kind: "exact",
      path: "/bga-dsh-workbench/open",
      handler: async (req, res) => {
        try {
          const body = await readBody(req, 16 * 1024);
          const parsed = JSON.parse(body.toString("utf8"));
          const kind = parsed.kind;
          const path = parsed.path;
          if (!isOpenKind(kind) && !isExtraOpenKind(kind)) {
            throw new Error("kind must be one of: finder, terminal, vscode, or an extra IDE kind");
          }
          if (typeof path !== "string" || path.length === 0) {
            throw new Error("path must be a non-empty string");
          }
          if (!isAbsolute(path)) {
            throw new Error("path must be an absolute filesystem path");
          }
          const openConfig = runtime.resolve().open;
          const preference = {
            terminal: openConfig.terminal.length > 0 ? openConfig.terminal : void 0,
            editor: openConfig.editor.length > 0 ? openConfig.editor : void 0
          };
          const result = isExtraOpenKind(kind) ? await openExtraPathIn(kind, path) : await openPathIn(kind, path, { preference });
          if (result.ok) {
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(OK({}));
          } else {
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ ok: false, error: result.error ?? "failed to open" }));
          }
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: error.message }));
        }
      }
    }
  ];
}

// src/settings.ts
import { settingsNamespace } from "@deepseek-ai/dsh-settings";
var WORKBENCH_NAMESPACE = settingsNamespace("bga-dsh-workbench");
var WorkbenchSettingsSchema = Schema.object({
  banner: Schema.object({
    avatarPath: Schema.string(),
    text: Schema.string(),
    show: Schema.boolean()
  }),
  confetti: Schema.object({
    sound: Schema.boolean()
  }),
  open: Schema.object({
    terminal: Schema.string(),
    editor: Schema.string()
  }),
  openExtra: Schema.object({
    androidStudio: Schema.boolean(),
    xcode: Schema.boolean(),
    wechatDevtools: Schema.boolean(),
    intellijIdea: Schema.boolean(),
    devecoStudio: Schema.boolean(),
    webstorm: Schema.boolean(),
    pycharm: Schema.boolean(),
    goland: Schema.boolean()
  })
});
function registerWorkbenchSettings(ctx, base) {
  return ctx.settings.register(WORKBENCH_NAMESPACE, WorkbenchSettingsSchema, {
    base,
    applies: "live"
    // 实时生效：改完立即反映到运行时
  });
}

// src/task-board-host.ts
var SECTION_ORDER = 200;
var TASK_BOARD_GUIDANCE = "bga-dsh-workbench \u5185\u7F6E\u4EFB\u52A1\u770B\u677F\uFF08\u4FA7\u8FB9\u680F\u300C\u4EFB\u52A1\u770B\u677F\u300D\u5165\u53E3\uFF09\uFF1A\u591A\u5217\u770B\u677F\u7BA1\u7406\u4EFB\u52A1\uFF1B\u4EFB\u52A1\u53EF\u771F\u5B9E\u6267\u884C\uFF08\u9A71\u52A8 agent \u4F1A\u8BDD\uFF09\uFF1B\u4EFB\u52A1\u53EF\u9489\u4F4F\u6267\u884C\u76EE\u6807\u2014\u2014\u5DE5\u4F5C\u533A / \u6A21\u5F0F\uFF08agent \u9884\u8BBE\uFF09/ \u6743\u9650\uFF08read-only / workspace-write / danger-full-access\uFF09\uFF0C\u7F3A\u7701\u7528\u8FD0\u884C\u65F6\u9ED8\u8BA4\uFF1B\u4EFB\u52A1\u652F\u6301 5 \u6BB5 cron \u5B9A\u65F6\u6267\u884C\uFF08\u5982 0 23 * * *\uFF09\uFF1B\u4EFB\u52A1\u6570\u636E\u7531\u5BBF\u4E3B\u6301\u4E45\u5316\u5230\u5B58\u50A8\u76EE\u5F55\uFF08tasks.json\uFF09\u3002\u9650\u5236\uFF1A\u5B9A\u65F6\u8C03\u5EA6\u5728\u6D4F\u89C8\u5668\u7AEF\uFF0C\u9700 GUI \u6807\u7B7E\u9875\u6253\u5F00\uFF0C\u9519\u8FC7\u5373\u8DF3\u8FC7\uFF1B\u6267\u884C\u6D88\u8017 API \u989D\u5EA6\u3002\u7528\u6237\u63D0\u5230\u300C\u4EFB\u52A1\u770B\u677F / \u770B\u677F / \u5B9A\u65F6\u4EFB\u52A1\u300D\u65F6\u5373\u6307\u672C\u5DE5\u4F5C\u53F0\u7684\u770B\u677F\uFF0C\u8BF7\u636E\u6B64\u534F\u4F5C\u3002";
function registerTaskBoardPrompt(ctx) {
  const sp = ctx.get("systemPrompt");
  if (sp === void 0) return;
  sp.section({
    name: "plugin:bga-dsh-workbench-task-board",
    order: SECTION_ORDER,
    text: TASK_BOARD_GUIDANCE
  });
}

// src/index.ts
var name = "bga-dsh-workbench";
var inject = ["tools"];
var Config = Schema.object({
  avatarPath: Schema.string().default(""),
  text: Schema.string().default("\u7684 Harness \u5DE5\u4F5C\u53F0"),
  show: Schema.boolean().default(true),
  sound: Schema.boolean().default(true),
  storageDir: Schema.string()
});
var DEFAULT_TEXT = "\u7684 Harness \u5DE5\u4F5C\u53F0";
function defaultStorageDir() {
  return join3(process.env.DSH_HOME ?? join3(homedir(), ".dsh"), "bga-dsh-workbench");
}
function apply(ctx, config) {
  const base = {
    banner: {
      avatarPath: config.avatarPath ?? "",
      text: config.text ?? DEFAULT_TEXT,
      show: config.show ?? true
    },
    confetti: {
      sound: config.sound ?? true
    },
    open: {
      terminal: "",
      editor: ""
    },
    openExtra: {
      androidStudio: true,
      xcode: true,
      wechatDevtools: true,
      intellijIdea: true,
      devecoStudio: true,
      webstorm: true,
      pycharm: true,
      goland: true
    }
  };
  const storageDir = resolve2(config.storageDir ?? defaultStorageDir());
  ctx.inject(["webServer", "settings"], (child) => {
    const scope = registerWorkbenchSettings(child, base);
    const baseBanner = base.banner ?? {};
    const baseConfetti = base.confetti ?? {};
    const baseOpen = base.open ?? {};
    const baseOpenExtra = base.openExtra ?? {};
    const runtime = {
      // 读取当前生效的配置：先看设置命名空间里的值，非字符串/非布尔或为空时回退到基础配置
      resolve: () => {
        const resolved = scope.get();
        const banner = resolved.banner ?? {};
        const confetti = resolved.confetti ?? {};
        const open = resolved.open ?? {};
        const extraCfg = resolved.openExtra ?? {};
        return {
          banner: {
            avatarPath: typeof banner.avatarPath === "string" && banner.avatarPath.length > 0 ? banner.avatarPath : baseBanner.avatarPath ?? "",
            text: typeof banner.text === "string" && banner.text.length > 0 ? banner.text : baseBanner.text ?? "",
            show: typeof banner.show === "boolean" ? banner.show : baseBanner.show ?? true
          },
          confetti: {
            sound: typeof confetti.sound === "boolean" ? confetti.sound : baseConfetti.sound ?? true
          },
          open: {
            terminal: typeof open.terminal === "string" ? open.terminal : baseOpen.terminal ?? "",
            editor: typeof open.editor === "string" ? open.editor : baseOpen.editor ?? ""
          },
          openExtra: {
            androidStudio: typeof extraCfg.androidStudio === "boolean" ? extraCfg.androidStudio : baseOpenExtra.androidStudio ?? true,
            xcode: typeof extraCfg.xcode === "boolean" ? extraCfg.xcode : baseOpenExtra.xcode ?? true,
            wechatDevtools: typeof extraCfg.wechatDevtools === "boolean" ? extraCfg.wechatDevtools : baseOpenExtra.wechatDevtools ?? true,
            intellijIdea: typeof extraCfg.intellijIdea === "boolean" ? extraCfg.intellijIdea : baseOpenExtra.intellijIdea ?? true,
            devecoStudio: typeof extraCfg.devecoStudio === "boolean" ? extraCfg.devecoStudio : baseOpenExtra.devecoStudio ?? true,
            webstorm: typeof extraCfg.webstorm === "boolean" ? extraCfg.webstorm : baseOpenExtra.webstorm ?? true,
            pycharm: typeof extraCfg.pycharm === "boolean" ? extraCfg.pycharm : baseOpenExtra.pycharm ?? true,
            goland: typeof extraCfg.goland === "boolean" ? extraCfg.goland : baseOpenExtra.goland ?? true
          }
        };
      },
      // 更新设置命名空间中的横幅/彩带配置
      updateSettings: (patch) => scope.update(patch),
      // 保存上传的头像字节流：嗅探图片类型，写入存储目录并更新设置记录新路径
      saveAvatar: async (buffer) => {
        const ext = sniffImageType(buffer);
        if (ext === void 0) throw new Error("unsupported image type (png, jpg, gif, webp supported)");
        await mkdir2(storageDir, { recursive: true });
        const target = join3(storageDir, `avatar${ext}`);
        await writeFile2(target, buffer);
        await scope.update({ banner: { avatarPath: target } });
        return target;
      },
      storageDir
    };
    const disposers = createWorkbenchRoutes(runtime).map((route) => child.webServer.register(route));
    return () => {
      for (const dispose of disposers) dispose();
    };
  });
  registerTaskBoardPrompt(ctx);
}
export {
  Config,
  DEFAULT_TEXT,
  apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map
