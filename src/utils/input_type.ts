export const isCheckboxInput = (input: unknown): input is HTMLInputElement =>
	input instanceof HTMLInputElement && input.type === 'checkbox'

export const isRadioInput = (input: unknown): input is HTMLInputElement =>
	input instanceof HTMLInputElement && input.type === 'radio'

export const isCheckboxOrRadio = (input: HTMLInputElement): input is HTMLInputElement =>
	input instanceof HTMLInputElement && (input.type === 'checkbox' || input.type === 'radio')

export const isMultipleSelect = (input: unknown): input is HTMLSelectElement =>
	input instanceof HTMLSelectElement && input.multiple
