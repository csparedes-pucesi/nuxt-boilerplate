// C:\Users\dev6\Documents\frontend-sistema-administrativo\src\modules\Psicologia\types\especialidadStore.ts
import { defineStore } from 'pinia';

export const useEspecialidadStore = defineStore('especialidad', {
  state: () => ({
    citacId: null as number | null,
    areaNombre: '' as string, // Propiedad para guardar el nombre del área
  }),
  actions: {
    // Función para almacenar el citacId y el nombre del área
    setEspecialidad(citacId: number | null, areaNombre?: string) {
      this.citacId = citacId;
      if (areaNombre !== undefined) {
        this.areaNombre = areaNombre;
      }
    },
    // Función para obtener el citacId almacenado
    getEspecialidad(): number | null {
      return this.citacId;
    },
    // Función para obtener el nombre del área almacenado
    getAreaNombre(): string {
      return this.areaNombre;
    },
  },
});
