const Banner = () => {
  return (
    <div className="bg-primary text-white rounded-2xl p-6 md:p-8 flex flex-col gap-4">
      <p className="text-sm md:text-base">Welcome</p>
      <h2 className="text-lg md:text-2xl font-semibold leading-snug">
        Make your first Investment today
      </h2>
      <button className="mt-2 self-start px-4 py-2 text-blue-600 bg-white rounded-md font-medium text-sm hover:bg-blue-50 transition">
        Invest Today
      </button>
    </div>
  )
}

export default Banner
