import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';
import { coICoCID,coi } from './CoiCoCIDGeneration';
import axios from 'axios';
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
const handleClickSubsequentFP = async () => {
  
  
    try {
      console.log("19c");
      const newColor = "#FFA500";
      toast.success('Subsequent FP Shipment Done !', {
        position: toast.POSITION.BOTTOM_CENTER
      });
      const response = await axios.get('/makeRequestUpdateSubsequentFP');
      console.log(response.data.Treat);
      flag = response.data.Treat;
      temp=true;
      
      
      setColor(newColor);
       // const TreatmentID = response.data.TreatmentID;
        console.log("Subsequent FP  generated");

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
// const handleDoubleClick=()=>{
//   setColor("#008000");
//  }
const handleMouseEnter = () => {
  // setShowPopover(true);

  // if(flag === 1){
  //     setColor("#3cba54");
  //   }

};
const handleMouseLeave = () => {
// setShowPopover(false);
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
     {/* <ToastContainer /> */}
<Node color={color} selected={selected} onClick={handleClickSubsequentFP}>
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
{/* {showPopover && <div className="popover">{<>
        <StandardListItem >
        {nodeStatus && <p>nodeStatus:- pending</p> }
   {!nodeStatus && <p>nodeStatus:- Created</p> }  
</StandardListItem>
<StandardListItem >
        coicocid:-  {coiID}
</StandardListItem>
<StandardListItem >
        PTN:- {id}
</StandardListItem>
<StandardListItem >
clinicalTrialSubjectId:- {500813}
</StandardListItem>

<StandardListItem >
          Therapy ID:-THP099
</StandardListItem>
<StandardListItem >
Treatment Center ID:-TMC01
</StandardListItem> */}
      {/* </> */}

 

{/* }</div>} */}
  </div>


);
});