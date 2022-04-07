# vue-phom

## Caution

This project is in experimental phase, use at your own risk. All the API and implementation might change in the future release.

## Development Guide

-   Run `yarn && cd app && yarn && cd ..` to setup deps
-   Run `yarn dev` to run dev app
-   Run `yarn build` to build dist

## Getting started

```vue
<script setup lang="ts">
import { useForm } from 'vue-phom'

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
```


## Validation
Check `app/src/zod_form.ts` for validation implementation.

```vue
<script setup lang="ts">
import { useZodForm } from './zod_form'
import { z } from 'zod'

const schema = z.object({
    name: z.string().min(4),
    age: z.number().min(18),
})

const { useField, useError, handleSubmit, formState } = useZodForm(schema)

const nameError = useError('name')
const ageError = useError('age')

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

        <button type="submit" :disabled="formState.isSubmitting">Submit</button>
    </form>
</template>
```

## Radio & Checkbox

Radio and checkbox are supported by default. Multiple checkboxes will result in an array of values.

```vue
<template>
    <form>
        <div>
            <input id="agree" type="checkbox" v-bind="useField('agree')" />
            <label for="agree">Agree</label>
        </div>

        <div>
            <input id="jack" type="checkbox" v-bind="useField('checkedNames')" value="Ram" />
			<label for="jack">Ram</label>
			<input id="john" type="checkbox" v-bind="useField('checkedNames')" value="Rem" />
			<label for="john">Rem</label>
        </div>

        <div>
            <input id="one" v-bind="useField('job')" type="radio" value="Developer" />
			<label for="one">Developer</label>

			<input id="two" v-bind="useField('job')" type="radio" value="Manager" />
			<label for="two">Manager</label>
        </div>
    </form>
</template>
```

## Select & Multiple Select

```vue
<template>
    <select v-bind="useField('city')" multiple>
        <option>Helsinki</option>
        <option>Hanoi</option>
        <option>Paris</option>
    </select>
</template>
```
