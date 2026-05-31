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
  ) => void
}

const CustomInput = React.forwardRef<
  HTMLButtonElement,
  any
>((props, ref) => (
  <>
    <button
      type="button"
      className="input-icon"
      onClick={props.onClick}
      ref={ref} >

      <input
        type="text"
        readOnly
        name={props.name}
        value={props.value || ''}
        placeholder={format(new Date(), 'dd MMMM yyyy', { locale: id })}
      />

      <i className="ri-calendar-line" />

    </button>
  </>
))

CustomInput.displayName = 'CustomInput'

export default function CustomDatePicker({ name, value, onChange }: Props) {
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
        customInput={<CustomInput name={name}/>}

        renderCustomHeader={({
          date, changeYear, changeMonth, decreaseMonth, increaseMonth,
        }) => (
          <div className="custom-datepicker-header">
            <div className="header-top">
              <button
                type="button"
                onClick={decreaseMonth} >
                <i className="ri-arrow-left-s-line" />
              </button>

              <div className="header-title">
                {date.toLocaleString(
                  'id-ID',
                  {
                    month: 'long',
                    year: 'numeric',
                  }
                )}
              </div>

              <button
                type="button"
                onClick={increaseMonth} >
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
                  { length: 10 },
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