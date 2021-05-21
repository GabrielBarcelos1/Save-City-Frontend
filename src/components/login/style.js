import styled from "styled-components";
import { Form, Button} from "semantic-ui-react";

export const MajorContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
`;
export const ContainerLeft = styled.div`
  width: 40%;
  height: 100%;
  background-color: #58af9c;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  @media (max-width: 600px) {
    display: none;
  }
`;
export const H1ContainerLeft = styled.h1`
  color: white;
  font-weight: 700;
`;
export const TextContainerLeft = styled.p`
  color: #95d1c7;
  line-height: 30px;
`;

export const ContainerRight = styled.div`
  width: 60%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 600px) {
    width: 100%;
  }
`;
export const H1ContainerRight = styled.h1`
  color: #58af9c;
  font-weight: 700;
`;
export const ButtonContainerRight = styled(Button)`
  border: 0;
  outline: 0;
  margin: 10px auto !important;
  margin-top: 30px !important;
  color: white !important;
  font-weight: 600 !important;
  background-color: #58af9c !important;
  width: 250px !important;
  height: 40px !important;
  border-radius: 70px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    border: 1px solid #58af9c !important;
    color: #58af9c !important;
    background-color: white !important;
    transition: 0.15s;
  }
`;
export const ButtonContainerLeft = styled.button`
  border: 0;
  outline: 0;
  margin: 10px auto;
  color: white;
  font-weight: 600;
  background-color: #58af9c;
  width: 250px;
  height: 40px;
  border-radius: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
  &:hover {
    background-color: white;
    color:#58af9c;
    transition: 0.15s;
  }
`;
export const FormContainerRight = styled(Form)`
  width: 60%;
  @media (max-width: 600px) {
    width: 80%;
  }
`;
export const ButtonContainerRighMobile = styled.button`
  display:none;
  @media (max-width: 600px) {
    border: 0;
  outline: 0;
  margin: 10px auto;
  color: white;
  font-weight: 600;
  background-color: #58af9c;
  width: 250px;
  height: 40px;
  border-radius: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
  &:hover {
    background-color: white;
    color:#58af9c;
    transition: 0.15s;
  }
  }
`;
