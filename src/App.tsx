import { useState } from "react";
import MiniCalendar from "./miniCalendar";

export default function App() {
  const [date, setDate] = useState(new Date());
  return (
    <div>
      {/* 受控 */}
      <MiniCalendar
        value={date}
        onChange={(newDate) => {
          setDate(newDate);
          console.log(newDate.toLocaleDateString());
        }}
      />
      {/* 非受控 */}
      <MiniCalendar
        defaultValue={new Date()}
        onChange={(newDate) => {
          console.log(newDate.toLocaleDateString());
        }}
      />
    </div>
  );
}
