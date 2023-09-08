import React from "react";
import { MaterialReactTable } from "material-react-table";

const MaterialTable = ({
  data = [],
  columns = [],
  loading = false,
  renderRowActions,
}) => {
  const tablePaperProps = {
    sx: {
      borderRadius: "0.6rem",
      paddingLeft: "1.4rem",
      paddingRight: "1.4rem",
    },
  };

  const searchTextFieldProps = {
    showFirstButton: false,
    sx: {
      paddingTop: "1.2rem",
      minWidth: "22rem",
    },
    placeholder: `Search`,
    variant: "outlined",
  };

  const paginationProps = {
    rowsPerPageOptions: [4, 10, 20],
    showFirstButton: true,
    showLastButton: true,
  };

  const initialState = {
    pagination: { pageSize: 4 },
    density: "spacious",
    showGlobalFilter: true,
  };

  const muiTableContainerProps = { sx: { maxHeight: "auto" } };

  return (
    <MaterialReactTable
      muiTablePaperProps={tablePaperProps}
      muiTableContainerProps={muiTableContainerProps}
      enableStickyHeader={false}
      columns={columns}
      data={data}
      state={{ showSkeletons: loading }}
      positionGlobalFilter="left"
      muiSearchTextFieldProps={searchTextFieldProps}
      enableRowActions={true}
      positionActionsColumn="last"
      renderRowActions={renderRowActions}
      enablePagination={true}
      muiTablePaginationProps={paginationProps}
      enableDensityToggle={false}
      enableFullScreenToggle={false}
      initialState={initialState}
      enableColumnResizing={true}
      enableColumnOrdering={false}
      enableHiding={false}
      columnResizeMode="onEnd"
      enableColumnFilters={true}
      enableColumnFilterModes={true}
      enableColumnActions={false}
    />
  );
};

export default MaterialTable;
