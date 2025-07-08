import dayjs, { Dayjs } from "dayjs";

export const getClosestAvailableDateTime = (date?: Dayjs | null) => {
    let base = date;
    if (date?.isBefore(dayjs())) base = dayjs();

    const minutes = dayjs(base).get("minutes");
    if (minutes < 15) return dayjs(base).set("minutes", 15).set("seconds", 0);
    if (minutes < 30) return dayjs(base).set("minutes", 30).set("seconds", 0);
    if (minutes < 45) return dayjs(base).set("minutes", 45).set("seconds", 0);
    return dayjs(base).add(1, "hour").set("minutes", 0).set("seconds", 0);
};
