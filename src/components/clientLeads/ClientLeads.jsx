import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { useEffect, useState } from "react";
import { api } from "../../apiService/ApiService.js";
import "./clientLeads.css";

/**
 * "howFindCompany": "Facebook",
 * "createdAt": "2024-10-11T16:21:31.145Z",
 */

// export function valueFormatter(value) {
//   return `${value}`;
// }

const chartSetting = {
    yAxis: [
      {
        label: "Número de Leads",
      },
    ],
    width: 800,  // Aumentado ainda mais para acomodar melhor a legenda
    height: 500,  // Aumentado para manter a proporção
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-10px, 0)",
      },
    },
    legend: {
        position: { vertical: 'top', horizontal: 'left' },
        direction: 'row',
        padding: 20,
      },
      margin: { top: 150, bottom: 30, left: 60, right: 60 },
      layout: {
        paddingTop: 32,
      },
    };

const processData = (dataDB) => {
  const groupData = {};

  console.log("Oiiii", dataDB)

  dataDB.forEach((item) => {
    const month = new Date(item.createdAt).toLocaleString("default", {
      month: "short",
    });

    const workType = item.typeOfWork;
    const howFound = item.howFindCompany;

    if (!groupData[month]) {
      groupData[month] = { month };
    }

    if (!groupData[month][workType]) {
      groupData[month][workType] = {
        facebook: 0,
        instagram: 0,
        google: 0,
        indicacao: 0,
      };
    }

    // Contar quantas pessoas vieram de cada fonte para cada tipo de serviço por mês
    if (howFound === "Facebook") {
      groupData[month][workType].facebook += 1;
    } else if (howFound === "Instagram") {
      groupData[month][workType].instagram += 1;
    } else if (howFound === "Google") {
      groupData[month][workType].google += 1;
    } else if (howFound === "Indicação") {
      groupData[month][workType].indicacao += 1;
    }
  });

  // Transformar o groupData para ter um dataset simplificado
  const transformedData = Object.entries(groupData).map(([month, works]) => ({
    month,
    limpezaFacebook: works["serviço de limpeza"]?.facebook || 0,
    limpezaInstagram: works["serviço de limpeza"]?.instagram || 0,
    limpezaGoogle: works["serviço de limpeza"]?.google || 0,
    limpezaIndicacao: works["serviço de limpeza"]?.indicacao || 0,
    paisagismoFacebook: works["paisagismo e jardinagem"]?.facebook || 0,
    paisagismoInstagram: works["paisagismo e jardinagem"]?.instagram || 0,
    paisagismoGoogle: works["paisagismo e jardinagem"]?.google || 0,
    paisagismoIndicacao: works["paisagismo e jardinagem"]?.indicacao || 0,
    pinturaFacebook: works["pintura"]?.facebook || 0,
    pinturaInstagram: works["pintura"]?.instagram || 0,
    pinturaGoogle: works["pintura"]?.google || 0,
    pinturaIndicacao: works["pintura"]?.indicacao || 0,
    manicureFacebook: works["manicure e pedicure"]?.facebook || 0,
    manicureInstagram: works["manicure e pedicure"]?.instagram || 0,
    manicureGoogle: works["manicure e pedicure"]?.google || 0,
    manicureIndicacao: works["manicure e pedicure"]?.indicacao || 0,
    costuraFacebook: works["costura"]?.facebook || 0,
    costuraInstagram: works["costura"]?.instagram || 0,
    costuraGoogle: works["costura"]?.google || 0,
    costuraIndicacao: works["costura"]?.indicacao || 0,
  }));

  return transformedData;
};

export const ClientLeads = () => {
  const [dataDB, setDataDB] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getClients = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/client");
      setDataDB(response.data);
    } catch (error) {
      console.error(error);
      setError("Erro ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  useEffect(() => {
    if (dataDB.length > 0) {
      const getData = processData(dataDB);
      setData(getData);
    }
  }, [dataDB]);

  return (
    <section className="containerLeads">
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h1 className="h1">Número de leads por mês</h1>
          <BarChart
            dataset={data}
            xAxis={[{ scaleType: "band", dataKey: "month" }]}
            series={[
              { dataKey: "limpezaFacebook", label: "Limpeza - Facebook" },
              { dataKey: "limpezaInstagram", label: "Limpeza - Instagram" },
              { dataKey: "limpezaGoogle", label: "Limpeza - Google" },
              { dataKey: "limpezaIndicacao", label: "Limpeza - Indicação" },
              { dataKey: "paisagismoFacebook", label: "Paisagismo - Facebook" },
              {
                dataKey: "paisagismoInstagram",
                label: "Paisagismo - Instagram",
              },
              { dataKey: "paisagismoGoogle", label: "Paisagismo - Google" },
              {
                dataKey: "paisagismoIndicacao",
                label: "Paisagismo - Indicação",
              },
              { dataKey: "pinturaFacebook", label: "Pintura - Facebook" },
              { dataKey: "pinturaInstagram", label: "Pintura - Instagram" },
              { dataKey: "pinturaGoogle", label: "Pintura - Google" },
              { dataKey: "pinturaIndicacao", label: "Pintura - Indicação" },
              { dataKey: "manicureFacebook", label: "Manicure - Facebook" },
              { dataKey: "manicureInstagram", label: "Manicure - Instagram" },
              { dataKey: "manicureGoogle", label: "Manicure - Google" },
              { dataKey: "manicureIndicacao", label: "Manicure - Indicação" },
              { dataKey: "costuraFacebook", label: "Costura - Facebook" },
              { dataKey: "costuraInstagram", label: "Costura - Instagram" },
              { dataKey: "costuraGoogle", label: "Costura - Google" },
              { dataKey: "costuraIndicacao", label: "Costura - Indicação" },
            ]}
            {...chartSetting}
          />
        </>
      )}
    </section>
  );
};
