import { z as zod } from 'zod'

import { useForm, type Options as FormOptions, type ValidationError } from '../../src'

type Options<TData extends Record<string, unknown>, TDefaultData extends TData = TData> = Omit<
	FormOptions<TData, TDefaultData>,
	'validation'
>

export const useZodForm = <
	TSchema extends zod.ZodType,
	TDefaultData extends TData,
	TData extends Record<string, unknown> = zod.TypeOf<TSchema>,
>(
	schema: TSchema,
	options?: Options<TData, TDefaultData>,
) => {
	const validation = (data: TData) => {
		const parseData = schema.safeParse(data)
		if (parseData.success) {
			return null
		}
		const errors = parseData.error.errors
		const result: Record<string, ValidationError> = {}

		for (const error of errors) {
			result[error.path.join('.')] = {
				code: error.code,
				message: error.message,
			}
		}

		return result
	}

	const form = useForm<TData, TDefaultData>({ ...options, validation })
	return form
}
