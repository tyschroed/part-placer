import React from 'react';
import {Toolbar, AppBar, Link} from '@material-ui/core';
import {Link as ReachLink} from '@reach/router'
import styled from 'styled-components';

const StyledAppBar = styled(AppBar)`
  margin-bottom:10px;
`
const TitleLink = styled(Link)`
  color:white;
  font-size:120%;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`

export default function Header() {
  return (
    <div>
      <StyledAppBar position="static">
        <Toolbar>
            <TitleLink component={ReachLink} to="/" >Cutlist Generator</TitleLink>
        </Toolbar>
      </StyledAppBar>
    </div>
  );
}