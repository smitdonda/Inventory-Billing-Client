import React from "react";
import MaterialTable from "material-table";
import tableIcons from "./MaterialTableIcons";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";

function MaterialDataTable({
  title = "",
  data = [],
  columns = [],
  loading = false,
  setSate = [],
  handleGetData,
  detailPanel = [],
}) {
  const defaultMaterialTheme = createTheme();
  return (
    <ThemeProvider theme={defaultMaterialTheme}>
      <MaterialTable
        title={title}
        columns={columns}
        data={data}
        isLoading={loading}
        options={{
          search: true,
          filtering: false,
          sorting: true,
          headerStyle: {
            fontSize: "1rem",
            fontWeight: "700",
          },
          rowStyle: {
            fontSize: "1rem",
            fontWeight: "400",
          },
        }}
        icons={tableIcons}
        actions={[
          {
            icon: "refresh",
            tooltip: "Refresh Table",
            isFreeAction: true,
            onClick: () => {
              setSate([]);
              handleGetData();
            },
          },
        ]}
        detailPanel={detailPanel}
      />
    </ThemeProvider>
  );
}

export default MaterialDataTable;
