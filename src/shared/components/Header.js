import React from "react";
import {
  Toolbar,
  AppBar,
  Link,
  SvgIcon,
  IconButton,
  Hidden
} from "@material-ui/core";
import { Link as ReachLink } from "@reach/router";
import styled from "styled-components";
import HelpIcon from "@material-ui/icons/Help";
import ShareIcon from "@material-ui/icons/Share";
import { useStore } from "../context/Store";

const StyledAppBar = styled(AppBar)`
  margin-bottom: 10px;
`;
const AppBarLink = styled(Link)`
  color: white;
  &:hover {
    text-decoration: none;
  }
  & .MuiIconButton-label {
    color: white;
  }
`;

const TitleLink = styled(AppBarLink)`
  font-size: 200%;
  font-family: "Lobster", cursive;
  margin-right: 20px;
  display: flex;
  align-items: center;
`;

const SawIcon = styled(({ className }) => {
  return (
    <SvgIcon className={className} viewBox="0 -105 448 448">
      <path d="m22.65625 200.390625-4.359375 4.714844h96.367187c11.238282-51.386719 56.738282-88.011719 109.335938-88.011719s98.097656 36.625 109.335938 88.011719h96.367187l-4.359375-4.714844c-2.480469-2.679687-2.832031-6.703125-.847656-9.773437l9.390625-14.527344-13.765625-10.472656c-2.902344-2.214844-3.941406-6.109376-2.519532-9.472657l6.710938-15.945312-15.402344-7.894531c-3.25-1.667969-4.957031-5.324219-4.148437-8.890626l3.824219-16.863281-16.539063-5.101562c-3.464844-1.085938-5.765625-4.371094-5.597656-8l.796875-17.28125-17.167969-2.167969c-3.621094-.457031-6.476563-3.3125-6.933594-6.9375l-2.160156-17.160156-17.28125.800781c-3.628906.167969-6.914063-2.132813-8-5.597656l-5.101563-16.539063-16.875 3.824219c-3.558593.804687-7.210937-.902344-8.878906-4.152344l-7.902344-15.390625-15.945312 6.710938c-3.367188 1.417968-7.261719.375-9.472656-2.535156l-10.472656-13.765626-14.535157 9.390626c-3.070312 1.984374-7.09375 1.632812-9.777343-.847657l-12.742188-11.800781-12.710938 11.761719c-2.683593 2.480469-6.707031 2.828125-9.777343.847656l-14.527344-9.394531-10.472656 13.769531c-2.207031 2.90625-6.105469 3.949219-9.472657 2.535156l-15.941406-6.710937-7.898437 15.382812c-1.667969 3.25-5.324219 4.960938-8.886719 4.152344l-16.863281-3.824219-5.105469 16.535157c-1.085938 3.46875-4.371094 5.765624-8 5.601562l-17.28125-.800781-2.167969 17.167969c-.457031 3.625-3.308593 6.480468-6.933593 6.9375l-17.167969 2.167968.800781 17.277344c.164062 3.628906-2.136719 6.914062-5.601562 8l-16.535157 5.105469 3.824219 16.871093c.800781 3.5625-.90625 7.214844-4.152344 8.882813l-15.394531 7.902344 6.664063 15.96875c1.417968 3.367187.375 7.261719-2.535157 9.472656l-13.75 10.46875 9.390625 14.539063c1.984375 3.070312 1.632813 7.09375-.847656 9.773437zm0 0" />
      <path d="m265.496094 205.105469h51.503906c-10.96875-42.390625-49.214844-71.996094-93-71.996094s-82.03125 29.605469-93 71.996094h51.503906c8.542969-14.851563 24.367188-24.003907 41.496094-24.003907s32.953125 9.152344 41.496094 24.003907zm-1.894532-26.914063 5.65625-5.65625c3.136719-3.03125 8.125-2.988281 11.210938.097656 3.085938 3.085938 3.132812 8.074219.097656 11.214844l-5.65625 5.65625c-2.007812 2.078125-4.980468 2.914063-7.777344 2.183594-2.796874-.734375-4.980468-2.917969-5.714843-5.714844-.730469-2.796875.101562-5.773437 2.183593-7.78125zm-79.203124 11.3125c-3.121094 3.125-8.1875 3.125-11.308594 0l-5.65625-5.65625c-3.035156-3.140625-2.988282-8.128906.097656-11.214844 3.085938-3.085937 8.074219-3.128906 11.210938-.097656l5.65625 5.65625c3.125 3.125 3.125 8.1875 0 11.3125zm47.601562-24.398437c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8v-8c0-4.417969 3.582031-8 8-8s8 3.582031 8 8zm0 0" />
      <path d="m0 221.105469h448v16h-448zm0 0" />
      <path d="m202.847656 205.105469h42.304688c-12.089844-10.652344-30.214844-10.652344-42.304688 0zm0 0" />
    </SvgIcon>
  );
})`
  color: white;
  height: 2em;
  width: 2em;
  margin-right: 10px;
`;

const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  flex-grow: 1;
`;
const HeaderIconButton = styled(IconButton)`
  color: white;
`;

export default React.forwardRef(function Header(props, ref) {
  const { encodeState } = useStore();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Part Placer",
        text: "A shared layout from part placer!",
        url: `${window.location.origin}/?share=${encodeState()}`
      });
    } catch (err) {
      console.error("navigator share", err);
    }
  };

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <TitleLink component={ReachLink} to="/">
          <Hidden xsDown>
            {" "}
            <SawIcon title="Part Placer" color="primary" />
          </Hidden>
          <span>Part Placer</span>
        </TitleLink>
        <ButtonContainer ref={ref}></ButtonContainer>
        {navigator.share && (
          <HeaderIconButton onClick={handleShare}>
            <ShareIcon />
          </HeaderIconButton>
        )}
        <AppBarLink title="About Part Placer" component={ReachLink} to="/about">
          <IconButton>
            <HelpIcon />
          </IconButton>
        </AppBarLink>
      </StyledToolbar>
    </StyledAppBar>
  );
});
