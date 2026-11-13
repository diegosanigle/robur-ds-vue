<script setup lang="ts">
// Una muestra con todos los componentes, para verlos juntos en los dos temas.
import { Button, Card, Checkbox, Chip, ExerciseRow, HeatmapCell, Input, StatCard, Tabs } from '..'

const TABS = [
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mes' },
]
</script>

<template>
  <div class="flex flex-col gap-4 bg-page p-5 text-primary">
    <h2 class="text-h2">Tu semana</h2>
    <Tabs label="Periodo" value="semana" :tabs="TABS" />
    <div class="grid grid-cols-2 gap-4">
      <StatCard label="Sesiones" value="3" />
      <StatCard variant="inverse" label="Volumen" value="2.480" unit="kg" />
      <StatCard variant="inverse" series="secondary" label="Peso máximo" value="62,5" unit="kg" />
      <Card>
        <p class="text-title">Descanso</p>
        <p class="text-sm text-tertiary">Sin sesiones previstas.</p>
      </Card>
    </div>
    <div class="grid grid-cols-7 gap-1">
      <HeatmapCell v-for="sessions in [0, 1, 2, 3, 4]" :key="sessions" :week="10 + sessions" :sessions="sessions" />
      <HeatmapCell :week="15" :sessions="0" rest />
      <HeatmapCell :week="16" :sessions="2" current />
    </div>
    <div class="flex gap-2">
      <Chip selected>Empuje</Chip>
      <Chip>Tirón</Chip>
      <Chip variant="accent">Nuevo</Chip>
    </div>
    <ExerciseRow name="Press de hombro" target="3 series × 12 reps" completed>
      <Input numeric label="Series" model-value="3" />
      <Input numeric label="Reps" model-value="12" />
      <Input numeric label="Peso (kg)" model-value="20" />
    </ExerciseRow>
    <Checkbox label="Plancha" hint="60 s" />
    <Input label="Notas" hint="Opcional." placeholder="Cómo te has sentido" />
    <Input label="Nombre" error="Escribe un nombre para el ejercicio." />
    <div class="flex flex-wrap gap-2">
      <Button>Guardar sesión</Button>
      <Button variant="secondary">Cancelar</Button>
      <Button variant="danger">Borrar sesión</Button>
    </div>
  </div>
</template>
