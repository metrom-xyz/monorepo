import dayjs, { Dayjs } from "dayjs";

export const getClosestAvailableDateTime = (date?: Dayjs | null) => {
    let base = date;
    if (date?.isBefore(dayjs())) base = dayjs();
    return getClosestAvailableTime(base);
};

export const getClosestAvailableTime = (date?: Dayjs | null) => {
    const base = date;

    const minutes = dayjs(base).get("m");
    if (minutes < 15) return dayjs(base).set("m", 15).set("s", 0).set("ms", 0);
    if (minutes < 30) return dayjs(base).set("m", 30).set("s", 0).set("ms", 0);
    if (minutes < 45) return dayjs(base).set("m", 45).set("s", 0).set("ms", 0);
    return dayjs(base).add(1, "h").set("m", 0).set("s", 0).set("ms", 0);
};
