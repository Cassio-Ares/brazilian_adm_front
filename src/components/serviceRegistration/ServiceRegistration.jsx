import "./serviceRegistration.css";
import { InputAdm } from "../inputAdm/InputAdm";
import { Map } from "../map/Map";
import { useState } from "react";
import { api } from "../../apiService/ApiService";

function ServiceRegistration() {
  const [formData, setFormData] = useState({
    client: "",
    collaborator: "",
    work: "",
    whichPlaces: "",
    price: "",
    date: "",
    status: "Agendado",
  });

  const [clientEircode, setClientEircode] = useState("");
  const [collaboratorEircode, setCollaboratorEircode] = useState([]);

  const handleClientName = async (event) => {
    const client = event.target.value;
    setFormData({ ...formData, client });

    try {
      const response = await api.get(
        `/client/client?name=${encodeURIComponent(client)}`
      );

      const clientData = response.data;

      if (clientData) {
        setClientEircode(clientData.eircode);
      } else {
        setClientEircode("");
      }
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
    }
  };

  const handleCollabaratorsWork = async (event) => {
    const work = event.target.value;
    setFormData({ ...formData, work });

    console.log(work);

    try {
      const response = await api.get(
        `/collaborator/work?work=${encodeURIComponent(work)}`
      );

      const workCollaborators = response.data;

      if (workCollaborators) {
        setCollaboratorEircode(workCollaborators);
      } else {
        setCollaboratorEircode("");
      }
    } catch (error) {
      console.error("Erro ao buscar colaborador:", error.response?.data?.message || error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validação completa dos campos obrigatórios
    const validations = [
      { field: 'client', message: 'Nome do cliente é obrigatório' },
      { field: 'collaborator', message: 'Nome do colaborador é obrigatório' },
      { field: 'price', message: 'Valor do serviço é obrigatório' },
      { field: 'date', message: 'Data do serviço é obrigatória' }
    ];
  
    for (const validation of validations) {
      if (!formData[validation.field]) {
        alert(validation.message);
        return;
      }
    }
  
    // Validação do formato do preço
    const priceRegex = /^\d+([.,]\d{1,2})?$/;
    if (!priceRegex.test(formData.price)) {
      alert("Por favor, digite um valor válido (ex: 100.00 ou 100,00)");
      return;
    }
  
    // Validação da data
    const [year, month, day] = formData.date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("formData.date:", formData.date);
    console.log("selectedDate:", selectedDate.toISOString());
    console.log("today:", today.toISOString());
    
    if (selectedDate < today) {
      alert("A data do serviço não pode ser anterior a hoje");
      return;
    }
  
    try {
      console.log("Enviando dados:", formData);
      const response = await api.post("/work", formData);
  
      // Verifica se a resposta foi bem-sucedida
      if (response.status === 201) {
        // Limpar o formulário após envio bem-sucedido
        setFormData({
          client: "",
          collaborator: "",
          work: "",
          whichPlaces: "",
          price: "",
          date: "",
          status: "Agendado",
        });
  
        // Limpar os estados relacionados
        setClientEircode("");
        setCollaboratorEircode([]);
  
        alert("Serviço registrado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao registrar serviço:", error);
      
      // Tratamento específico dos erros da API
      if (error.response) {
        switch (error.response.status) {
          case 404:
            alert(error.response.data.message || "Cliente ou colaborador não encontrado");
            break;
          case 400:
            alert(error.response.data.message || "Dados inválidos. Verifique as informações");
            break;
          default:
            alert("Ocorreu um erro ao registrar o serviço. Tente novamente.");
        }
      } else {
        alert("Erro de conexão. Verifique sua internet e tente novamente.");
      }
    }
  };

  return (
    <main className="containerServiceRegister">
      <section className="form">
        <form onSubmit={handleSubmit}>
          <InputAdm
            labelText="Nome do Cliente"
            placeholder="Digite o nome completo do cliente"
            value={formData.client}
            onChange={handleClientName}
            name="client"
          />
          <div>
            <label className="labelSelect" htmlFor="work">
              Tipo de serviço
            </label>
            <select
              name="work"
              id="work"
              value={formData.work}
              onChange={handleCollabaratorsWork}
            >
              <option value="" disabled hidden>Selecione o tipo de serviço</option>
              <option value="serviço de limpeza">Serviço de limpeza</option>
              <option value="paisagismo e jardinagem">
                Paisagismo e jardinagem
              </option>
              <option value="pintura">Pintura</option>
              <option value="manicure e pedicure">Manicure e Pedicure</option>
              <option value="costura">Costura</option>
            </select>
          </div>

          <InputAdm
            labelText="Nome do Colaborador"
            placeholder="Digite o nome do colaborador"
            value={formData.collaborator}
            onChange={handleChange}
            name="collaborator"
          />
          <InputAdm
            labelText="Detalhes sobre o serviço"
            placeholder="Digite detalhes extras"
            value={formData.whichPlaces}
            onChange={handleChange}
            name="whichPlaces"
          />
          <InputAdm
            labelText="Valor do serviço contratado"
            placeholder="Digite o valor do serviço ex: 100.00"
            value={formData.price}
            onChange={handleChange}
            name="price"
          />
          <InputAdm
            labelText="Data do serviço"
            type="date"
            value={formData.date}
            onChange={handleChange}
            name="date"
          />
          <div>
            <label className="labelSelect" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Agendado">Agendado</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <button className="butttonWork">Enviar</button>
        </form>
      </section>
      <section className="containerMap">
        <Map clientEircode={clientEircode} collaboratorEircode={collaboratorEircode} />
      </section>
    </main>
  );
}

export default ServiceRegistration;