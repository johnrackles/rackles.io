import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";

const tz = "Europe/Berlin";

dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.tz.setDefault(tz);

export { dayjs }
