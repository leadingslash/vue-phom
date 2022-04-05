<script setup lang="ts">
import { useZodForm } from './zod_form'
import { z } from 'zod'

const schema = z.object({
	name: z.string().min(4),
	age: z.number().min(18),
	data: z.object({
		additionalInfo: z.string().min(16),
	}),
})

const { useField, useError, handleSubmit, formState } = useZodForm(schema)

const nameError = useError('name')
const ageError = useError('age')
const additionalInfoError = useError('data.additionalInfo')

const submit = handleSubmit((data) => console.log(data))
</script>

<template>
	<form @submit.prevent="submit">
		<div>
			<input type="text" v-bind="useField('name')" />
			<span v-if="nameError">{{ nameError.message }}</span>
		</div>
		<div>
			<input type="number" v-bind="useField('age', { toNumber: true })" />
			<span v-if="ageError">{{ ageError.message }}</span>
		</div>
		<div>
			<input type="text" v-bind="useField('data.additionalInfo')" />
			<span v-if="additionalInfoError">{{ additionalInfoError.message }}</span>
		</div>

		<button type="submit" :disabled="formState.isSubmitting">Submit</button>
	</form>
</template>
