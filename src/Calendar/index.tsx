import type { Dayjs } from "dayjs";
import cs from "classnames";
import "./index.scss";
import MonthCalendar from "./components/MonthCalendar";
import Header from "./components/Header";
import { useState, type ReactNode } from "react";
import LocaleContext from "./LocaleContext";
import dayjs from "dayjs";
import { useControllableValue } from "ahooks";
export interface CalendarProps {
  value?: Dayjs;
  defaultValue?: Dayjs;
  style?: React.CSSProperties;
  className?: string;
  // 定制日期显示（日程安排/节日信息），会完全覆盖日期单元格
  dateRender?: (currentDate: Dayjs) => ReactNode;
  // 定制日期单元格内容，内容会被添加到单元格内（在日期下面），只在全屏日历模式下生效
  dateInnerContent?: (currentDate: Dayjs) => ReactNode;
  // 国际化相关，切换中英文显示
  locale?: string;
  onChange?: (date: Dayjs) => void;
}
function Calendar(props: CalendarProps) {
  const { className, style, locale, value, onChange } = props;

  const [curValue, setCurValue] = useControllableValue<Dayjs>(props, {
    defaultValue: dayjs(),
  });
  const [curMonth, setCurMonth] = useState<Dayjs>(curValue);
  const classNames = cs("calendar", className);

  function changeDate(date: Dayjs) {
    setCurValue(date);
    setCurMonth(date);
    onChange?.(date);
  }

  function selectHandler(date: Dayjs) {
    changeDate(date);
  }
  function prevMonthHandler() {
    setCurMonth(curMonth.subtract(1, "month"));
  }
  function nextMonthHandler() {
    setCurMonth(curMonth.add(1, "month"));
  }

  function todayHandler() {
    const date = dayjs(Date.now());
    changeDate(date);
  }

  return (
    <LocaleContext.Provider value={{ locale: locale || navigator.language }}>
      <div className={classNames} style={style}>
        <Header
          curMonth={curMonth}
          prevMonthHandler={prevMonthHandler}
          nextMonthHandler={nextMonthHandler}
          todayHandler={todayHandler}
        />
        <MonthCalendar
          {...props}
          value={curValue}
          curMonth={curMonth}
          selectHandler={selectHandler}
        />
      </div>
    </LocaleContext.Provider>
  );
}
export default Calendar;
