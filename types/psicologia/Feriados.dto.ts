export interface GetFeriadosDTO {
  citdnlId: number;
  fecha: string;
  descripcion: string;
  estado: boolean; // Agregado para manejar el estado actual del feriado
}

export interface PostFeriadosDTO {
  citdnl_fecha: string;
  citdnl_descripcion: string;
  citdnl_usuario_creacion: string;
}
