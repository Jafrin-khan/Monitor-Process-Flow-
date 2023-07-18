import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import axios from 'axios';
import "./css_Files/BioCollectionPopover.css";
import { coICoCID,coi,PTN } from './CoiCoCIDGeneration';
import { StandardListItem } from '@ui5/webcomponents-react';
import { NodeStyle } from './NodeStyling';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Node = NodeStyle;
let temp=false;
let flag = 0;

export default memo(({ data, selected }) => {
const [color, setColor] = useState(data.color || '#D3D3D3');
const [showPopover, setShowPopover] = useState(false); // Background color

const handleClickFPRecieptContent = async () => {
  
 
    try {
      console.log("18");
      const newColor = "#FFA500";
      setColor(newColor);
      toast.success('Confirmed FP Reciept Content ', {
        position: toast.POSITION.BOTTOM_CENTER
      });

      let cnt = 5;

      while(cnt--){
      const response =  await axios.get('/makeRequestUpdateFPRecieptContent');
      if(response !== undefined){
      temp=true;
      console.log(response.data.Treat);
      flag = response.data.Treat;
      break;
      }
      }
    
       // const TreatmentID = response.data.TreatmentID;
        console.log("FP Reciept Content generated");

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
    
  };
 //popover

//  const handleDoubleClick=()=>{
//   setColor("#008000");
//  }
 const handleMouseEnter = () => {
  setShowPopover(true);
  // if(flag === 1){
  //   setColor("#3cba54");
  // }

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
<Node color={color} selected={selected} onClick={handleClickFPRecieptContent}>
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
  coicocid:-  {coiID}
</StandardListItem>
<StandardListItem >
  referenceShipmentID:-{"FP" + ptn + "-01"}
</StandardListItem>
<StandardListItem >
shipperContentsVerified:-
</StandardListItem>

<StandardListItem >
contentVerifiedBy:-{"loring.wu@sap.com"}
</StandardListItem>
<StandardListItem >
    contentApprovedBy:-{"loring.wu@sap.com"}
</StandardListItem>
<StandardListItem >
contentVerifiedAt:-{new Date().toISOString()}
</StandardListItem>
<StandardListItem >
contentApprovedAt:-{new Date().toISOString()}
</StandardListItem>
</>



}</div>}
  </div>


);
});