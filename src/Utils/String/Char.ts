export type Char = string & { length: 1 };

export function isChar(str: string): str is Char {
    return str.length === 1;
}

export function assertChar(str: string): asserts str is Char {
    if (!isChar(str)) new Error(`Expected single character but got string of lenght ${str.length}`);
}

export function asChar(str: string): Char {
    assertChar(str);
    return str;
}