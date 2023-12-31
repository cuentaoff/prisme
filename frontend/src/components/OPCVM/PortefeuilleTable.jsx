import React, { useEffect, useMemo, useState } from "react";
import Table from "../Table";
import { formatNumberWithSpaces } from "../../utils/formatNumberWithSpaces";
import { Edit, Lock, Unlock } from "react-feather";
import {
  IconButton,
  Typography,
  Button,
  Box,
  Divider,
  TextField,
} from "@mui/material";
import ModalComponent from "../Modal";
import EditPoidsTitreForm from "./EditPoids/EditPoidsTitreForm";
import Actions from "./EditPoids/Actions";
import { calculateSumClassification } from "../../utils/OPCVM/helpers.js";
import EditPoidsClassification from "./EditPoids/EditPoidsClassification.jsx";
import { ajuster, calculateSumPoids } from "../../utils/Markowitz/helpers.js";
import EditPortefeuille from "../EditPortefeuille.jsx";

const calculateSum = (data, classification, field) => {
  // Filter the data based on the provided Classification
  const filteredData = data.filter(
    (item) => item.Classification === classification
  );

  // Calculate the sum and count of the specified field values
  const result = filteredData.reduce(
    (accumulator, currentItem) => {
      return {
        sum: accumulator.sum + currentItem[field],
        count: accumulator.count + 1,
      };
    },
    { sum: 0, count: 0 }
  );

  return result;
};

const updatePoids = (setState, titreToUpdate, newData, field) => {
  setState((prevData) => {
    return prevData.map((item) => {
      const { sum, count } = calculateSum(prevData, item.Classification, field);
      if (item.titre === titreToUpdate) {
        console.log("new data", newData);
        return { ...item, ...newData };
      }
      console.log(item);
      return { ...item, [field]: (sum - newData[field]) / count };
    });
  });
};

// const EditPoisForm = ({ poids, setPoids, reset, titre, handleUpdate }) => {
//   return (
//     <>
//       <Box>
//         <Typography variant="h6" mb={3}>
//           {`
//             Modifier poids ( ${titre} )
//           `}
//         </Typography>
//       </Box>
//       <Divider />
//       <Box
//         sx={{
//           height: "250px",
//           width: "400px",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//           mt: 3,
//         }}
//       >
//         <TextField
//           id="poids"
//           label="Poids (%)"
//           type="number"
//           InputLabelProps={{
//             shrink: true,
//           }}
//           variant="outlined"
//           autoFocus
//           value={poids}
//           onChange={(e) => setPoids(e.target.value)}
//         />
//         <Box
//           sx={{
//             alignSelf: "end",
//           }}
//         >
//           <Button
//             variant="contained"
//             color="error"
//             sx={{
//               margin: "0 10px",
//             }}
//             onClick={reset}
//           >
//             Annuler
//           </Button>
//           <Button
//             variant="contained"
//             onClick={() => {
//               // handleUpdate();
//               reset();
//             }}
//             disabled={!poids}
//           >
//             Enregistrer
//           </Button>
//         </Box>
//       </Box>
//     </>
//   );
// };

const PortefeuilleTable = ({ rows, field, showActions }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [poids, setPoids] = useState(null);
  const [newRows, setNewRows] = useState(rows);
  const [newTitre, setNewTitre] = useState("");
  const reset = () => {
    setOpen(false);
    setPoids(null);
  };
  useEffect(() => {
    console.log("new rows", newRows);
  }, [newRows]);
  const update = () => {
    const { Classification } = rows.find((row) => row.titre === newTitre);
    const sameSecteur = rows
      .filter(
        (row) => row.Classification === Classification && row.titre !== newTitre
      )
      .map((item) => item.titre);
    const { sum } = calculateSumClassification(newRows, Classification, field);
    const part = (sum - +poids) / sameSecteur.length;
    setNewRows((prevData) =>
      prevData.map((item) => {
        if (item.titre === newTitre) {
          return { ...item, [field]: +poids, isLocked: true };
        }
        return { ...item };
      })
    );
    reset();
  };
  const handleLock = (titre, isLocked) => {
    setNewRows((prevData) =>
      prevData.map((item) => {
        if (item.titre === titre) {
          return { ...item, isLocked: !isLocked };
        }
        return { ...item };
      })
    );
  };
  const columns = useMemo(() => {
    const basedColumns = [
      {
        field: "Societe_Gestion",
        headerName: "Société de Gestion",
        flex: 0.6,
        renderCell: (params) => <strong>{params.row.Societe_Gestion}</strong>,
      },
      {
        field: "Classification",
        headerName: "Classification",
        flex: 0.4,
        renderCell: (params) => <strong>{params.row.Classification}</strong>,
      },
      {
        field: "titre",
        headerName: "Titre",
        flex: 0.7,
        renderCell: (params) => <strong>{params.row.titre}</strong>,
      },
      {
        field: field,
        headerName: "Poids (%)",
        flex: 0.3,
        renderCell: (params) => {
          const val = params.row?.[field]?.toFixed(2);
          return (
            <span className="font-semibold">{formatNumberWithSpaces(val)}</span>
          );
        },
      },
    ];
    if (showActions) {
      basedColumns.push({
        field: "actions",
        headerName: "Actions",
        flex: 0.3,
        renderCell: (params) => (
          <Actions
            params={params}
            rows={rows}
            setOpen={setOpen}
            setOpenEdit={setOpenEdit}
            setNewTitre={setNewTitre}
            setPoids={setPoids}
            handleLock={handleLock}
            field={field}
          />
        ),
      });
    }
    return basedColumns;
  }, [rows, field, showActions]);
  console.log("Columns", columns);
  return (
    <>
      {showActions && (
        <EditPortefeuille
          oldRows={rows}
          newRows={newRows}
          setNewRows={setNewRows}
          field={field}
        />
      )}
      <Table columns={columns} rows={newRows} pageSize={25} />
      <ModalComponent open={open} handleClose={reset}>
        <EditPoidsTitreForm
          poids={poids}
          setPoids={setPoids}
          reset={reset}
          titre={newTitre}
          handleUpdate={update}
          rows={newRows}
          field={field}
        />
      </ModalComponent>
      <ModalComponent open={openEdit} handleClose={() => setOpenEdit(false)}>
        <EditPoidsClassification
          titre={newTitre}
          poids={poids}
          reset={() => setOpenEdit(false)}
          rows={newRows}
          field={field}
          setNewRows={setNewRows}
        />
      </ModalComponent>
    </>
  );
};

export default PortefeuilleTable;
