<script setup lang="ts">
// Una muestra con todos los componentes, para verlos juntos en los dos temas.
import { BarChart, Button, Card, Checkbox, Chip, ExerciseRow, HeatmapCell, HeatmapYear, Icon, Input, LineChart, ListRow, Select, StatCard, Tabs, WeekStrip } from '..'

const YEAR = Array.from({ length: 52 }, (_, i) => ({ week: i + 1, sessions: (i * 7) % 5, current: i === 45 }))
const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((label, i) => ({ label, name: `día ${i + 1}`, done: i % 3 === 0, current: i === 3 }))
const BARS = [3, 1.5, 0, 2.5, 4, 2].map((value, i) => ({ label: String(40 + i), value }))
const LINE = [20, 22.5, 22.5, 25, 27.5].map((value, i) => ({ label: `0${i + 1}-11`, value }))
const noop = () => {}

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
    <HeatmapYear :year="2026" :weeks="YEAR" />
    <Card variant="inverse"><WeekStrip :days="DAYS" /></Card>
    <BarChart title="Volumen semanal" :data="BARS" />
    <LineChart variant="inverse" title="Press de hombro, peso (kg)" :data="LINE" />
    <ul>
      <ListRow title="Empuje" detail="Lun 9 nov · 6 ejercicios" @select="noop" />
      <ListRow title="Press de hombro" detail="3 × 12"><Button variant="text">Quitar</Button></ListRow>
      <ListRow title="Pierna" value="12" />
    </ul>
    <Select label="Ejercicio" placeholder="Elige un ejercicio" :options="[{ value: 'press', label: 'Press de hombro' }]" />
    <div class="flex gap-3 text-primary">
      <Icon name="home" size="lg" />
      <Icon name="plus" size="lg" />
      <Icon name="check" size="lg" />
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
      <Button variant="text">Añadir ejercicio</Button>
    </div>
  </div>
</template>
