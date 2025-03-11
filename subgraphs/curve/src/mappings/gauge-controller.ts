import { NewGauge } from "../../generated/GaugeController/GaugeController";
import { Gauge } from "../../generated/schema";

export function handleNewGauge(event: NewGauge): void {
    let gauge = Gauge.load(event.params.addr);
    if (gauge !== null) return;

    gauge = new Gauge(event.params.addr);
    gauge.save();
}
