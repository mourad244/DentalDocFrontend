import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { withRouter } from "react-router-dom";

import { getRdvs, saveRdv, deleteRdv } from "../../services/rdvServices";

import RdvsTable from "./rdvsTable";
import ReactPaginate from "react-paginate";

import { ReactComponent as PrecedentButton } from "../../assets/icons/precedent-btn.svg";
import { ReactComponent as SuivantButton } from "../../assets/icons/suivant-btn.svg";

import _ from "lodash";
import { toast } from "react-toastify";
import { BsPersonAdd } from "react-icons/bs";
import ClipLoader from "react-spinners/ClipLoader";

function Rdvs() {
  // const date = new Date();
  const [rdvs, setRdvs] = useState([]);
  const [time, setTime] = useState(new Date());
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [selectedRdvs, setSelectedRdvs] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filteredRdvs, setFilteredRdvs] = useState([]);
  const [sortColumn, setSortColumn] = useState({
    path: "patientId.gradeId.nom",
    order: "asc",
  });

  const [itemOffset, setItemOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 15;
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: rdvs } = await getRdvs();
      setRdvs(rdvs);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = rdvs;
    const filterRdvs = async () => {
      filtered = filtered.filter(
        (e) =>
          new Date(e.datePrevu).getFullYear() === time.getFullYear() &&
          new Date(e.datePrevu).getMonth() === time.getMonth() &&
          new Date(e.datePrevu).getDate() === time.getDate(),
      );
      const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
      const endOffset = itemOffset + pageSize;
      setFilteredRdvs(sorted.slice(itemOffset, endOffset));
      setCurrentPage(Math.ceil(sorted.length / pageSize));
    };
    filterRdvs();
    setTotalCount(filtered.length);
  }, [currentPage, itemOffset, rdvs, sortColumn.order, sortColumn.path, time]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * pageSize) % totalCount;
    setItemOffset(newOffset);
  };
  const displayDate = () => {
    return (
      time.getDate() +
      " - " +
      (time.getMonth() + 1) +
      " - " +
      time.getFullYear()
    );
  };

  const navigateDate = (operation) => {
    const periode = new Date(time.setDate(time.getDate() + operation));

    setTime(periode);
    setCurrentPage(1);
  };

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handleHonnoreChecked = (rdvId) => {
    let newRdvs = [...filteredRdvs];
    newRdvs.map(async (e, index) => {
      if (e._id === rdvId) {
        newRdvs[index].isHonnore = !newRdvs[index].isHonnore;
        await saveRdv({
          _id: e._id,
          medecinId: e.medecinId._id,
          patientId: e.patientId._id,
          datePrevu: e.datePrevu,
          isHonnore: e.isHonnore,
        });
      }
    });
    setFilteredRdvs(newRdvs);
  };
  const handleViewDetails = () => {
    setShowDetails(true);
  };
  const handleSelectRdv = (rdv) => {
    let newSelectedRdvs = [...selectedRdvs];

    const index = newSelectedRdvs.findIndex(
      (c) => c._id.toString() === rdv._id.toString(),
    );
    if (index === -1) newSelectedRdvs.push(rdv);
    else newSelectedRdvs.splice(index, 1);
    let selectedRdv = null;
    let founded = rdvs.find((p) => p._id.toString() === rdv._id.toString());
    if (founded && newSelectedRdvs.length === 1) selectedRdv = founded;
    setSelectedRdvs(newSelectedRdvs);
    setSelectedRdv(newSelectedRdvs.length === 1 ? selectedRdv : null);
  };

  const handleSelectRdvs = () => {
    let newSelectedRdvs =
      selectedRdvs.length === filteredRdvs.length ? [] : [...filteredRdvs];
    setSelectedRdvs(newSelectedRdvs);
    setSelectedRdv(newSelectedRdvs.length === 1 ? newSelectedRdvs[0] : null);
  };
  const handleEdit = () => {
    history.push(`/rdvs/${selectedRdv._id}`);
  };
  const handleDelete = async (rdv) => {
    const originalRdvs = rdvs;
    setRdvs(rdvs.filter((m) => m._id !== rdv._id));

    try {
      await deleteRdv(rdv._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("Rendez-vous déja supprimé");
      setRdvs(originalRdvs);
    }
  };
  return (
    <div className="mt-1 flex h-fit w-[100%] min-w-fit flex-col rounded-5px border border-white bg-white shadow-component ">
      <div className="m-2 mt-2 w-[100%] text-xl font-bold text-[#474a52]">
        Liste des rdvs
        {/* <h1 className="rdvs-total total-table">Total: {totalCount} patients</h1> */}
      </div>
      <div className="ml-2 flex justify-start">
        <button
          className="no-underlin mr-2 flex h-6 min-w-fit cursor-pointer list-none rounded-lg bg-[#455a94] pl-2 pr-2 pt-1 text-center text-xs font-bold text-white"
          onClick={() => {
            history.push("/ajouterrdv");
          }}
        >
          Nouveau Rendez-Vous
        </button>
      </div>
      <div className=" m-auto my-2 flex items-center rounded-md bg-[#f5f5f5] p-2 shadow-md">
        <PrecedentButton
          className="cursor-pointer"
          onClick={() => {
            navigateDate(-1);
          }}
        />
        <p className="text-md m-auto mx-3 font-bold leading-5">
          {displayDate()}
        </p>

        <SuivantButton
          onClick={() => {
            navigateDate(1);
          }}
          className="cursor-pointer"
        />
      </div>
      {loading ? (
        <div className="spinner">
          <ClipLoader loading={loading} size={70} />
        </div>
      ) : (
        <div className="m-2">
          <RdvsTable
            rdvs={filteredRdvs}
            sortColumn={sortColumn}
            onSort={handleSort}
            onCheck={handleHonnoreChecked}
            onItemSelect={handleSelectRdv}
            onItemsSelect={handleSelectRdvs}
            selectedItems={selectedRdvs}
            selectedItem={selectedRdv}
            onEdit={selectedRdv ? handleEdit : undefined}
            onDelete={
              selectedRdv !== null || selectedRdvs.length !== 0
                ? handleDelete
                : undefined
            }
            onViewDetails={selectedRdv ? handleViewDetails : undefined}
          />
          <ReactPaginate
            breakLabel={"..."}
            nextLabel={"Suivant"}
            breakClassName={"break-me"}
            pageCount={Math.ceil(totalCount / pageSize)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            previousLabel={"Précédent"}
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
          />
        </div>
      )}
    </div>
  );
}

export default withRouter(Rdvs);
