'use client'

import JournalCard
  from './JournalCard'

type Props = {

  data: any[]

  currentPage: number

  totalPage: number

  onPageChange: (
    page: number
  ) => void
}

export default function JournalList({
  data,
  currentPage,
  totalPage,
  onPageChange,

}: Props) {

  function getPaginationItems(current: number, total: number) {
    const items = []
    items.push(1)
    if (current > 3) {
      items.push('...')
    }

    for (let i = current - 1; i <= current + 1; i++) {
      if (i > 1 && i < total) {
        items.push(i)
      }
    }

    if (current < total - 2) {
      items.push('...')
    }

    if (total > 1) {
      items.push(total)
    }
    return items
  }

  return (
    <div>
      <div className="journal-pagination">

        {/* PREV */}
        <button
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(
              currentPage - 1
            )
          }
        >
          Prev
        </button>

        {/* PAGE ITEMS */}
        {
          getPaginationItems(
            currentPage,
            totalPage
          ).map((item, index) => {

            // DOTS
            if (item === '...') {

              return (

                <span
                  key={index}
                  className="pagination-dots"
                >
                  ...
                </span>
              )
            }

            // PAGE NUMBER
            return (

              <button
                key={index}
                className={
                  currentPage === item
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  onPageChange(
                    Number(item)
                  )
                }
              >
                {item}
              </button>
            )
          })
        }

        {/* NEXT */}
        <button
          disabled={
            currentPage === totalPage
          }
          onClick={() =>
            onPageChange(
              currentPage + 1
            )
          }
        >
          Next
        </button>

      </div>
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
          background: #4f46e5;
          color: white;
          font-weight: 700;
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

        @media (
          max-width: 768px
        ) {

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