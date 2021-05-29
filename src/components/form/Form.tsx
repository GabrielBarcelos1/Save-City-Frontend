import React, { useState, useEffect,useRef } from "react";
import {
  MajorContainer,
  ContainerForm,
  H1Form,
  ContainerLeft,
  MinorContainerLeft,
  H1ContainerRight,
  ContainerRight,
  TextContainerRight,
  ButtonContainerRight,
  ButtonContainerLeft,
  ContainerIconLogout,
  MinorContainerIconLogout,
  ButtonContainerMobile,
} from "./style";
import { Form, Dropdown} from "semantic-ui-react";
import InputMask from "react-input-mask";
import { viacep, api } from "../../services/api";
import { Link, RouteComponentProps, useHistory } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type TParams = { id: string };
function AddItem({ match }: RouteComponentProps<TParams>) {
  const dropDownOptions = [
    {
      key: 'casan',
      text: 'Água ou esgoto',
      value: 'casan',
    },
    {
      key: 'celesc',
      text: 'Eletrecidade',
      value: 'celesc',
    },
    {
      key: 'comcap',
      text: 'Lixo na cidade',
      value: 'comcap',
    },
    {
      key: 'nenhum',
      text: 'Nenhuma das alternativas',
      value: 'nenhum',
    },
  ]

  const history = useHistory();
  const [valueTitle, setValueTitle] = useState("");
  const [valueCep, setValueCep] = useState("");
  const [valueDescription, setValueDescription] = useState("");
  const [valueStreet, setValueStreet] = useState("");
  const [valueCity, setValueCity] = useState("");
  const [valueDistrict, setValueDistrict] = useState("");
  const [valueNum, setValueNum] = useState("");
  const [valueType, setValueType] = useState("");
  const [ErrorCep, setErroCep] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await api.get(`/incident/${match?.params?.id}`,{
          headers: {
            'Authorization': localStorage.getItem("id")
          }});
        console.log(data)
        setValueTitle(data.title);
        setValueCep(data.cep);
        setValueDescription(data.description);
        setValueStreet(data.street);
        setValueCity(data.city);
        setValueDistrict(data.district);
        setValueNum(data.number);
        setValueType(data.type)
      } catch (err) {}
    }
    getData();
  }, []);
  async function validateCep(value: string) {
    setValueCep(value);
    if (value.endsWith("_")) {
    } else {
      let cepParsed = parseValue(value);
      try{
        const { data } = await viacep.get(`/${cepParsed}/json/`);
        setValueStreet(data.logradouro);
        setValueCity(data.localidade);
        setValueDistrict(data.bairro);

        data.logradouro&&inputRef.current?.focus()
    
    }catch(err){
      console.error(err)
    }

      
    }
  }
  async function addInfosToDb() {
    if (
      !valueCep.endsWith("_") &&
      verifyCepAndCpf()
    ) {
      let cepParsed = parseValue(valueCep);
      let incidentToAdd = {
        title: valueTitle,
        description: valueDescription,
        type: valueType,
        cep: cepParsed,
        city: valueCity,
        street: valueStreet,
        district: valueDistrict,
        number: valueNum,

      };

      try{
        setLoadingButton(true)
        console.log(`incidentToAdd`, incidentToAdd)
        await api.post("/incidents", incidentToAdd, {
          headers: {
            'Authorization': localStorage.getItem('id')
          }} );
          setLoadingButton(false)
          history.push('/list')
      }catch(err){
          setLoadingButton(false)
      }
     
    }
  }
  async function editInfosDb() {
    if (
      !valueCep.endsWith("_") &&
      verifyCepAndCpf()
    ) {
      let cepParsed = parseValue(valueCep);
      const incidentToEdit = {
        title: valueTitle,
        type: valueType,
        description: valueDescription,
        cep: cepParsed,
        city: valueCity,
        street: valueStreet,
        district: valueDistrict,
        number: valueNum,
        }
      try{
        setLoadingButton(true)
        await api.put(`/incident/${match?.params?.id}`,incidentToEdit,{
          headers: {
            'Authorization': localStorage.getItem("id")
          }});
          setLoadingButton(false)
          history.push("/list")
      }catch(err){
        setLoadingButton(false)
      }
    }
  }
  function parseValue(cep: string) {
    let NumberParsed = cep.split(".").join("");
    return (NumberParsed = NumberParsed.replace("-", ""));
  }
  function verifyCepAndCpf() {
    if (valueCep.endsWith("_")) {
      setErroCep(true);
      return false;
    }
    return true;
  }
  function handleChangeDropdownType(value:any, _:any){
    setValueType(_.value)
  }

  return (
    <MajorContainer>
      <ContainerLeft>
        <ContainerIconLogout>
          <Link to="/" onClick={() => localStorage.clear()}>
            <MinorContainerIconLogout>
              <RiLogoutBoxLine size={25} color="#58AF9C" /> Sair
            </MinorContainerIconLogout>
          </Link>
          <Link to="/list">
            <ButtonContainerMobile>Veja a lista</ButtonContainerMobile>
          </Link>
        </ContainerIconLogout>

        <MinorContainerLeft>
          <ContainerForm>
            <H1Form>Registre sua sugestão</H1Form>
            <Form
              onSubmit={() =>
                !match?.params?.id ? addInfosToDb() : editInfosDb()
              }
            >
              <Form.Group widths="equal">
                <Form.Field required >
                  <label>Titulo</label>
                  <input
                    data-testid="inputName"
                    placeholder="Titulo"
                    value={valueTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setValueTitle(e.target.value)
                    }
                  ></input>
                </Form.Field>
                <Form.Field 
                  control={Dropdown}
                  placeholder="Tipo"
                  fluid
                  selection
                  options={dropDownOptions}
                  label="O seu problema tem a ver com:"
                  required
                  value={valueType}
                  onChange={handleChangeDropdownType}
                >
                </Form.Field>
              </Form.Group>
           

              
              <Form.Field required>
                <label>Descrição</label>
                <textarea 
                  data-testid="inputEmail"
                  placeholder="Escreva uma descrição de até 500 caracteres"
                  required
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setValueDescription(e.target.value)
                  }
                  value={valueDescription}
                  maxLength={700}
                ></textarea >
              </Form.Field>
              <Form.Group widths="equal">
                <InputMask
                  mask="99.999-999"
                  value={valueCep}
                  onChange={(e) => validateCep(e.target.value)}
                >
                  {() => (
                    <Form.Field required error={ErrorCep}>
                      <label>CEP</label>
                      <input
                        data-testid="inputCEP"
                        placeholder="CEP"
                        required
                      ></input>
                    </Form.Field>
                  )}
                </InputMask>

                <Form.Field required>
                  <label>Bairro</label>
                  <input
                    data-testid="inputDisctrict"
                    placeholder="Bairro"
                    required
                    value={valueDistrict}
                    onChange={(e) => setValueDistrict(e.target.value)}
                  ></input>
                </Form.Field>
                <Form.Field required>
                  <label>Cidade</label>
                  <input
                    data-testid="inputCity"
                    placeholder="Cidade"
                    required
                    value={valueCity}
                    onChange={(e) => setValueCity(e.target.value)}
                  ></input>
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>Rua</label>
                  <input
                    data-testid="inputStreet"
                    placeholder="Rua"
                    required
                    value={valueStreet}
                    onChange={(e) => setValueStreet(e.target.value)}
                  ></input>
                </Form.Field>
                <Form.Field required>
                  <label>Numero</label>
                  <input
                    ref={inputRef}
                    type="text"
                    maxLength={8}
                    data-testid="inputNumber"
                    placeholder="Número"
                    required
                    value={valueNum}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setValueNum(e.target.value)
                    }
                  ></input>
                </Form.Field>
              </Form.Group>
              <Form.Field
                control={ButtonContainerLeft}
                onClick={() => verifyCepAndCpf()}
                loading={loadingButton}
              >
                {!match?.params?.id
                  ? "Adicionar a sugestão"
                  : "Editar a sugestão"}
              </Form.Field>
            </Form>
          </ContainerForm>
        </MinorContainerLeft>
      </ContainerLeft>
      <ContainerRight>
        <H1ContainerRight>Preencha o formulário</H1ContainerRight>
        <TextContainerRight>
        Preencha o formlário com todos os dados para o orgão responsavel possa resolver o seu problema ou clique a baixo para ver  sua lista de sugestão 
        </TextContainerRight>
        <Link to="/list">
          <ButtonContainerRight>Veja a lista</ButtonContainerRight>
        </Link>
      </ContainerRight>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </MajorContainer>
  );
}

export default AddItem;
