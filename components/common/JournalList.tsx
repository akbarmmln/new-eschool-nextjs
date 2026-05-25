'use client'

import JournalCard from './JournalCard'

type Props = {
  data: any[]
  currentPage: number
  totalPage: number
  onPageChange: (
    page: number
  ) => void
}

export default function JournalList({ data, currentPage, totalPage, onPageChange } : Props) {
  function getPaginationItems(current: number, total: number) {
    const items: (number | string)[] = []

    // TOTAL <= 6
    if (total <= 6) {
      for (let i = 1; i <= total; i++) {
        items.push(i)
      }
      return items
    }

    // PAGE AWAL
    if (current <= 4) {
      items.push(1, 2, 3, 4, 5)
      items.push('...')
      items.push(total)
      return items
    }

    // PAGE AKHIR
    if (current >= total - 3) {
      items.push(1)
      items.push('...')
      for (let i = total - 4; i <= total; i++) {
        items.push(i)
      }
      return items
    }

    // PAGE TENGAH
    items.push(1)
    items.push('...')
    items.push(current - 1, current, current + 1)
    items.push('...')
    items.push(total)
    return items
  }

  return (
    <div>
      <>
        {/* DESKTOP */}
        <div className="hidden md:flex items-center justify-end gap-3 mt-6 mb-8">
          <button
            disabled={currentPage === 1}
            onClick={() =>
              onPageChange(currentPage - 1)
            }
            className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700" >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {
              getPaginationItems(currentPage, totalPage).map((item, index) => {
                if (item === '...') {
                  return (
                    <span
                      key={index}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400" >
                      ...
                    </span>
                  )
                }

                const isActive =currentPage === item

                return (
                  <button
                    key={index}
                    onClick={() =>
                      onPageChange(Number(item))
                    }
                    className={`w-11 h-11 rounded-2xl text-sm font-semibold transition-all ${isActive
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`} >
                    {item}
                  </button>
                )
              })
            }
          </div>

          <button
            disabled={
              currentPage === totalPage
            }
            onClick={() =>
              onPageChange(currentPage + 1)
            }
            className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700" >
            Next
          </button>
        </div>

        {/* MOBILE */}
        <div className="flex md:hidden items-center justify-between mt-6 mb-8 gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() =>
              onPageChange(currentPage - 1)
            }
            className="w-14 h-14 rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-2xl text-gray-700 shadow-sm disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" >
            ←
          </button>

          <div className="text-base font-semibold text-gray-700 dark:text-gray-300">
            Halaman {currentPage} dari {totalPage}
          </div>

          <button
            disabled={
              currentPage === totalPage
            }
            onClick={() =>
              onPageChange(currentPage + 1)
            }
            className="w-14 h-14 rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-2xl text-gray-700 shadow-sm disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" >
            →
          </button>
        </div>
      </>

      {/* GRID */}
      <div className="journal-grid">
        {data.map((item) => (
          <JournalCard
            key={item.id}
            item={item}
          />
        ))}
      </div>

      <style jsx>
        {`
        .journal-grid {

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 28px;

          margin-top: 24px;
        }

        .journal-pagination {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 18px;
          margin-bottom: 18px;
        }

        .journal-pagination button {
          border: none;
          background: white;
          color: #111827;
          padding: 10px 15px;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,.06);
          transition: .2s;
          min-width: 42px;
          height: 42px;
        }

        .journal-pagination button.active {
          background: linear-gradient(90deg, #4f8cff 0%, #5b7fff 50%, #696cff 100%);
          color: white;
          font-weight: 700;
        }

        .journal-pagination button:disabled {

          background: #f8fafc;

          color: #9ca3af;

          cursor: not-allowed;

          box-shadow: none;

          border: 1px solid #dbe2ea;
        }

        /* HOVER */
        .journal-pagination button:hover:not(:disabled) {

          transform: translateY(-2px);
        }
          
        .pagination-dots {
          padding: 0 4px;
          font-weight: 700;
        }
          
        .journal-pagination button:hover {
          transform: translateY(-2px);
        }

        .journal-pagination span {
          font-size: 15px;
          font-weight: 500;
          color: #111827;
        }

        :global(.dark) .journal-pagination button {
          background: #162033;
          color: white;
        }

        :global(.dark)
        .journal-pagination button.active {
          background: #4f46e5;
        }

        :global(.dark) .journal-pagination span {
          color: white;
        }

        @media (max-width: 768px) {
          .journal-grid {
            grid-template-columns:
              1fr;
          }
        }
      `}
      </style>
    </div>
  )
}