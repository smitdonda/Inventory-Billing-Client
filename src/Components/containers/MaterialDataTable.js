import React from "react";
import MaterialTable from "material-table";
import tableIcons from "./MaterialTableIcons";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";

const styles = {
  borderRadius: "0.5rem",
};

function MaterialDataTable({
  title = "",
  data = [],
  columns = [],
  loading = false,
  setState = [],
  handleGetData,
  detailPanel = [],
  pageSize = 5,
  pageSizeOptions = [5, 10, 20],
}) {
  const defaultMaterialTheme = createTheme();
  return (
    <ThemeProvider theme={defaultMaterialTheme}>
      <MaterialTable
        style={styles}
        title={title}
        columns={columns}
        data={data}
        isLoading={loading}
        onRowsPerPageChange={(val) => {
          console.log(val);
        }}
        options={{
          search: true,
          filtering: false,
          sorting: true,
          pageSize: pageSize,
          pageSizeOptions: pageSizeOptions,
          headerStyle: {
            zIndex: 0,
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
              setState([]);
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
