import React, { useState, useEffect } from "react";

import { getRoles, deleteRole } from "../../../services/roleService";

import RoleForm from "./roleForm";
import RolesTable from "./rolesTable";

import SearchBox from "../../../common/searchBox";

import _ from "lodash";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

function Roles(props) {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);

  const [filterDisplay, setFilterDisplay] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(true);
  const [displayForm, setDisplayForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState({ path: "nom", order: "desc" });
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const pageSize = 10;
  useEffect(() => {
    const fetchData = async () => {
      const { data: roles } = await getRoles();
      setRoles(roles);
    };
    if (dataUpdated) fetchData();
    setDataUpdated(false);
  }, [dataUpdated]);

  useEffect(() => {
    let filtered = roles;
    const getData = async () => {
      if (searchQuery)
        filtered = roles.filter((m) =>
          m.nom.toLowerCase().startsWith(searchQuery.toLowerCase()),
        );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
      const endOffset = itemOffset + pageSize;

      setFilteredRoles(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    if (roles.length !== 0) getData();
    setTotalCount(filtered.length);
  }, [
    currentPage,
    itemOffset,
    roles,
    searchQuery,
    sortColumn.order,
    sortColumn.path,
  ]);

  const handleDelete = async (items) => {
    const originalRoles = roles;
    setRoles(
      roles.filter((c) => {
        let founded = items.find((p) => p._id.toString() === c._id.toString());
        if (founded) return false;
        return true;
      }),
    );
    setSelectedRole(null);
    setSelectedRoles([]);
    try {
      items.forEach(async (item) => {
        await deleteRole(item._id);
      });
      toast.success("role supprimé");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("role déja supprimé");
      setRoles(originalRoles);
    }
  };
  const handleSelectRole = (role) => {
    let newSelectedRoles = [...selectedRoles];

    const index = newSelectedRoles.findIndex(
      (c) => c._id.toString() === role._id.toString(),
    );
    if (index === -1) newSelectedRoles.push(role);
    else newSelectedRoles.splice(index, 1);
    let selectedRole = null;
    let founded = roles.find((p) => p._id.toString() === role._id.toString());
    if (founded && newSelectedRoles.length === 1) selectedRole = founded;
    setSelectedRoles(newSelectedRoles);
    setSelectedRole(newSelectedRoles.length === 1 ? selectedRole : null);
    setDisplayForm(false);
  };
  const handleSelectRoles = () => {
    let newSelectedRoles =
      selectedRoles.length === filteredRoles.length ? [] : [...filteredRoles];
    setSelectedRoles(newSelectedRoles);
    setSelectedRole(newSelectedRoles.length === 1 ? newSelectedRoles[0] : null);
  };
  const handlePageClick = (event) => {
    const newOffset = (event.selected * pageSize) % totalCount;
    setItemOffset(newOffset);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const toggleFilter = () => {
    setFilterDisplay(!filterDisplay);
  };
  const updateData = () => {
    setDataUpdated(true);
    setSelectedRole(null);
    setSelectedRoles([]);
    setDisplayForm(false);
  };
  const handleEdit = () => {
    setDisplayForm(true);
  };
  const toggleForm = () => {
    setSelectedRole(null);
    setSelectedRoles([]);
    setDisplayForm(!displayForm);
  };
  if (totalCount === 0) {
    return (
      <>
        <button
          className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={toggleForm}
        >
          + Nouveau role
        </button>
        <RoleForm
          selectedRole={selectedRole}
          formToggle={toggleForm}
          updateData={updateData}
          formDisplay={displayForm}
        />
        {!filterDisplay ? (
          <button
            onClick={toggleFilter}
            className="mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          >
            <svg className="mr-2" width="15" height="15" fill="none">
              <rect width="15" height="15" rx="3" fill="#ffffff" />
              <path
                d="M3 9V7H6.5V3.5H8.5V7H12.5V9H8.5V13H6.5V9H3Z"
                fill="#455a94"
              />
            </svg>
            Critère de recherche
          </button>
        ) : (
          <div className="w-full min-w-fit  rounded-md        bg-white  pb-2 shadow-component  ">
            <button
              onClick={toggleFilter}
              className=" mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
            >
              <svg className="mr-2" width="15" height="15" viewBox="0 0 15 15">
                <rect width="15" height="15" rx="3" fill="#ffffff" />
                <path d="M3 9V7H12.5V9H3Z" fill="#455a94" />
              </svg>
              Critère de recherche
            </button>

            <SearchBox
              value={searchQuery}
              onChange={handleSearch}
              label={"nom du role"}
            />
          </div>
        )}
        <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
          <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
            Aucun rôle trouvé
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <button
        className="no-underlin mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
        onClick={toggleForm}
      >
        + Nouveau role
      </button>
      <RoleForm
        selectedRole={selectedRole}
        formToggle={toggleForm}
        updateData={updateData}
        formDisplay={displayForm}
      />

      {!filterDisplay ? (
        <button
          onClick={toggleFilter}
          className="mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
        >
          <svg className="mr-2" width="15" height="15" fill="none">
            <rect width="15" height="15" rx="3" fill="#ffffff" />
            <path
              d="M3 9V7H6.5V3.5H8.5V7H12.5V9H8.5V13H6.5V9H3Z"
              fill="#455a94"
            />
          </svg>
          Critère de recherche
        </button>
      ) : (
        <div className="w-full min-w-fit  rounded-md        bg-white  pb-2 shadow-component  ">
          <button
            onClick={toggleFilter}
            className=" mr-2 mt-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          >
            <svg className="mr-2" width="15" height="15" viewBox="0 0 15 15">
              <rect width="15" height="15" rx="3" fill="#ffffff" />
              <path d="M3 9V7H12.5V9H3Z" fill="#455a94" />
            </svg>
            Critère de recherche
          </button>

          <SearchBox
            value={searchQuery}
            onChange={handleSearch}
            label={"Objet du role"}
          />
        </div>
      )}
      <div className="mt-1 flex h-fit w-full min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
        <p className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
          Liste des rôles
        </p>
        {/* <p>Nombre de résultats: {totalCount} </p> */}
        {/* <button>Génerer liste des roles</button> */}
        <div className="m-2">
          <RolesTable
            roles={filteredRoles}
            sortColumn={sortColumn}
            onSort={handleSort}
            onItemSelect={handleSelectRole}
            onItemsSelect={handleSelectRoles}
            selectedItem={selectedRole}
            selectedItems={selectedRoles}
            onEdit={selectedRole ? handleEdit : undefined}
            onDelete={
              selectedRole !== null || selectedRoles.length !== 0
                ? handleDelete
                : undefined
            }
          />
          <ReactPaginate
            breakLabel={"..."}
            nextLabel={">"}
            breakClassName={"break-me"}
            pageCount={Math.ceil(totalCount / pageSize)}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            // className="w-max-[92%] mx-3 my-auto flex  w-fit list-none justify-evenly rounded-lg bg-[#5a6b99] p-3 font-bold text-white"
            previousLabel={"<"}
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
          />
        </div>
      </div>
    </>
  );
}

export default Roles;
