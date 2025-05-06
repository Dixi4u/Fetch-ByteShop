import React from "react";
import CardEmployee from "./CardEmployee";

const ListEmployees = ({
  setId,
  setActiveTab,
  deleteEmployee,
  updateEmployee,
  loading,
  employees,
}) => {
  return (
    <>
      <h1 className="text-2xl font-bold underline text-center">
        Listado de empleados
      </h1>
      <div className="flex flex-wrap gap-4 justify-center mt-5">
        {loading && <div className="text-center text-gray-500">Loading...</div>}

        {Array.isArray(employees) && employees.map((employee) => (
          <CardEmployee
            key={employee._id}
            employee={employee}
            deleteEmployee={deleteEmployee}
            updateEmployee={updateEmployee}
          />
        ))}

        {!loading && (!employees || !Array.isArray(employees)) && (
          <div className="text-center text-gray-500">No employees found.</div>
        )}
      </div>
    </>
  );
};

export default ListEmployees;
