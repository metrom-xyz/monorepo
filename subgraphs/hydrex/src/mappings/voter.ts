import { Gauge } from "../../generated/schema";
import { GaugeCreated } from "../../generated/Voter/Voter";

export function handleGaugeCreated(event: GaugeCreated): void {
    let gauge = Gauge.load(event.params.gauge);
    if (gauge !== null) return;

    gauge = new Gauge(event.params.gauge);
    gauge.save();
}
