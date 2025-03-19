import { Gauge } from "../../generated/schema";
import { GaugeCreated } from "../../generated/Voter/Voter";

export function handleGaugeCreated(event: GaugeCreated): void {
    let gauge = new Gauge(event.params.gauge);
    gauge.pool = event.params.pool;
    gauge.save();
}
