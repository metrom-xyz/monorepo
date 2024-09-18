import dayjs, { Dayjs } from "dayjs";

export const getClosestAvailableDateTime = (date?: Dayjs | Date | null) => {
    const minutes = dayjs(date).get("minutes");
    if (minutes < 15) return dayjs(date).set("minutes", 15).set("seconds", 0);
    if (minutes < 30) return dayjs(date).set("minutes", 30).set("seconds", 0);
    if (minutes < 45) return dayjs(date).set("minutes", 45).set("seconds", 0);
    return dayjs(date).add(1, "hour").set("minutes", 0).set("seconds", 0);
};
