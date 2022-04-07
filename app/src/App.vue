<script setup lang="ts">
import { useZodForm } from './zod_form'
import { z } from 'zod'
import AppInput from './components/AppInput.vue'

const schema = z.object({
	name: z.string().min(4),
	age: z.number().min(18),
	data: z.object({
		additionalInfo: z.string().min(16),
		city: z.string().array(),
	}),
	skills: z.array(
		z.object({
			id: z.string().min(1),
			skill: z.string().min(1),
			level: z.number().min(-10).max(10),
		}),
	),
	agree: z.boolean(),
	checkedNames: z.array(z.string()),
	gender: z.string(),
})

const { useField, errors, useArrayField, handleSubmit, formState } = useZodForm(schema, {
	defaultValues: {
		agree: true,
		name: 'New Name',
		checkedNames: ['John'],
		data: {
			city: ['A', 'B'],
		},
		gender: 'Male',
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
			<AppInput type="number" v-bind="useField('age', { toNumber: true })" />
			<span v-if="errors.age">{{ errors.age.message }}</span>
		</div>
		<div>
			<AppInput type="text" v-bind="useField('data.additionalInfo')" />
			<span v-if="errors['data.additionalInfo']">{{
				errors['data.additionalInfo'].message
			}}</span>
		</div>
		<div>
			<select v-bind="useField('data.city')" multiple>
				<option>A</option>
				<option>B</option>
				<option>C</option>
			</select>
			<span v-if="errors['data.additionalInfo']">{{
				errors['data.additionalInfo'].message
			}}</span>
		</div>

		<div v-for="(field, index) in fields" :key="field.id">
			<AppInput v-bind="useFieldAtIndex(index, 'skill')" :key="field.id" type="text" />
			<span v-if="errors[`skills.${index}.skill`]">{{
				errors[`skills.${index}.skill`]?.message
			}}</span>
			<AppInput
				v-bind="useFieldAtIndex(index, 'level', { toNumber: true })"
				:key="field.id"
				type="number"
			/>
			<span v-if="errors[`skills.${index}.level`]">{{
				errors[`skills.${index}.level`]?.message
			}}</span>
		</div>
		<div><button @click.prevent="appendHandler">appendHandler</button></div>

		<div>
			<input id="agree" type="checkbox" v-bind="useField('agree')" />
			<label for="agree">Agree</label>
			<span v-if="errors.agree">{{ errors.agree.message }}</span>
		</div>

		<div>
			<input id="jack" type="checkbox" v-bind="useField('checkedNames')" value="Jack" />
			<label for="jack">Jack</label>
			<input id="john" type="checkbox" v-bind="useField('checkedNames')" value="John" />
			<label for="john">John</label>
			<span v-if="errors.checkedNames">{{ errors.checkedNames.message }}</span>
		</div>

		<div>
			<input id="one" v-bind="useField('gender')" type="radio" value="Male" />
			<label for="one">Male</label>

			<input id="two" v-bind="useField('gender')" type="radio" value="Female" />
			<label for="two">Female</label>
		</div>

		<button type="submit" :disabled="formState.isSubmitting">Submit</button>
	</form>
</template>
