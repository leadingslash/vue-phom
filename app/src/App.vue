<script setup lang="ts">
import { useZodForm } from './zod_form'
import { z } from 'zod'

const schema = z.object({
	name: z.string().min(4),
	age: z.number().min(18),
	data: z.object({
		additionalInfo: z.string().min(16),
	}),
	skills: z.array(
		z.object({
			id: z.string().min(1),
			skill: z.string().min(1),
			level: z.number().min(-10).max(10),
		}),
	),
})

const { useField, errors, useArrayField, handleSubmit, formState } = useZodForm(schema, {
	defaultValues: {
		name: 'New Name',
	},
})
const { fields, append, useFieldAtIndex } = useArrayField('skills')

const submit = handleSubmit((data) => console.log(data))
const appendHandler = () => {
	append({ id: `${Date.now()}`, skill: 'New Skill', level: 0 })
}
</script>

<template>
	<form @submit.prevent="submit">
		<div>
			<input type="text" v-bind="useField('name')" />
			<span v-if="errors.name">{{ errors.name.message }}</span>
		</div>
		<div>
			<input type="number" v-bind="useField('age', { toNumber: true })" />
			<span v-if="errors.age">{{ errors.age.message }}</span>
		</div>
		<div>
			<input type="text" v-bind="useField('data.additionalInfo')" />
			<span v-if="errors['data.additionalInfo']">{{
				errors['data.additionalInfo'].message
			}}</span>
		</div>

		<div v-for="(field, index) in fields" :key="field.id">
			<input v-bind="useFieldAtIndex(index, 'skill')" :key="field.id" type="text" />
			<span v-if="errors[`skills.${index}.skill`]">{{
				errors[`skills.${index}.skill`]?.message
			}}</span>
			<input
				v-bind="useFieldAtIndex(index, 'level', { toNumber: true })"
				:key="field.id"
				type="number"
			/>
			<span v-if="errors[`skills.${index}.level`]">{{
				errors[`skills.${index}.level`]?.message
			}}</span>
		</div>
		<div><button @click.prevent="appendHandler">appendHandler</button></div>

		<button type="submit" :disabled="formState.isSubmitting">Submit</button>
	</form>
</template>
