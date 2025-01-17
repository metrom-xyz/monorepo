export interface BackendKpiMeasurement {
    from: number;
    to: number;
    percentage: number;
}

export interface BackendKpiMeasurementResponse {
    measurements: BackendKpiMeasurement[];
}
