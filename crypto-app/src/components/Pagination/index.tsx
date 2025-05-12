interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const handleClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  return (
    <nav className="flex items-center gap-x-1" aria-label="Pagination">
      <button
        type="button"
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
        aria-label="Previous"
      >
        <svg
          className="shrink-0 size-3.5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6"></path>
        </svg>
        <span>Previous</span>
      </button>

      <div className="flex items-center gap-x-1">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => handleClick(page)}
            className={`min-h-9.5 min-w-9.5 flex justify-center items-center py-2 px-3 text-sm rounded-lg focus:outline-hidden
              ${
                page === currentPage
                  ? 'bg-gray-200 text-gray-800 dark:bg-neutral-600 dark:text-white'
                  : 'text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10'
              }
            `}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
        aria-label="Next"
      >
        <span>Next</span>
        <svg
          className="shrink-0 size-3.5"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </button>
    </nav>
  )
}

export default Pagination
