function Sidebar() {

  const name = localStorage.getItem("name");
  const points = localStorage.getItem("points");
  const role = localStorage.getItem("role");

  return (

    <div className="card text-center">

      <img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        alt="profile"
        className="w-20 mx-auto mb-4"
      />

      <h2 className="text-xl font-bold mb-2">
        {name}
      </h2>

      <p className="text-gray-600 mb-2">
        Role: {role}
      </p>

      <p className="text-indigo-600 font-semibold">
        ⭐ {points} Points
      </p>

    </div>

  );

}

export default Sidebar;