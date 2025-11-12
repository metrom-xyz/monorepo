import { Gauge } from "../../generated/schema";
import { GaugeCreated } from "../../generated/GaugesFactory/GaugesFactory";

export function handleGaugeCreated(event: GaugeCreated): void {
    let gauge = Gauge.load(event.params.gauge);
    if (gauge !== null) return;

    new Gauge(event.params.gauge).save();
}
