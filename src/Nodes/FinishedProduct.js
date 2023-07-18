import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import axios from 'axios';
import { coICoCID , is3cDone , coi, PTN } from './CoiCoCIDGeneration';
import "./css_Files/BioCollectionPopover.css";
import { StandardListItem } from '@ui5/webcomponents-react';
import { NodeStyle } from './NodeStyling';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Node = NodeStyle;
let temp=false;
let flag = 0;

export default memo(({ data, selected }) => {
const [color, setColor] = useState(data.color || '#D3D3D3'); // Background color
const [showPopover, setShowPopover] = useState(false);
const handleClickFinishedProduct = async () => {
  if(!is3cDone){
    try {
      console.log("3c");
      const newColor = "#FFA500";
  setColor(newColor);
 
      const response = await axios.get('/makeRequestFinishedProduct');  
      console.log(response.data.Treat);
      flag = response.data.Treat;
      temp=true;
     
      

  if(flag === 1){
    setColor("#3cba54");
  }
    } 
    catch (error) {
      const newColor = " #FF0000";
      setColor(newColor);
      toast.error('Error', {
        position: toast.POSITION.BOTTOM_CENTER
    });
      console.error('An error occurred');
    }
  }
  };
//popover 
// const handleDoubleClick=()=>{
//   setColor("#008000");
//  }

const handleMouseEnter = () => {
  setShowPopover(true);
  if(is3cDone === 1 || flag === 1){
    temp=true;
    setColor("#3cba54");
  }
};

const handleMouseLeave = () => {
setShowPopover(false);
};
let coiID;
 let id=`${coICoCID}`;
 let id1= `${coi}`;
 let ptn=`${PTN}`;
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
    {/* <ToastContainer /> */}
<Node color={color} selected={selected} onClick={handleClickFinishedProduct}>
<Handle type="target" position={Position.Left} />
<div className="custom-node"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // onMouseDown={handleDoubleClick}
     > 
<strong>{data.label}</strong>
</div>
<Handle type="source" position={Position.Right} />
</Node>
{showPopover && <div className="BioCollectionpopover">{<>
  <StandardListItem >
  {nodeStatus && <p>nodeStatus:- pending</p> }
   {!nodeStatus && <p>nodeStatus:- Created</p> }
</StandardListItem>
<StandardListItem >
  coicocid:- {coiID}
</StandardListItem>
<StandardListItem >
  referenceShipmentID :-{"FP" + ptn + "-01"}
</StandardListItem>
{/* <StandardListItem >
referenceCollectionID
</StandardListItem> */}

<StandardListItem >
    collectionId:-{"BSC" + ptn + "-01"}
</StandardListItem>
<StandardListItem >
collectionDate:- {new Date().toISOString()}
</StandardListItem>
</>



}</div>}
</div>
);
});