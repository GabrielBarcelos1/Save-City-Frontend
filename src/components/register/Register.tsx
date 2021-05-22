import React, { useState,useRef } from "react";
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
  ButtonContainerMobile,
} from "./style";
import { Form } from "semantic-ui-react";
import InputMask from "react-input-mask";
import { viacep, api } from "../../services/api";
import { Link, RouteComponentProps, useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

type TParams = { id: string };
function Register({ match }: RouteComponentProps<TParams>) {
  const history = useHistory();
  const [valueName, setValueName] = useState("");
  const [valueCep, setValueCep] = useState("");
  const [valueCPF, setValueCPF] = useState("");
  const [valueEmail, setValueEmail] = useState("");
  const [valueStreet, setValueStreet] = useState("");
  const [valueCity, setValueCity] = useState("");
  const [valueDistrict, setValueDistrict] = useState("");
  const [valueNum, setValueNum] = useState("");
  const [valueWhatsApp, setValueWhatsApp] = useState("");
  const [valuePassword, setValuePassword] = useState("");
  const [ErrorCep, setErroCep] = useState(false);
  const [ErrorCPF, setErrorCPF] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      !valueCPF.endsWith("_") &&
      verifyCepAndCpf()
    ) {
      let cepParsed = parseValue(valueCep);
      let userToAdd = {
        name: valueName,
        email: valueEmail,
        password: valuePassword,
        cpf: valueCPF.replace(/[^a-z0-9]/gi,''),
        cep: cepParsed,
        city: valueCity,
        street: valueStreet,
        district: valueDistrict,
        number: valueNum,
        whatsapp: valueWhatsApp.replace(/[^a-z0-9]/gi,''),
      };
      try{
        setButtonLoading(true)
        const result = await api.post("/citizen", userToAdd);
        console.log(`result`, result)
        history.push('/')
        setButtonLoading(false)
      }catch(err){
        setButtonLoading(false)
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
    if (valueCPF.endsWith("_")) {
      setErrorCPF(true);
      return false;
    }

    return true;
  }

  return (
    <MajorContainer>
      <ContainerLeft>
        <ContainerIconLogout>
          <Link to="/list">
            <ButtonContainerMobile>Já tenho uma conta</ButtonContainerMobile>
          </Link>
        </ContainerIconLogout>

        <MinorContainerLeft>
          <ContainerForm>
            <H1Form>Formulário</H1Form>
            <Form
              onSubmit={() => addInfosToDb()}
            >
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>Nome</label>
                  <input
                    data-testid="inputName"
                    placeholder="Nome"
                    value={valueName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setValueName(e.target.value)
                    }
                  ></input>
                </Form.Field>
                <InputMask
                  mask="999.999.999-99"
                  value={valueCPF}
                  onChange={(e) => setValueCPF(e.target.value)}
                  data-testid="inputCPF"
                >
                  {() => (
                    <Form.Field error={ErrorCPF} required>
                      <label> CPF</label>
                      <input
                        data-testid="inputCPF"
                        placeholder="CPF"
                        required
                      ></input>
                    </Form.Field>
                  )}
                </InputMask>
                <InputMask
                  mask="(99) 9 9999-9999"
                  value={valueWhatsApp}
                  onChange={(e) => setValueWhatsApp(e.target.value)}
                >
                  {()=>(
                    <Form.Field error={ErrorCPF} required>
                      <label>Celular (whatsApp)</label>
                      <input
                        data-testid="inputCPF"
                        placeholder="Celular"
                        required
                      ></input>
                    </Form.Field>
                  )}
                </InputMask>
              </Form.Group>
              <Form.Group widths="equal">
              <Form.Field required>
                <label> Email</label>
                <input
                  type="email"
                  data-testid="inputEmail"
                  placeholder="Email"
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValueEmail(e.target.value)
                  }
                  value={valueEmail}
                ></input>
              </Form.Field>

              <Form.Field required>
                  <label>Senha</label>
                  <input
                    type="password"
                    maxLength={8}
                    data-testid="inputNumber"
                    placeholder="Senha"
                    required
                    value={valuePassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setValuePassword(e.target.value)
                    }
                  ></input>
              </Form.Field>
              </Form.Group>
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
                  <label>Número</label>
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
                loading={buttonLoading}
              >
                Crie sua conta
              </Form.Field>
            </Form>
          </ContainerForm>
        </MinorContainerLeft>
      </ContainerLeft>
      <ContainerRight>
        <H1ContainerRight>Preencha o formulário</H1ContainerRight>
        <TextContainerRight>
        Faça seu registro caso você queira fazer sugestões de melhorias para a sua cidade
        </TextContainerRight>
        <Link to="/">
          <ButtonContainerRight>Já tenho uma conta</ButtonContainerRight>
        </Link>
      </ContainerRight>
    </MajorContainer>
  );
}

export default Register;
