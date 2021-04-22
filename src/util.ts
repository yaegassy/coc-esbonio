export function multibyteLength(text: string) {
  if (typeof text !== 'string') {
    throw new TypeError('Expected a string');
  }

  const escapedStr = escape(text);

  let len = 0;
  for (let i = 0; i < escapedStr.length; i++, len++) {
    if (escapedStr.charAt(i) === '%') {
      if (escapedStr.charAt(++i) === 'u') {
        i += 3;
        len++;
      }
      i++;
    }
  }

  return len;
}
