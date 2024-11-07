import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import { api } from "../../apiService/ApiService.js";
import "./clientList.css";

export const ClientList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const columns = [
    { id: "name", label: "Cliente", minWidth: 170 },
    { id: "phone", label: "Telefone", minWidth: 170 },
    { id: "eircode", label: "Eircode", minWidth: 100 },
    { id: "typeOfWork", label: "Primeiro serviço", minWidth: 200 },
    { id: "particularities", label: "Detalhes extras", minWidth: 200 },
    { id: "createdAt", label: "Data do primeiro serviço", minWidth: 200, format: (value)=> new Date(value).toLocaleDateString('pt-BR')},
  ];

  const getClients = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await api.get('/client');
      setData(response.data);
    } catch (error) {
      console.error(error);
      setError("Erro ao buscar os serviços do dia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };



  console.log(data)

  return (
    <section className="listContainer">
      <h3>Lista de Clientes</h3>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        {loading && <LinearProgress />}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {data.length === 0 && !loading && !error && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Nenhum serviço encontrado para hoje.
          </Alert>
        )}
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align="center">
                          {column.format ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
        />
      </Paper>
    </section>
  );
};
