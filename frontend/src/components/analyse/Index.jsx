import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndicateursData } from "../../redux/actions/AnalyseActions";
import { Box, Button, Autocomplete, TextField } from "@mui/material";
import AccordionBox from "../AccordionBox";
import dayjs from "dayjs";
import { notyf } from "../../utils/notyf";
import MainLoader from "../loaders/MainLoader";
import DateComponent from "../DateComponent";
import DataTable from "./DataTable";
import GuageCharts from "./GuageCharts";

const textColor = (cellValue) => {
  let className = " ";
  const cell = cellValue.toLowerCase();

  if (cell.includes("achat")) {
    className = "text-[var(--text-success)]";
  } else if (cell.includes("vente")) {
    className = "text-[var(--text-warning)]";
  } else {
    className = "text-[var(--text-muted)]";
  }
  return <span className={`${className} font-semibold`}>{cellValue}</span>;
};

function Index() {
  const { data, loading, error } = useSelector((state) => state.analyse);
  const [date, setDate] = useState(dayjs());
  const [titre, setTitre] = useState("ITISSALAT AL-MAGHRIB");
  const [isShow, setIsShow] = useState(false);
  const titres = [
    "ARADEI CAPITAL",
    "DISWAY",
    "ALLIANCES",
    "SODEP-Marsa Maroc",
    "IMMORENTE INVEST",
    "IB MAROC.COM",
    "ZELLIDJA S.A",
    "TAQA MOROCCO",
    "SMI",
    "CARTIER SAADA",
    "BMCI",
    "RISMA",
    "SOCIETE DES BOISSONS DU MAROC",
    "S.M MONETIQUE",
    "AFRIQUIA GAZ",
    "SOTHEMA",
    "AUTO HALL",
    "DARI COUSPATE",
    "CTM",
    "MAGHREB OXYGENE",
    "INVOLYS",
    "CDM",
    "STOKVIS NORD AFRIQUE",
    "MICRODATA",
    "SALAFIN",
    "SANLAM MAROC",
    "DELATTRE LEVIVIER MAROC",
    "AFRIC INDUSTRIES SA",
    "LABEL VIE",
    "TGCC S.A",
    "JET CONTRACTORS",
    "AUTO NEJMA",
    "ATTIJARIWAFA BANK",
    "LESIEUR CRISTAL",
    "RES DAR SAADA",
    "MUTANDIS SCA",
    "SAMIR",
    "COSUMAR",
    "AFMA",
    "LYDEC",
    "EQDOM",
    "PROMOPHARM S.A.",
    "RESIDENCES DAR SAADA",
    "TIMAR",
    "DISTY TECHNOLOGIES",
    "FENIE BROSSETTE",
    "DIAC SALAF",
    "MAROC LEASING",
    "ALUMINIUM DU MAROC",
    "REALISATIONS MECANIQUES",
    "LAFARGEHOLCIM MAR",
    "STROC INDUSTRIE",
    "LAFARGEHOLCIM MAROC",
    "OULMES",
    "CIMENTS DU MAROC",
    "AKDITAL",
    "TOTAL MAROC",
    "MINIERE TOUISSIT",
    "BALIMA",
    "HPS",
    "ITISSALAT AL-MAGHRIB",
    "CIH",
    "BANK OF AFRICA",
    "COLORADO",
    "MED PAPER",
    "WAFA ASSURANCE",
    "MANAGEM",
    "REBAB COMPANY",
    "UNIMER",
    "BCP",
    "TOTALENERGIES MARKETING MAROC",
    "DELTA HOLDING",
    "MAGHREBAIL",
    "SONASID",
    "ATLANTASANAD",
    "DOUJA PROM ADDOHA",
    "ENNAKL",
    "M2M Group",
    "AGMA",
    "SNEP",
  ];
  const dispatch = useDispatch();
  const columnsIndi = [
    {
      field: "Nom",
      headerName: "Nom",
      width: 360,
      flex: 1.5,
      renderCell: (params) => <strong>{params.row.Nom}</strong>,
    },
    {
      field: "Valeur",
      headerName: "Valeur",
      width: 360,
      flex: 1,
      renderCell: (params) => params.row?.Valeur?.toFixed(2),
    },
    {
      field: "Type_position",
      headerName: "Type de position",
      width: 360,
      flex: 1,
      renderCell: (params) => {
        const cellValue = params.row.Type_position;
        return textColor(cellValue);
      },
    },
  ];
  const columnsMoy = [
    {
      field: "Periode",
      headerName: "Nom",
      flex: 0.5,
      renderCell: (params) => <strong>{params.row.Periode}</strong>,
    },
    {
      field: "Simple",
      headerName: "Simple",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="flex gap-2.5">
            <span>{params.row?.Simple?.toFixed(2)}</span>
            {textColor(params.row.sign_simple)}
          </div>
        );
      },
    },
    {
      field: "Exponentiel",
      headerName: "Exponentiel",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="flex gap-2.5">
            <span>{params.row?.Exponentiel?.toFixed(2)}</span>
            {textColor(params.row.sign_expo)}
          </div>
        );
      },
    },
  ];
  const handelClick = () => {
    dispatch(getIndicateursData())
      .unwrap()
      .then(() => setIsShow(true))
      .catch(() => notyf.error("Server Error"));
  };
  return (
    <Box className="w-full min-h-[400px] relative mt-[30px]">
      <AccordionBox
        detailsClass={"flex items-center flex-wrap gap-2"}
        title={"Choix du titre"}
        isExpanded={true}
      >
        <DateComponent label={"Date début"} date={date} setDate={setDate} />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={titres}
          onChange={(event, value) => setTitre(value)}
          sx={{ width: 250 }}
          value={titre}
          size="small"
          renderInput={(params) => <TextField {...params} label="Titres" />}
        />
        <Button
          variant="contained"
          size="small"
          color="primary"
          disabled={loading}
          onClick={handelClick}
        >
          Rechercher
        </Button>
      </AccordionBox>

      {loading && <MainLoader />}
      {isShow && !loading && (
        <>
          <GuageCharts data={data} />
          <DataTable
            title={"Indicateurs techniques"}
            rows={data.indecateurTech}
            columns={columnsIndi}
            resume={data.resume.indecateurTech}
            id={"indicateurs-techniques"}
          />
          <DataTable
            title={"Moyennes Mobiles"}
            rows={data.moyMobileBVC}
            columns={columnsMoy}
            id={"moyennes-mobiles"}
            resume={data.resume.moyMobileBVC}
          />
        </>
      )}
    </Box>
  );
}

export default Index;
