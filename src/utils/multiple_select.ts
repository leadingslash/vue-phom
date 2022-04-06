export const selectValues = (node: HTMLSelectElement, values: any) => {
	if (Array.isArray(values)) {
		for (let i = 0, l = node.options.length; i < l; i++) {
			const option = node.options[i]
			const optionValue = option.value
			option.selected = values.indexOf(optionValue) >= 0
		}
	}
}
