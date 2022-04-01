export const isNullOrUndefined = (val: unknown): val is null | undefined => val == null
export const isUndefined = (val: unknown): val is undefined => val === undefined
export const isDateObject = (val: unknown): val is Date => val instanceof Date
export const isObject = <T extends object>(val: unknown): val is T =>
	typeof val === 'object' && !isNullOrUndefined(val) && !Array.isArray(val) && !isDateObject(val)
export const isSingleKey = (val: string) => /^\w*$/.test(val)
export const isNumber = (val: unknown): val is number => Number(val) >= 0

export const get = <T>(obj: T, path: string, defaultValue?: unknown): any => {
	const result = path
		.split(/[,[\].]+?/)
		.reduce(
			(result, key) => (isNullOrUndefined(result) ? result : result[key as keyof {}]),
			obj,
		)

	return isUndefined(result) || result === obj
		? isUndefined(obj[path as keyof T])
			? defaultValue
			: obj[path as keyof T]
		: result
}

export const set = (obj: Record<string, unknown>, path: string, value: unknown) => {
	const pathList = isSingleKey(path) ? [path] : path.split(/\.|\[(\d+)\]/).filter(Boolean)
	const length = pathList.length
	const lastIndex = length - 1
	let acc = obj

	for (let i = 0; i < length; i++) {
		if (i === lastIndex) {
			acc[pathList[i]] = value
			break
		}

		if (!(pathList[i] in acc) || isNullOrUndefined(acc[pathList[i]])) {
			acc[pathList[i]] = isNumber(pathList[i + 1]) ? [] : {}
		}

		acc = acc[pathList[i]] as any
	}

	return obj
}

export const pullAt = (arr: Array<unknown>, index: number) => arr.splice(index, 1)
