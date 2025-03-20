// EquipoMantenimiento.dto.ts

export interface EquipoMantenimientoDto {
    ubicacion: string
    dependencia: string
    nombrePc: string
    marcaMonitor: string
    modeloMonitor: string
    marcaCpu: string
    modeloCpu: string
    marcaProcesador: string
    ramMarca: string
    ramCapacidad: string
    discoMarca: string
    estadoDiscoAntes: string
    estadoDiscoActual: string
    codigoMonitor: string
    codigoCpu: string
    usuario: string
    estadoMantenimiento: string | null
    fechaCompra: string
    observacion: string
  }
  