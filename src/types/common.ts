export type Primitive = null | undefined | string | number | boolean | symbol | bigint
export type Builtin = Primitive | Function | Date | Error | RegExp
export type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true
export type ArrayKey = number
export type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>
export type IsAny<T> = 0 extends 1 & T ? true : false
export type IsUnknown<T> = IsAny<T> extends true ? false : unknown extends T ? true : false
export type ArrayValue<T> = T extends Array<unknown> ? T[number] : never
