import { ArrayKey, IsTuple, Primitive, TupleKeys } from './common'

type PathImpl<K extends string | number, V> = V extends Primitive
	? `${K}`
	: `${K}` | `${K}.${Path<V>}`

export type Path<T> = T extends ReadonlyArray<infer V>
	? IsTuple<T> extends true
		? {
				[K in TupleKeys<T>]-?: PathImpl<K & string, T[K]>
		  }[TupleKeys<T>]
		: PathImpl<ArrayKey, V>
	: {
			[K in keyof T]-?: PathImpl<K & string, T[K]>
	  }[keyof T]

type ArrayPathImpl<K extends string | number, V> = V extends Primitive
	? never
	: V extends ReadonlyArray<infer U>
	? U extends Primitive
		? never
		: `${K}` | `${K}.${ArrayPath<V>}`
	: `${K}.${ArrayPath<V>}`

export type ArrayPath<T> = T extends ReadonlyArray<infer V>
	? IsTuple<T> extends true
		? {
				[K in TupleKeys<T>]-?: ArrayPathImpl<K & string, T[K]>
		  }[TupleKeys<T>]
		: ArrayPathImpl<ArrayKey, V>
	: {
			[K in keyof T]-?: ArrayPathImpl<K & string, T[K]>
	  }[keyof T]

export type PathValue<T, P extends Path<T> | ArrayPath<T>> = T extends any
	? P extends `${infer K}.${infer R}`
		? K extends keyof T
			? R extends Path<T[K]>
				? PathValue<T[K], R>
				: never
			: K extends `${ArrayKey}`
			? T extends ReadonlyArray<infer V>
				? PathValue<V, R & Path<V>>
				: never
			: never
		: P extends keyof T
		? T[P]
		: P extends `${ArrayKey}`
		? T extends ReadonlyArray<infer V>
			? V
			: never
		: never
	: never
