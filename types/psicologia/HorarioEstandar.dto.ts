export interface GetHorarioDTO {
  citcId: number;
  tiempoMaximoCita: number;
  intervaloCita: number;
  horaInicio: string;
  horaFin: string;
}

export interface PutHorarioDTO {
  tiempoMaximoCita: number;
  intervaloCita: number;
  horaInicio: string;
  horaFin: string;
}
