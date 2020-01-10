import styled from "styled-components";
import { Link } from "@reach/router";
import { Paper } from "@material-ui/core";

export const Text = styled.span`
  font-family: Arial, Helvetica, sans-serif;
`;

export const RouterLink = styled(Link)`
  text-decoration: none;
`;

export const VerticallyCenteredContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const PaddedPaper = styled(Paper)`
  padding: ${props => props.paddingamount || 20}px;
`;
