import { useRef } from "react";
import MiniCalendar from "./miniCalendar";

interface CalendarRef {
  getDate: () => Date;
  setDate: (date: Date) => void;
}
export default function App() {
  const calendarRef = useRef<CalendarRef>(null);
  return (
    <div>
      <MiniCalendar ref={calendarRef} defaultValue={new Date()} />
    </div>
  );
}
