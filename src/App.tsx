import Calendar from "./Calendar";
import dayjs from "dayjs";

export default function App() {
  return (
    <div>
      <Calendar defaultValue={dayjs("2023-01-01")} />
    </div>
  );
}
