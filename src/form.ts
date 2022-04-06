import { ref, unref, reactive, computed, shallowRef, readonly } from 'vue'

import { get, set, pullAt } from './utils/common'

import type { DeepPartial } from './types/deep'
import type { Path, PathValue } from './types/paths'
import type { WritableComputedRef } from 'vue'
import type { ArrayValue } from './types/common'
import { debounce } from './utils/debounce'

type FormState = 'idle' | 'submitting' | 'success' | 'error'
type ValidateType = 'submit' | 'change' | 'blur'

type AnyDataType = Record<string, unknown>
export type ValidationResolver<TData extends AnyDataType> = (
	data: TData,
) => Promise<Record<string, ValidationError> | null> | Record<string, ValidationError> | null

export interface Options<TData extends AnyDataType, TDefaultData extends TData = TData> {
	defaultValues?: DeepPartial<TDefaultData>
	validation?: ValidationResolver<TData>
	validateType?: ValidateType
	reValidateType?: ValidateType
	validateOnChangeDebounce?: number
}

export interface FieldOptions<TField = any, TTransform = any> {
	toNumber?: boolean
	toDate?: boolean
	transform?: (value: TField) => TTransform
}

export type ValidationError = {
	message: string
	code: string
}

export type ValidationErrors<TData extends AnyDataType> = Partial<
	Record<Path<TData>, ValidationError>
>

export const useForm = <TData extends AnyDataType, TDefaultData extends TData = TData>(
	options: Options<TData, TDefaultData> = {},
) => {
	const {
		defaultValues,
		validation,
		validateType = 'submit',
		reValidateType = 'change',
		validateOnChangeDebounce = 50,
	} = options

	const state = ref<FormState>('idle')
	const errors = ref<ValidationErrors<TData>>({})

	const isIdle = computed(() => state.value === 'idle')
	const isSubmitting = computed(() => state.value === 'submitting')
	const isSubmitted = computed(() => state.value === 'success' || state.value === 'error')
	const isSuccess = computed(() => state.value === 'success')
	const isError = computed(() => state.value === 'error')
	const isDirty = ref(false)
	const fieldsDirty = ref<Partial<Record<Path<TData>, boolean>>>({})
	const fieldsTouch = ref<Partial<Record<Path<TData>, boolean>>>({})

	const debounceOnChangeValidate = debounce(() => {
		if (
			(isSubmitted.value && reValidateType === 'change') ||
			(isIdle.value && validateType === 'change')
		) {
			validate(unref(dataRef))
		}
	}, validateOnChangeDebounce)

	const formState = readonly({
		isIdle,
		isSubmitting,
		isSubmitted,
		isSuccess,
		isError,
		isDirty,
		fieldsDirty,
		fieldsTouch,
	})

	const submit = () => {
		state.value = 'submitting'
		errors.value = {}
	}

	const succeed = () => {
		state.value = 'success'
		fieldsDirty.value = {}
		fieldsTouch.value = {}
	}

	const fail = () => {
		state.value = 'error'
		fieldsDirty.value = {}
		fieldsTouch.value = {}
	}

	const reset = () => {
		state.value = 'idle'
		dataRef.value = { ...defaultValues } as TData
		errors.value = {}
		isDirty.value = false
		fieldsDirty.value = {}
		fieldsTouch.value = {}
	}

	// Wrapper validation
	const validate = async (data: TData) => {
		if (validation) {
			const validateErrors = await validation(data)
			if (validateErrors) {
				errors.value = validateErrors
				return false
			} else {
				errors.value = {}
				return true
			}
		}
		return true
	}

	const dataRef = ref<TData>({ ...defaultValues } as TData)
	const fieldRefs = shallowRef<Partial<Record<Path<TData>, any>>>({})

	const getFieldModel = <TPath extends Path<TData>>(
		path: TPath,
		options?: FieldOptions<PathValue<TData, TPath>>,
	): WritableComputedRef<PathValue<TData, TPath>> => {
		const { toDate, toNumber, transform } = options ?? {}
		const field = computed<PathValue<TData, TPath>>({
			get: () => get(unref(dataRef), path, null),
			set: (value: any) => {
				let finalValue = value
				if (toDate) {
					finalValue = new Date(finalValue)
				}
				if (toNumber) {
					const number = parseFloat(finalValue)
					finalValue = Number.isNaN(number) ? finalValue : number
				}
				if (transform) {
					finalValue = transform(finalValue)
				}
				set(unref(dataRef), path, finalValue)
				fieldsDirty.value[path] = true
				isDirty.value = true

				debounceOnChangeValidate()
			},
		})
		return field
	}

	const watchField = <TPath extends Path<TData>>(path: TPath) => {
		return readonly(computed<PathValue<TData, TPath>>(() => get(unref(dataRef), path, null)))
	}

	const useField = <TPath extends Path<TData>>(
		path: TPath,
		options?: FieldOptions<PathValue<TData, TPath>>,
	) => {
		const model = getFieldModel(path, options)

		// ref control
		const refFn = (node: any) => {
			fieldRefs.value[path] = node
		}

		const oninput = (event: Event) =>
			(model.value = (event.target as HTMLInputElement).value as any)

		const onblur = () => {
			if (
				(isSubmitted.value && reValidateType === 'blur') ||
				(isIdle.value && validateType === 'blur')
			) {
				validate(unref(dataRef))
			}
			fieldsTouch.value[path] = true
		}

		const onfocus = () => {
			fieldsTouch.value[path] = true
		}

		return reactive({
			value: model,
			ref: refFn,
			oninput,
			onblur,
			onfocus,
		})
	}

	const useArrayField = <TPath extends Path<TData>>(path: TPath) => {
		const model = getFieldModel(path)
		const castModel = model as WritableComputedRef<Array<any>>

		if (!model.value || !Array.isArray(model.value)) {
			model.value = [] as PathValue<TData, TPath>
		}

		const append = (value: ArrayValue<PathValue<TData, TPath>>) => {
			castModel.value.push({ ...value })
		}

		const prepend = (value: ArrayValue<PathValue<TData, TPath>>) => {
			castModel.value.push({ ...value })
		}

		const remove = (index: number) => {
			pullAt(castModel.value, index)
		}

		const useFieldAtIndex = (
			index: number,
			subPath: Path<ArrayValue<PathValue<TData, TPath>>>,
			options?: FieldOptions<PathValue<TData, TPath>>,
		) => {
			return useField(`${path}.${index}.${subPath}` as any, options)
		}

		return {
			append,
			prepend,
			remove,
			fields: watchField(path),
			useFieldAtIndex,
		}
	}

	const handleSubmit =
		(handler: (data: TData) => Promise<void> | void) => async (_event: Event) => {
			const data = unref(dataRef)

			if (!(await validate(data))) {
				fail()
				return
			}

			// Submit
			submit()

			try {
				await handler(data)
				succeed()
			} catch (error) {
				fail()
				throw error
			}
		}

	return {
		handleSubmit,
		formState,
		reset,
		useField,
		useArrayField,
		watchField,
		errors: readonly(errors),
	}
}
