import { useState } from "react";

type fillOptions = any;

type Props = {
  options: fillOptions[];
  selected: string[];
  onChange: (value: string[]) => void;
  namaLabel: string;
};

export default function MultiSelect({ options, selected, onChange, namaLabel }: Props) {
  const [open, setOpen] = useState(false);

  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      onChange(
        selected.filter(
          (item) => item !== id
        )
      );
    } else {
      onChange([
        ...selected,
        id,
      ]);
    }
  };

  const removeOption = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    onChange(
      selected.filter(
        (item) => item !== id
      )
    );
  };

  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)} className="min-h-[56px] cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 pr-10">
          {selected.length > 0 ? (
            selected.map((id) => {
              const items = options.find(
                (items) => items.id === id
              );

              if (!items) return null;

              return (
                <div key={id} className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                  <span>
                    {items.nama}
                  </span>

                  <button
                    type="button"
                    className="text-slate-500 hover:text-red-500"
                    onClick={(e) => removeOption(e, id)} >
                    <i className="ri-close-line" />
                  </button>
                </div>
              );
            })
          ) : (
            <span className="text-slate-400">
              {namaLabel}
            </span>
          )}
        </div>

        <i className={`ri-arrow-down-s-line absolute right-4 top-1/2 -translate-y-1/2 text-xl transition ${open ? "rotate-180" : ""}`}/>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {options.map((items) => {
            const isSelected =
              selected.includes(
                items.id
              );

            return (
              <button
                className={`flex w-full items-center justify-between border-b border-slate-100 px-4 py-4 text-left hover:bg-slate-50 ${isSelected ? "bg-blue-50" : ""}`}
                key={items.id}
                type="button"
                onClick={() => toggleOption(items.id)} >
                <div>
                  <p className="font-medium text-slate-800">
                    {items.niy} {" • "} {items.nama}
                  </p>
                </div>

                {isSelected && (
                  <i className="ri-check-line text-lg text-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}