export const Main = () => {
  return (
    <div className="md:px-36 px-8 md:py-28 py-5">
      <div className="flex lg:flex-row flex-col gap-10 justify-between">
        {/* Left Content */}
        <div className="flex flex-col gap-3 justify-center p-1 lg:text-left text-center">
          <h1 className="text-4xl md:text-4xl font-bold">Explore</h1>
          <h1 className="text-4xl md:text-4xl font-bold">the Wonders in</h1>
          <h1 className="text-4xl md:text-5xl font-bold text-green-600">
            Sri Lanka
          </h1>
          <p className="mt-4 text-zinc-900">
            Discover the breathtaking landscapes, rich culture, and hidden gems of Sri Lanka. Let your adventure begin!
          </p>
          <button className="bg-zinc-900 text-white px-4 py-3 rounded-lg hover:bg-white hover:border hover:border-zinc-900 hover:text-zinc-900 hover:font-bold mt-4 transition">
            Get started
          </button>
        </div>
        {/* Right Image Section */}
        <div className="flex items-center">
          <img
            src="https://www.homebiogas.com/wp-content/uploads/2023/09/shutterstock_2057386766.jpg?w=1060"
            alt="Sri Lanka Nature"
            className="rounded-md h-auto w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};