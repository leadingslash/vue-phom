<script setup lang="ts">
import { useForm } from '../../src/index'

const { useField, useArrayField, handleSubmit, formState } = useForm<{
	name: string
	info: { age: number }
	skills: Array<{ id: string; skill: string; level: number }>
}>({
	defaultValues: {
		skills: [
			{
				id: `${Date.now()}`,
				skill: 'React',
				level: 0,
			},
		],
	},
})

const { fields, append, useFieldAtIndex } = useArrayField('skills')

const submit = handleSubmit((data) => console.log(data))
const appendHandler = () => {
	append({ id: `${Date.now()}`, skill: `New Skill`, level: 0 })
}
</script>

<template>
	<form @submit.prevent="submit">
		<div>
			<input type="text" v-bind="useField('name')" />
			<span v-if="formState.fieldsDirty['name']">changed</span>
		</div>
		<div>
			<input type="number" v-bind="useField('info.age', { toNumber: true })" />
			<span v-if="formState.fieldsDirty['info.age']">changed</span>
		</div>
		<div v-for="(field, index) in fields" :key="field.id">
			<input v-bind="useFieldAtIndex(index, 'skill')" :key="field.id" type="text" />
			<input
				v-bind="useFieldAtIndex(index, 'level', { toNumber: true })"
				:key="field.id"
				type="number"
			/>
		</div>
		<div><button @click.prevent="appendHandler">appendHandler</button></div>

		<button type="submit" :disabled="formState.isSubmitting">Submit</button>
	</form>
</template>
