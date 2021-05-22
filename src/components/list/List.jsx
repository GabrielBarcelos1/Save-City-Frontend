import { useEffect, useState } from "react";
import {
  MajorContainer,
  ContainerLeft,
  ContainerRight,
  H1ContainerLeft,
  TextContainerLeft,
  ButtonContainerLeft,
  MinorContainerRight,
  H1List,
  ContainerIconLogout,
  MinorContainerIconLogout,
  ButtonContainerMobile,
} from "./style";
import {
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";
import { api } from "../../services/api";
import { Link, useHistory } from "react-router-dom";
import { Table } from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiLogoutBoxLine } from "react-icons/ri";
import { Circles } from 'react-loading-icons'


function List() {
  const notify = () =>
    toast.error("item deleted successfully!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  const options = [
    { key: 1, text: "Name", value: 1 },
    { key: 2, text: "Cpf", value: 2 },
    { key: 3, text: "Email", value: 3 },
    { key: 4, text: "City", value: 4 },
  ];
  const history = useHistory();
  const [arrayItens, SetarrayItens] = useState([]);
  const [startUrl, setStartUrl] = useState(0);
  const [endtUrl, setEndUrl] = useState(5);
  const [valueSearch, setValueSearch] = useState("");
  const [refreshSearch, setRefreshSearch] = useState(false);
  const [valueSort, setValueSort] = useState("");
  useEffect(() => {
    async function pickClients() {
      setRefreshSearch(false);
      // const { data } = await fakeapi.get(
      //   `/clientes?${
      //     valueSearch !== "" ? "q=" + valueSearch + "&_" : "_"
      //   }start=${startUrl}&_end=${endtUrl}&_sort=${valueSort}`
      // );
      const { data } = await api.get(`/profile`, {
        headers: {
          'Authorization': localStorage.getItem("id")
        }});

      SetarrayItens(data);
    }
    pickClients();
  }, [startUrl, endtUrl, refreshSearch, valueSort]);

  function PaginationNext() {
    if (arrayItens.length >= 5) {
      setStartUrl((prevState) => prevState + 5);
      setEndUrl((prevState) => prevState + 5);
    }
  }
  function PaginationBack() {
    if (startUrl > 0) {
      setStartUrl((prevState) => prevState - 5);
      setEndUrl((prevState) => prevState - 5);
    }
  }
  function searchItens() {
    setStartUrl(0);
    setEndUrl(5);
    setRefreshSearch(true);
  }
  async function deleteItem(id) {
    try{
      await api.delete(`/incidents/${id}`,{
        headers: {
          'Authorization': localStorage.getItem('id')
        }});
        setRefreshSearch(true);
        notify();
    }catch(err){
      console.log(err)
    }
   
  }
  function changeOption(value) {
    switch (value) {
      case "Name":
        setValueSort("nome");
        break;
      case "Cpf":
        setValueSort("cpf");
        break;
      case "Email":
        setValueSort("email");
        break;
      case "City":
        setValueSort("endereco.cidade");
        break;
      default:
        setValueSort("");
    }
  }

  return (
    <MajorContainer>
      {console.log(`arrayItens`, arrayItens)}
      <ContainerLeft>
        <H1ContainerLeft>Ajude sua cidade</H1ContainerLeft>
        <TextContainerLeft>
        Ajude sua cidade adicionando sugestões de melhorias em uma 
        conexão direta com a prefeitura
        </TextContainerLeft>
        <Link to="/add">
          <ButtonContainerLeft>Ajude agora</ButtonContainerLeft>
        </Link>
      </ContainerLeft>
      <ContainerRight>
        <ContainerIconLogout>
          <Link to="/" onClick={() => localStorage.clear()}>
            <MinorContainerIconLogout>
              <RiLogoutBoxLine size={25} color="#58AF9C" /> Sair
            </MinorContainerIconLogout>
          </Link>
          <Link to="/add">
            <ButtonContainerMobile>Ajude agora</ButtonContainerMobile>
          </Link>
        </ContainerIconLogout>
        <MinorContainerRight>
          <H1List>Sugestões adicionadas</H1List>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Titulo</Table.HeaderCell>
                <Table.HeaderCell>Descrição</Table.HeaderCell>
                <Table.HeaderCell>Cidade</Table.HeaderCell>
                <Table.HeaderCell>CEP</Table.HeaderCell>
                <Table.HeaderCell colSpan="2"></Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {arrayItens &&
                arrayItens.map((item) => {
                  return (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.title.length>20 ? item.title.substr(0,20)+ "..." : item.title}</Table.Cell>
                      <Table.Cell>{item.description.length>20 ? item.description.substr(0,20)+ "..." : item.description}</Table.Cell>
                      <Table.Cell>{item.city.length>20 ? item.city.substr(0,20)+ "..." : item.city}</Table.Cell>
                      <Table.Cell>{item.cep.length>20 ? item.cep.substr(0,20)+ "..." : item.cep}</Table.Cell>

                      <Table.Cell
                        onClick={() => history.push(`/edit/${item.id}`)}
                      >
                        <AiOutlineEdit size={22} color="#58AF9C" />
                      </Table.Cell>

                      <Table.Cell onClick={() => deleteItem(item.id)} loading>
                        <AiOutlineDelete size={22} color="red" />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
            {/* <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="6">
                  <Menu floated="left" pagination>
                    <MenuSearchContainer>
                      <Menu.Item>
                        <InputSearch
                          value={valueSearch}
                          placeholder="Search Itens"
                          onChange={(e) => {
                            setValueSearch(e.target.value);
                          }}
                        />
                      </Menu.Item>
                      <Menu.Item as="a" icon onClick={() => searchItens()}>
                        <AiOutlineSearch size={22} color="#58AF9C" />
                      </Menu.Item>
                    </MenuSearchContainer>
                    <MenuOptionsContainer>
                      <Menu.Item>
                        <Dropdown
                          clearable
                          options={options}
                          selection
                          placeholder="Order By:"
                          onChange={(data) => {
                            changeOption(data.target.outerText);
                            searchItens();
                          }}
                        />
                      </Menu.Item>
                    </MenuOptionsContainer>
                  </Menu>

                  <Menu floated="right" pagination>
                    <Menu.Item as="a" icon onClick={() => PaginationBack()}>
                      <Icon name="chevron left" />
                    </Menu.Item>
                    <Menu.Item as="a" icon onClick={() => PaginationNext()}>
                      <Icon name="chevron right" />
                    </Menu.Item>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer> */}
          </Table>
        </MinorContainerRight>
      </ContainerRight>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
      />
    </MajorContainer>
  );
}

export default List;
