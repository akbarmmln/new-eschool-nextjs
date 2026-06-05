'use client'

import React from 'react'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

type Props = {
  name?: string
  value: Date | null
  onChange: (
    date: Date | null
  ) => void,
  yearLength?: number
  isDarkModeAllowed?: boolean | false
}

const CustomInput = React.forwardRef<
  HTMLButtonElement,
  any
>((props, ref) => (
  <>
    <button
      type="button"
      className={`
      relative w-full h-12 rounded-xl
      border border-slate-300
      bg-white text-left
      ${props.isDarkModeAllowed
        ? "dark:bg-slate-800 dark:border-slate-700"
        : ""
      }
    `}
      onClick={props.onClick}
      ref={ref} >

      <input
        type="text"
        readOnly
        name={props.name}
        value={props.value || ""}
        placeholder={format(
          new Date(),
          "dd MMMM yyyy",
          { locale: id }
        )}
        className={`flex h-full items-center pl-6 pr-14 text-slate-700 bg-transparent text-slate-700 placeholder:text-slate-400 outline-none
          ${props.isDarkModeAllowed ? "dark:text-white" : ""}
        `}
      />

    </button>
  </>
))

CustomInput.displayName = 'CustomInput'

export default function CustomDatePicker({ name, value, onChange, yearLength = 10, isDarkModeAllowed = false }: Props) {
  const currentYear = new Date().getFullYear()

  return (
    <>
    <div className="form-group">
      <DatePicker
          selected={
            value instanceof Date
              ? value
              : null
          }
        onChange={onChange}
        locale={id}
        dateFormat="dd MMMM yyyy"
        customInput={<CustomInput name={name} isDarkModeAllowed={isDarkModeAllowed}/>}
        // portalId="root"
        withPortal
        renderCustomHeader={({
          date, changeYear, changeMonth, decreaseMonth, increaseMonth,
        }) => (
          <div className="custom-datepicker-header">
            <div className="header-top">
              <button type="button" onClick={decreaseMonth}>
                <i className="ri-arrow-left-s-line" />
              </button>

              <div className="header-title">
                {date.toLocaleString(
                  "id-ID",
                  {
                    month: "long",
                    year: "numeric",
                  }
                )}
              </div>

              <button type="button" onClick={increaseMonth}>
                <i className="ri-arrow-right-s-line" />
              </button>
            </div>

            <div className="header-selects">
              <select value={date.getMonth()} onChange={(e) => changeMonth(Number(e.target.value))} >
                {[
                  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
                ].map((
                  month,
                  index
                ) => (
                  <option
                    key={month}
                    value={index} >
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={date.getFullYear()} onChange={(e) => changeYear(Number(e.target.value))}>
                {Array.from(
                  { length: yearLength },
                  (_, i) =>
                    currentYear - i
                ).map((year) => (
                  <option
                    key={year}
                    value={year} >
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      />
    </div>
    </>    
  )
}