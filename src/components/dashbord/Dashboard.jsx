import { useEffect, useState } from "react";
import {  PieChartMonth } from "../graphics/pieChart/PieChartMonth";
import { ProfitPerAreaPerMonth } from "../graphics/profitPreAreaPerMonth/ProfitPerAreaPerMonth";
import { ListDayWorks } from "../listsDayWorks/ListDayWorks";
import "./Dashboard.css";
import {api} from "../../apiService/ApiService";

function Dashboard() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 
  const getData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/work");
      setData(response.data);
    } catch (error) {
      setError(error.response?.data.message || "Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const workDataProft = data?.map((item) => ({
     work: item.work,
     price: item.price,
     date: item.date //  new Date(item.date).toLocaleDateString('pt-BR'),
  })) ?? []


  const workDataPie = data?.map((item)=>({
    work: item.work,
    date: new Date(item.date).toLocaleDateString('pt-BR'),
  }))

  return (
    <section className="dashboardContainer">
      {loading && <div>Carregando....</div>}

      {error && (
        <div>{Error}</div> // to do ajustar alerts
      )}

      {!loading &&  !error &&(
          <div className="chartsContent">
            <ProfitPerAreaPerMonth dataDB = {workDataProft} />
            <PieChartMonth dataDB = {workDataPie} />
          </div>
        )}

      <ListDayWorks />
    </section>
  );
}

export default Dashboard;
