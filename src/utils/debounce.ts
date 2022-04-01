export const debounce = <T extends (...args: any) => any>(invoker: T, time = 50) => {
	let timer: number | undefined

	return (...args: Parameters<T>) => {
		clearTimeout(timer)
		timer = setTimeout(() => invoker.apply(this, args), time)
	}
}
