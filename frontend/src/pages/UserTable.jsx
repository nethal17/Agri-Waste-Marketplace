const UsersTable = () => {
    // Sample user data
    const users = [
      {
        id: 1,
        name: "Lindsay Walton",
        email: "lindsay.walton@example.com",
        title: "Front-end Developer",
        department: "Optimization",
        status: "Active",
        role: "Member",
        avatar: "/avatars/avatar-1.png",
      },
      {
        id: 2,
        name: "Courtney Henry",
        email: "courtney.henry@example.com",
        title: "Designer",
        department: "Intranet",
        status: "Active",
        role: "Admin",
        avatar: "/avatars/avatar-2.png",
      },
      {
        id: 3,
        name: "Tom Cook",
        email: "tom.cook@example.com",
        title: "Director of Product",
        department: "Directives",
        status: "Active",
        role: "Member",
        avatar: "/avatars/avatar-3.png",
      },
      {
        id: 4,
        name: "Whitney Francis",
        email: "whitney.francis@example.com",
        title: "Copywriter",
        department: "Program",
        status: "Active",
        role: "Admin",
        avatar: "/avatars/avatar-4.png",
      },
      {
        id: 5,
        name: "Leonard Krasner",
        email: "leonard.krasner@example.com",
        title: "Senior Designer",
        department: "Mobility",
        status: "Active",
        role: "Owner",
        avatar: "/avatars/avatar-5.png",
      },
      {
        id: 6,
        name: "Floyd Miles",
        email: "floyd.miles@example.com",
        title: "Principal Designer",
        department: "Security",
        status: "Active",
        role: "Member",
        avatar: "/avatars/avatar-6.png",
      },
    ]
  
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto bg-gray-100">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name, title, email and role.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add user
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-white">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Title
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Role
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.avatar || `/placeholder.svg?height=40&width=40`}
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="text-gray-900">{user.title}</div>
                          <div className="text-gray-500">{user.department}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-green-800">
                            {user.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.role}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default UsersTable
  
  