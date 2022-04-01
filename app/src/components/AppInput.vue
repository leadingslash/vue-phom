<script setup lang="ts">
defineProps<{
	modelValue?: string
}>()

const emit = defineEmits<{
	(emit: 'update:modelValue', value: string): void
}>()

const inputHandler = (event: Event) => {
	emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
	<input :value="modelValue" type="text" @input="inputHandler" />
</template>
