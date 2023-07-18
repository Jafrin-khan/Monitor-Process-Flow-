import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';
import axios from 'axios';
import { NodeStyle } from '../Nodes/NodeStyling';
import { StandardListItem } from '@ui5/webcomponents-react';
import './ERP.css';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { coICoCID , coi} from '../Nodes/CoiCoCIDGeneration';

let temp=false;
const Node=NodeStyle;


export default memo(({ data, selected }) => {
const [color, setColor] = useState(data.color || '#D3D3D3'); // Background color
const [showPopover, setShowPopover] = useState(false);

const handleClickSalesOrderERP = async () => {
  
  console.log("entered function");
    try {
      console.log("entered 106");
      temp=true;
      setColor("#FFA500");
      
      const response =  await axios.get('/makeRequestSalesOrder');
      toast.success('Sales Order Done!', {
        position: toast.POSITION.BOTTOM_CENTER
      });
      setColor("#3cba54");
       // const TreatmentID = response.data.TreatmentID;
    } 
    catch (error) {
      const newColor = " #FF0000";
      setColor(newColor);
      toast.error('Error', {
        position: toast.POSITION.BOTTOM_CENTER
    });
      console.error('An error occurred');
    }
    
  };
//popover
const handleMouseEnter = () => {
  setShowPopover(true);
  
  // console.log(is3aDone);
  // if(is3aDone === 1 || flag === 1){
  //   setColor("#3cba54");
  // }
  
};

const handleMouseLeave = () => {
setShowPopover(false);
};

let coiID;
let id=`${coICoCID}`;
let id1= `${coi}`;
let nodeStatus;
if(temp&& id!=="undefined"){
nodeStatus=false;
coiID=id;
}
else if(temp&& id1!=="undefined"){
nodeStatus=false;
coiID=id1;
}
else {
nodeStatus=true;
}
  
return (

<div>
<Node color={color} selected={selected} onClick={handleClickSalesOrderERP}>
<Handle type="target" position={Position.Left} />
<div className="custom-node"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
     
     > 
<strong>{data.label}</strong>

</div>
<Handle type="source" position={Position.Right} />
</Node>
{showPopover && <div className="Salespopover">{<>
  <StandardListItem >
  {nodeStatus && <p>nodeStatus:- pending</p> }
{!nodeStatus && <p>nodeStatus:- Created</p> }  
</StandardListItem>
<StandardListItem >
  coicocid:- {coiID}
</StandardListItem>
<StandardListItem >
  ShipmentID:- 
</StandardListItem>
<StandardListItem >
salesOrderNumber :- 
</StandardListItem>
</>

}</div>}
</div>

);
});