import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  MajorContainer,
  ContainerLeft,
  ContainerRight,
  H1ContainerLeft,
  TextContainerLeft,
  H1ContainerRight,
  ButtonContainerRight,
  ButtonContainerLeft,
  FormContainerRight,
  ButtonContainerRighMobile
} from "./style";
import { Form } from "semantic-ui-react";
import StoreContext from "../../store/Context";
import {api} from '../../services/api'

function Login() {
  const { setToken } = useContext(StoreContext);
  const history = useHistory();

  const [valueEmail, setValueEmail] = useState("");
  const [valuePassword, setValuePassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassWord, setErrorPassWord] = useState(false);
  async function SignIn() {
    try{
      const result:any = await api.post('/sessions',{email:valueEmail, password: valuePassword})
      console.log(`result`, result)
      setErrorPassWord(false);
      setErrorEmail(false);
      setToken({ token: "1234" });
      localStorage.setItem('id', result.data.id)
      history.push(`/list`);
    }catch(err){
      console.log(`err`, err)
      setErrorPassWord(true);
      setErrorEmail(true);
    }
  }
  return (
    <MajorContainer>
      <ContainerLeft>
        <H1ContainerLeft>Bem-Vindo!</H1ContainerLeft>
        <TextContainerLeft>
          Entre na sua conta e junte-se ao seus amigos <br/>
          para ajudar a sua cidade sugerindo melhorias.
        </TextContainerLeft>
        <ButtonContainerLeft onClick={()=> history.push('/register')}>Cadastre-se</ButtonContainerLeft>
      </ContainerLeft>
      <ContainerRight>
        <H1ContainerRight>Entrar</H1ContainerRight>
        <FormContainerRight onSubmit={() => SignIn()}>
          <Form.Field error={errorEmail} width="sixteen">
            <label> Email</label>
            <input
              data-testid="inputEmail"
              placeholder="Email"
              value={valueEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValueEmail(e.target.value)
              }
            ></input>
          </Form.Field>
          <Form.Field error={errorPassWord}>
            <label>Senha</label>
            <input
              data-testid="inputPassWord"
              placeholder="Senha"
              value={valuePassword}
              type="password"
              onChange={(e) => setValuePassword(e.target.value)}
            />
          </Form.Field>
          <Form.Field control={ButtonContainerRight} data-testid="btnLogin">
            Entrar
          </Form.Field>
          <ButtonContainerRighMobile onClick={()=> history.push('/register')}>Cadastre-se</ButtonContainerRighMobile>
        </FormContainerRight>
      </ContainerRight>
    </MajorContainer>
  );
}

export default Login;
