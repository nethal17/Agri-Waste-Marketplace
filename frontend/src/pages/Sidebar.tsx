export const Sidebar = () => {
    return (
      <aside className="w-64 p-4 bg-green-100">
        <h2 className="text-lg font-semibold mb-4">Explore Communities</h2>
        <ul className="space-y-2">
          <li className="cursor-pointer">Newbies</li>
          <li className="cursor-pointer">Experts</li>
          <li className="cursor-pointer">Trends</li>
        </ul>
        <button className="w-full mt-4 bg-green-500 text-white py-2 rounded">Considering Therapy</button>
      </aside>
    );
  }
  