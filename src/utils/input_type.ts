export const isCheckboxInput = (input: unknown): input is HTMLInputElement =>
	input instanceof HTMLInputElement && input.type === 'checkbox'

export const isRadioInput = (input: unknown): input is HTMLInputElement =>
	input instanceof HTMLInputElement && input.type === 'radio'

export const isCheckboxOrRadio = (input: HTMLInputElement): input is HTMLInputElement =>
	input instanceof HTMLInputElement && (input.type === 'checkbox' || input.type === 'radio')

export const isMultipleSelect = (input: unknown): input is HTMLSelectElement =>
	input instanceof HTMLSelectElement && input.multiple

export const selectValues = (node: HTMLSelectElement, values: any) => {
	if (Array.isArray(values)) {
		for (let i = 0, l = node.options.length; i < l; i++) {
			const option = node.options[i]
			const optionValue = option.value
			option.selected = values.indexOf(optionValue) >= 0
		}
	}
}

export const checkValues = (node: HTMLInputElement, value: any) => {
	if (Array.isArray(value)) {
		node.checked = value.indexOf(node.value) >= 0
	} else {
		node.checked = String(node.value) === String(value) && !!value
	}
}
