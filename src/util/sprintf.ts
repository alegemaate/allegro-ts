type SprintfArg = number | string;

interface Placeholder {
  param_no: string | undefined;
  keys: string[] | undefined;
  sign: string | undefined;
  pad_char: string | undefined;
  align: string | undefined;
  width: string | undefined;
  precision: string | undefined;
  type: string;
}

type ParseNode = string | Placeholder;

const re = {
  not_type: /[^T]/u,
  not_primitive: /[^v]/u,
  number: /[diefg]/u,
  numeric_arg: /[bcdiefguxX]/u,
  text: /^[^\x25]+/u,
  modulo: /^\x25{2}/u,
  placeholder:
    /^\x25(?:(?<param_no>[1-9]\d*)\$|\((?<keys>[^)]+)\))?(?<sign>\+)?(?<pad_char>0|'[^$])?(?<align>-)?(?<width>\d+)?(?:\.(?<precision>\d+))?(?<type>[b-gijostTuvxX])/u,
  key: /^(?<name>[a-z_][a-z_\d]*)/iu,
  key_access: /^\.(?<value>[a-z_][a-z_\d]*)/iu,
  index_access: /^\[(?<value>\d+)\]/u,
  sign_strip: /^[+-]/u,
};

export function sprintf(key: string, ...args: SprintfArg[]): string {
  return sprintf_format(sprintf_parse(key), [key, ...args]);
}

export function vsprintf(fmt: string, argv: SprintfArg[]): string {
  return sprintf(fmt, ...argv);
}

function resolve_arg(
  ph: Placeholder,
  argv: SprintfArg[],
  cursor: number,
): { value: unknown; cursor: number } {
  if (ph.keys) {
    let value: unknown = argv[cursor];
    for (const key of ph.keys) {
      if (value === null || value === undefined) {
        throw new Error(`[sprintf] Cannot access property "${key}" of undefined value`);
      }
      value = (value as Record<string, unknown>)[key];
    }
    return { value, cursor };
  }
  if (ph.param_no) {
    return { value: argv[Number(ph.param_no)], cursor };
  }
  return { value: argv[cursor], cursor: cursor + 1 };
}

function evaluate_callable(arg: unknown, ph: Placeholder): unknown {
  if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && typeof arg === "function") {
    return (arg as () => unknown)();
  }
  return arg;
}

function validate_numeric_arg(arg: unknown, ph: Placeholder): void {
  if (re.numeric_arg.test(ph.type) && typeof arg !== "number" && Number.isNaN(arg as number)) {
    throw new TypeError(`[sprintf] expecting number but found ${typeof arg}`);
  }
}

function apply_precision(value: string, precision: number | undefined): string {
  return precision === undefined ? value : value.substring(0, precision);
}

function format_value(arg: unknown, ph: Placeholder): string {
  const precision = ph.precision === undefined ? undefined : Number.parseInt(ph.precision, 10);
  const n = Number.parseFloat(String(arg));

  switch (ph.type) {
    case "b":
      return Number.parseInt(String(arg), 10).toString(2);
    case "c":
      return String.fromCodePoint(Number.parseInt(String(arg), 10));
    case "d":
    case "i":
      return String(Number.parseInt(String(arg), 10));
    case "j":
      return JSON.stringify(arg, null, ph.width === undefined ? 0 : Number.parseInt(ph.width, 10));
    case "e":
      return precision === undefined ? n.toExponential() : n.toExponential(precision);
    case "f":
      return precision === undefined ? String(n) : n.toFixed(precision);
    case "g":
      return precision === undefined ? String(n) : String(Number(n.toPrecision(precision)));
    case "o":
      return (Number.parseInt(String(arg), 10) >>> 0).toString(8);
    case "s":
      return apply_precision(String(arg), precision);
    case "t":
      return apply_precision(String(Boolean(arg)), precision);
    case "T":
      return apply_precision(
        Object.prototype.toString.call(arg).slice(8, -1).toLowerCase(),
        precision,
      );
    case "u":
      return String(Number.parseInt(String(arg), 10) >>> 0);
    case "v":
      return apply_precision(String((arg as { valueOf(): unknown }).valueOf()), precision);
    case "x":
      return (Number.parseInt(String(arg), 10) >>> 0).toString(16);
    case "X":
      return (Number.parseInt(String(arg), 10) >>> 0).toString(16).toUpperCase();
    default:
      return String(arg);
  }
}

function apply_padding(
  formatted: string,
  ph: Placeholder,
  is_positive: boolean | undefined,
): string {
  let sign = "";
  let result = formatted;
  if (re.number.test(ph.type) && (ph.sign !== undefined || is_positive === false)) {
    sign = is_positive === true ? "+" : "-";
    result = result.replace(re.sign_strip, "");
  }
  let pad_char = " ";
  if (ph.pad_char) {
    pad_char = ph.pad_char === "0" ? "0" : ph.pad_char.charAt(1);
  }
  const width = ph.width === undefined ? 0 : Number.parseInt(ph.width, 10);
  const pad_length = width - (sign + result).length;
  const pad = pad_length > 0 ? pad_char.repeat(pad_length) : "";
  if (ph.align) {
    return sign + result + pad;
  }
  if (pad_char === "0") {
    return sign + pad + result;
  }
  return pad + sign + result;
}

function sprintf_format(parse_tree: ParseNode[], argv: SprintfArg[]): string {
  let cursor = 1;
  let output = "";

  for (const node of parse_tree) {
    if (typeof node === "string") {
      output += node;
      continue;
    }

    const { value: resolved_value, cursor: next_cursor } = resolve_arg(node, argv, cursor);
    cursor = next_cursor;
    const arg = evaluate_callable(resolved_value, node);

    validate_numeric_arg(arg, node);

    const is_positive = re.number.test(node.type) ? (arg as number) >= 0 : undefined;
    const formatted = format_value(arg, node);

    output += node.type === "j" ? formatted : apply_padding(formatted, node, is_positive);
  }

  return output;
}

const sprintf_cache = new Map<string, ParseNode[]>();

function parse_field_list(raw: string): string[] {
  const first_match = re.key.exec(raw);
  if (first_match === null) {
    throw new SyntaxError("[sprintf] failed to parse named argument key");
  }
  const keys: string[] = [first_match.groups?.name ?? ""];
  let remaining = raw.substring(first_match[0].length);
  while (remaining !== "") {
    const access = re.key_access.exec(remaining) ?? re.index_access.exec(remaining);
    if (access === null) {
      throw new SyntaxError("[sprintf] failed to parse named argument key");
    }
    keys.push(access.groups?.value ?? "");
    remaining = remaining.substring(access[0].length);
  }
  return keys;
}

function sprintf_parse(fmt: string): ParseNode[] {
  const cached = sprintf_cache.get(fmt);
  if (cached) {
    return cached;
  }

  let remaining = fmt;
  const parse_tree: ParseNode[] = [];
  let arg_names = 0;

  while (remaining) {
    const text_match = re.text.exec(remaining);
    if (text_match !== null) {
      parse_tree.push(text_match[0]);
      remaining = remaining.substring(text_match[0].length);
      continue;
    }
    const modulo_match = re.modulo.exec(remaining);
    if (modulo_match !== null) {
      parse_tree.push("%");
      remaining = remaining.substring(modulo_match[0].length);
      continue;
    }
    const ph_match = re.placeholder.exec(remaining);
    if (ph_match === null) {
      throw new SyntaxError("[sprintf] unexpected placeholder");
    }
    const groups = ph_match.groups ?? {};
    let keys: string[] | undefined;
    if (groups.keys) {
      arg_names |= 1;
      keys = parse_field_list(groups.keys);
    } else {
      arg_names |= 2;
    }
    if (arg_names === 3) {
      throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
    }
    parse_tree.push({
      param_no: groups.param_no,
      keys,
      sign: groups.sign,
      pad_char: groups.pad_char,
      align: groups.align,
      width: groups.width,
      precision: groups.precision,
      type: groups.type ?? "",
    });
    remaining = remaining.substring(ph_match[0].length);
  }

  sprintf_cache.set(fmt, parse_tree);
  return parse_tree;
}
