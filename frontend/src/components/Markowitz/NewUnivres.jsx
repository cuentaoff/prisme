import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { Box, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  Matrice_correlation_Covariance,
  getChartData,
  getDataSet,
} from "../../redux/actions/DataActions";
import AccordionBox from "../AccordionBox";
import ChartPreview from "../charts/ChartPreview";
import Heatmap from "../charts/Heatmap";
import UniversB100 from "../charts/UniversB100";
import MainLoader from "../loaders/MainLoader";
import ChartContainer from "../ChartContainer";
import groupBy from "../../utils/groupBy";
import EChartsPreview from "../Test/EchartPreview";
import NewUniversB100 from "../charts/NewUniversB100";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function NewUnivers({
  dateDebut,
  dateFin,
  setContraintesOptimisation,
}) {
  const { valeurs, matriceCorrelation, dataSet } = useSelector(
    (state) => state.rapport
  );
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState(valeurs);
  const [right, setRight] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const dispatch = useDispatch();
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  const [leftSearchTerm, setLeftSearchTerm] = useState("");
  const [rightSearchTerm, setRightSearchTerm] = useState("");

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

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
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
  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };
  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };
  useEffect(() => {
    if (checked.length > 0) {
      dispatch(getChartData({ dateDebut, dateFin, valeurs: checked }))
        .unwrap()
        .then(({ data }) => {
          const groupData = groupBy(data, "VALEUR");
          console.log("group data", groupData);
          setChartData(groupData);
          setShowChart(true);
        })
        .catch((rejectedValue) => {
          console.log("univers", rejectedValue);
          if (rejectedValue.status) {
            dispatch(logout());
          }
        });
    } else {
      setShowChart(false);
    }
  }, [checked]);
  useEffect(() => {
    setContraintesOptimisation(right);
  }, [right]);

  useEffect(() => {
    setRight([]);
    setLeft(valeurs);
  }, [valeurs]);
  const getMatrice_correlation_Covariance = () => {
    setIsLoading(true);
    dispatch(getDataSet({ dateDebut, dateFin, valeurs: right }))
      .then(() => dispatch(Matrice_correlation_Covariance()))
      .then(() => {
        setIsLoading(false);
        setShowHeatmap(true);
      })
      .catch(() => setShowHeatmap(false));
  };
  const customList = (title, items, searchSetter) => (
    <Card sx={{ width: "300px" }}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} choisi`}
      />
      <TextField
        label="Rechercher"
        value={
          searchSetter === setLeftSearchTerm ? leftSearchTerm : rightSearchTerm
        }
        size="small"
        onChange={(e) => searchSetter(e.target.value)}
        sx={{ margin: "7px" }}
      />
      <Divider />
      <List
        sx={{
          maxWidth: "300px",
          height: 350,
          overflow: "auto",
          bgcolor: "background.paper",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

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
    </Card>
  );

  return (
    <>
      <AccordionBox title={"Selection de l'univers"}>
        <Grid className="flex flex-wrap items-center gap-2.5 self-start">
          <Grid item>
            {customList("Choisi", filteredLeft, setLeftSearchTerm)}
          </Grid>
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
          <Grid item>
            {customList("Choisi", filteredRight, setRightSearchTerm)}
          </Grid>
        </Grid>
        {showChart && (
          <ChartContainer width={400}>
            {/* <ChartPreview data={chartData} /> */}
            <EChartsPreview data={chartData} />
            <NewUniversB100
              data={chartData}
              dateDebut={dateDebut}
              dateFin={dateFin}
            />
            {/* <UniversB100
              data={chartData}
              dateDebut={dateDebut}
              dateFin={dateFin}
            /> */}
          </ChartContainer>
        )}
        <Box className="max-w-[400px] mx-auto mt-10">
          <Button
            variant="contained"
            size="small"
            color="primary"
            className="w-full"
            disabled={isLoading || right.length < 1}
            onClick={getMatrice_correlation_Covariance}
          >
            {isLoading ? "Veuillez patienter..." : "Valider"}
          </Button>
        </Box>
      </AccordionBox>
      {isLoading && <MainLoader />}
      {!isLoading && showHeatmap && matriceCorrelation.data.length > 0 && (
        <AccordionBox
          title={"Matrice Correlation Covariance"}
          isExpanded={true}
        >
          <Heatmap data={matriceCorrelation.data} />
        </AccordionBox>
      )}
    </>
  );
}
