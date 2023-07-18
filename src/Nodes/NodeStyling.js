import styled from 'styled-components';
export let NodeStyle;
NodeStyle = styled.div`
padding: 10px 20px;
border-radius: 5px;
background: ${(props) => props.color}; /* Use a color prop instead of theme */
color: ${(props) => props.theme.nodeColor};
border: 1px solid ${(props) => (props.selected ? props.theme.primary : props.theme.nodeBorder)};
cursor: pointer; /* Add cursor style to indicate it's clickable */
 
.react-flow__handle {
background: ${(props) => props.theme.primary};
width: 2px;
height: 5px;
border-radius: 3px;
}
`;