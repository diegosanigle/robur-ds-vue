<script setup lang="ts">
// La última medición del sistema, pintada con sus propios componentes. Ningún número se escribe a mano.
import history from '../../metrics/history.json'
import metrics from '../../metrics/latest.json'
import { Card, StatCard } from '..'

const number = (value: number | null | undefined) => (value === null || value === undefined ? '—' : value.toLocaleString('es-ES'))
const section = 'flex flex-col gap-4'
const grid = 'grid grid-cols-2 gap-4 md:grid-cols-4'
const evals = metrics.evals
  ? Object.entries(metrics.evals as Record<string, unknown>)
      .filter(([, value]) => typeof value === 'object')
      .map(([name, value]) => ({ name, rate: (value as { rate: number }).rate }))
  : null
const app = metrics.app as null | { files: number; filesUsingSystem: number; rawControls: number; classesOutsideSystem: number; hexColors: number; arbitraryValues: number }
</script>

<template>
  <div class="flex max-w-240 flex-col gap-8">
    <p class="text-sm text-tertiary">Medición del {{ metrics.date }}</p>
    <section :class="section">
      <h2 class="text-h3 text-primary">Tamaño del sistema</h2>
      <div :class="grid">
        <StatCard variant="inverse" label="Componentes" :value="number(metrics.system.components)" />
        <StatCard label="Patrones" :value="number(metrics.system.patterns)" />
        <StatCard label="Tokens semánticos" :value="number(metrics.system.semanticTokens)" />
        <StatCard label="Stories con test" :value="number(metrics.system.stories)" />
      </div>
    </section>
    <section :class="section">
      <h2 class="text-h3 text-primary">Coherencia</h2>
      <div :class="grid">
        <StatCard label="Piezas con contrato" :value="number(metrics.coverage.contracts)" unit="%" />
        <StatCard label="Props documentadas" :value="number(metrics.coverage.documentedProps)" unit="%" />
        <StatCard label="Paridad con Figma" :value="number(metrics.coverage.figmaParity)" unit="%" />
        <StatCard label="Antigüedad de la foto de Figma" :value="number(metrics.coverage.figmaSnapshotAgeDays)" unit="días" />
      </div>
    </section>
    <section :class="section">
      <h2 class="text-h3 text-primary">Accesibilidad</h2>
      <div :class="grid">
        <StatCard label="Parejas de contraste comprobadas" :value="number(metrics.accessibility.contrastPairs)" />
        <StatCard label="Margen de la pareja más justa" :value="number(metrics.accessibility.tightestPair.margin)" unit="×" />
      </div>
    </section>
    <section :class="section">
      <h2 class="text-h3 text-primary">Evals: ¿usa bien el agente el sistema?</h2>
      <div :class="grid">
        <template v-if="evals">
          <StatCard v-for="e in evals" :key="e.name" :label="e.name" :value="number(e.rate)" unit="%" />
        </template>
        <div v-else class="col-span-2">
          <Card>
            <p class="text-title">Aún no se han ejecutado</p>
            <p class="text-sm text-secondary">Se ejecutan con npm run evals y aparecen aquí en la siguiente medición.</p>
          </Card>
        </div>
      </div>
    </section>
    <section v-if="app" :class="section">
      <h2 class="text-h3 text-primary">La app: interfaz que sigue fuera del sistema</h2>
      <div :class="grid">
        <StatCard label="Ficheros que usan el sistema" :value="`${number(app.filesUsingSystem)} de ${number(app.files)}`" />
        <StatCard label="Controles dibujados a mano" :value="number(app.rawControls)" />
        <StatCard label="Clases fuera del sistema" :value="number(app.classesOutsideSystem)" />
        <StatCard label="Colores y valores a mano" :value="number(app.hexColors + app.arbitraryValues)" />
      </div>
    </section>
    <section :class="section">
      <h2 class="text-h3 text-primary">Historial</h2>
      <Card>
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-tertiary">
              <th class="pb-2 font-semibold">Fecha</th>
              <th class="pb-2 font-semibold">Componentes</th>
              <th class="pb-2 font-semibold">Stories</th>
              <th class="pb-2 font-semibold">Paridad</th>
              <th class="pb-2 font-semibold">Evals con MCP</th>
              <th class="pb-2 font-semibold">Controles a mano en la app</th>
            </tr>
          </thead>
          <tbody class="tabular-nums">
            <tr v-for="row in history" :key="row.date">
              <td class="py-1">{{ row.date }}</td>
              <td>{{ number(row.components) }}</td>
              <td>{{ number(row.stories) }}</td>
              <td>{{ number(row.figmaParity) }} %</td>
              <td>{{ row.evalsWithMcp === null ? '—' : `${row.evalsWithMcp} %` }}</td>
              <td>{{ number(row.appRawControls) }}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </section>
  </div>
</template>
