import {
  Box,
  Button,
  Checkbox,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import groupBy from "../../utils/groupBy";
import AccordionBox from "../AccordionBox";
import ChartPreview from "./ChartPreview";
import Heatmap from "../charts/Heatmap";
import UniversB100 from "./UniversB100";
import MainLoader from "../loaders/MainLoader";
import { getChartData, getMatriceCorr } from "../../redux/actions/OpcvmActions";
import { notyf } from "../../utils/notyf";
import ChartContainer from "../ChartContainer";
import filterDataSet from "../../utils/filterDataSet";
import { setFilteredDataSet } from "../../redux/slices/OpcvmSlice";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function Univers({ dateDebut, dateFin, setContraintesOp }) {
  const {
    data: { libelles },
    dataSet,
    matriceCorr,
  } = useSelector((state) => state.opcvm);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState(libelles);

  const [right, setRight] = useState([]);
  const [leftSearchTerm, setLeftSearchTerm] = useState("");
  const [rightSearchTerm, setRightSearchTerm] = useState("");

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const [chartData, setChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (checked.length > 0) {
      dispatch(getChartData({ dateDebut, dateFin, libelles: checked }))
        .unwrap()
        .then(({ data }) => {
          console.log("ChartData", data);
          const groupData = groupBy(data, "DENOMINATION_OPCVM");
          console.log("group data", groupData);
          setChartData(groupData);
          setShowChart(true);
        })
        .catch((rejectedValue) => {
          notyf.error(rejectedValue);
        });
    } else {
      setShowChart(false);
    }
  }, [checked]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  useEffect(() => {
    setContraintesOp(right.sort());
    const newDataSet = filterDataSet(dataSet.data, right);
    dispatch(setFilteredDataSet(newDataSet));
  }, [right]);

  useEffect(() => {
    setRight([]);
    setLeft(libelles);
  }, [libelles]);

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const filteredLeft = left.filter(
    (value) =>
      value.includes(leftSearchTerm) ||
      value.toLowerCase().includes(leftSearchTerm.toLowerCase())
  );

  const filteredRight = right.filter(
    (value) =>
      value.includes(rightSearchTerm) ||
      value.toLowerCase().includes(rightSearchTerm.toLowerCase())
  );

  const customList = (items, searchSetter) => (
    <Paper sx={{ width: 210, height: 350, overflow: "auto" }}>
      <TextField
        label="Rechercher"
        value={
          searchSetter === setLeftSearchTerm ? leftSearchTerm : rightSearchTerm
        }
        size="small"
        onChange={(e) => searchSetter(e.target.value)}
        sx={{ margin: "7px" }}
      />
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

  const getMatrice = () => {
    setIsLoading(true);
    dispatch(getMatriceCorr())
      .then(() => {
        setIsLoading(false);
        setShowHeatmap(true);
      })
      .catch(() => setShowHeatmap(false));
  };

  return (
    <>
      <AccordionBox title={"Selection de l'univers"}>
        <Box>
          <Grid className="flex flex-wrap items-center gap-2.5 self-start">
            <Grid item>{customList(filteredLeft, setLeftSearchTerm)}</Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleAllRight}
                  disabled={left.length === 0}
                  aria-label="move all right"
                >
                  ≫
                </Button>
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedRight}
                  disabled={leftChecked.length === 0}
                  aria-label="move selected right"
                >
                  &gt;
                </Button>
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedLeft}
                  disabled={rightChecked.length === 0}
                  aria-label="move selected left"
                >
                  &lt;
                </Button>
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleAllLeft}
                  disabled={right.length === 0}
                  aria-label="move all left"
                >
                  ≪
                </Button>
              </Grid>
            </Grid>
            <Grid item>{customList(filteredRight, setRightSearchTerm)}</Grid>
          </Grid>
        </Box>
        {showChart && (
          <ChartContainer width={400}>
            <ChartPreview data={chartData} />
            <UniversB100
              data={chartData}
              dateDebut={dateDebut}
              dateFin={dateFin}
            />
          </ChartContainer>
        )}
        <Box className="max-w-[400px] mx-auto mt-10">
          <Button
            variant="contained"
            size="small"
            color="primary"
            className="w-full"
            onClick={getMatrice}
          >
            {isLoading ? "Veuillez patienter..." : "Valider"}
          </Button>
        </Box>
      </AccordionBox>
      {isLoading && <MainLoader />}
      {!isLoading && showHeatmap && matriceCorr.data.length > 0 && (
        <AccordionBox
          title={"Matrice Correlation Covariance"}
          isExpanded={true}
        >
          <Heatmap data={matriceCorr.data} />
        </AccordionBox>
      )}
    </>
  );
}
