import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { memo } from "react";
import { Save } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { savePortefeuille } from "../redux/actions/UserActions";
import { notyf } from "../utils/notyf";
import ModalComponent from "./Modal";
import { filterByPtf } from "../utils/filterByPtf";
import { extractPtfKeys } from "../utils/extractPtfKeys";

const SavePortefeuille = ({ data, type, field, saveAll }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [choice, setChoice] = useState("single");
  console.log("saveAll", saveAll);
  const { params } =
    type === "OPCVM"
      ? useSelector((state) => state.opcvm)
      : useSelector((state) => state.rapport);
  const dispatch = useDispatch();
  const handleSave = () => {
    console.log("Title", title);
    console.log("params", params);
    console.log("choice", choice);
    const isPtf = field.startsWith("ptf");
    let ptfs = [];
    if (choice === "all") {
      const fields = extractPtfKeys(data);
      const portefeuilles = [];
      fields.forEach((field, index) => {
        const ptf = {
          name: `${title.trim()} ${index + 1}`,
          type,
          field,
          params,
          data: isPtf ? filterByPtf(data, field) : data,
        };
        portefeuilles.push(ptf);
      });
      ptfs.push(...portefeuilles);
    } else {
      const portefeuille = {
        name: title.trim(),
        type,
        field,
        params,
        data: isPtf ? filterByPtf(data, field) : data,
      };
      ptfs.push(portefeuille);
    }
    console.log("ptsf res", ptfs);
    dispatch(savePortefeuille({ portefeuille: ptfs }))
      .unwrap()
      .then(({ message }) => {
        reset();
        notyf.success(message);
      })
      .catch((error) => notyf.error(error));
  };
  const reset = () => {
    setOpen(false);
    setTitle("");
  };
  return (
    <>
      <Box className="p-3 flex flex-wrap">
        <Button
          onClick={() => {
            setOpen(true);
            setChoice("single");
          }}
          variant="contained"
          size="small"
          className="mr-2"
        >
          <span className="mr-2">Enregistrer</span>
          <Save size={18} />
        </Button>
        {saveAll && (
          <Button
            onClick={() => {
              setOpen(true);
              setChoice("all");
            }}
            variant="contained"
            color="success"
            size="small"
          >
            <span className="mr-2">Enregistrer Tous</span>
            <Save size={18} />
          </Button>
        )}
      </Box>

      <ModalComponent open={open} handleClose={reset}>
        <Box>
          <Typography variant="h6" mb={3}>
            Enregister{" "}
            {choice === "all" ? "des portefeuilles" : "un portefeuille"}
          </Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            height: "250px",
            width: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            mt: 3,
          }}
        >
          <TextField
            id="portefeuille-titre"
            label="Titre du portefeuille"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            autoFocus
          />
          <Box
            sx={{
              alignSelf: "end",
            }}
          >
            <Button
              variant="contained"
              color="error"
              sx={{
                margin: "0 10px",
              }}
              onClick={reset}
            >
              Annuler
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={!title}>
              Enregistrer
            </Button>
          </Box>
        </Box>
      </ModalComponent>
    </>
  );
};

export default memo(SavePortefeuille);
