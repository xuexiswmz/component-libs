import React, { useImperativeHandle } from "react";
import "./index.css";
import { useControllableValue } from "ahooks";

interface CalendarProps {
  defaultValue?: Date;
  onChange?: (date: Date) => void;
}
/**
 * 日历组件ref接口定义，用于父组件调用子组件方法
 */
interface CalendarRef {
  getDate: () => Date;
  setDate: (date: Date) => void;
}
/**
 * 内部日历组件实现
 * 使用forwardRef来支持ref转发
 */
const InternalCalendar: React.ForwardRefRenderFunction<
  CalendarRef,
  CalendarProps
> = (props, ref) => {
  // 解构props，设置默认值
  // const { value, defaultValue, onChange } = props;

  const [date, setDate] = useControllableValue(props, {
    defaultValue: new Date(),
  });
  /**
   * 使用useImperativeHandle暴露组件方法给父组件
   */
  useImperativeHandle(ref, () => {
    return {
      getDate() {
        return date;
      },
      setDate(date: Date) {
        setDate(date);
      },
    };
  });
  const handelPrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };
  const handelNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };
  const monthNames = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ];

  /**
   * 获取指定年月的天数
   * @param year 年份
   * @param month 月份（0-11）
   * @returns 该月的天数
   */
  const daysOfMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  /**
   * 获取指定年月第一天是星期几
   * @param year 年份
   * @param month 月份（0-11）
   * @returns 第一天是星期几（0表示星期日）
   */
  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  /**
   * 渲染日期网格
   * @returns 日期元素数组
   */
  const renderDates = () => {
    const days = [];
    // 获取当前月份的天数
    const daysCount = daysOfMonth(date.getFullYear(), date.getMonth());
    // 获取当前月份第一天是星期几
    const firstDay = firstDayOfMonth(date.getFullYear(), date.getMonth());

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty"></div>);
    }
    for (let i = 1; i <= daysCount; i++) {
      const clickHandler = () => {
        const curDate = new Date(date.getFullYear(), date.getMonth(), i);
        setDate(curDate);
      };

      if (i === date.getDate()) {
        days.push(
          <div key={i} className="day selected" onClick={() => clickHandler()}>
            {i}
          </div>
        );
      } else {
        days.push(
          <div key={i} className="day" onClick={() => clickHandler()}>
            {i}
          </div>
        );
      }
    }
    return days;
  };
  return (
    <div className="calendar">
      <div className="header">
        <button onClick={handelPrevMonth}>&lt;</button>
        <div>
          {date.getFullYear()}年{monthNames[date.getMonth()]}
        </div>
        <button onClick={handelNextMonth}>&gt;</button>
      </div>
      <div className="days">
        <div className="day">日</div>
        <div className="day">一</div>
        <div className="day">二</div>
        <div className="day">三</div>
        <div className="day">四</div>
        <div className="day">五</div>
        <div className="day">六</div>
        {renderDates()}
      </div>
    </div>
  );
};
/**
 * 使用forwardRef包装内部组件，使其支持ref转发
 */
const MiniCalendar = React.forwardRef(InternalCalendar);
export default MiniCalendar;
