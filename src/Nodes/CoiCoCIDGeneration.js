import React, { memo, useState, useEffect , useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import axios from 'axios';
import { FlexBox, StandardListItem,FlexBoxJustifyContent } from '@ui5/webcomponents-react';
import { Input,Button } from '@ui5/webcomponents-react';
import './css_Files/Coi.css';
import { NodeStyle } from './NodeStyling';
import './css_Files/ToggleSwitch.css';
import {  toast ,getAutoCloseDelay} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Node=NodeStyle;
export let  coICoCID="";
export let  is3aDone;
export let  is3bDone;
export let  is3cDone;
export let PTN;
let temp=false;
export let coi = "";


export default memo(({ data, selected }) => {
const [color, setColor] = useState(data.color || '#D3D3D3'); // Background color
const [isChecked, setIsChecked] = useState(false);
const [inputValue, setInputValue] = useState('');
const [showPopover, setShowPopover] = useState(false);
const [showMenu,setShowMenu]= useState(false);  
  

  const handleInputChange = useCallback((e) => {
   
      console.log(e.target.value);
      const input=e.target.value;
      setInputValue(input);
      console.log(inputValue);
    }, []);
    
  

const handleChange = () => {
  setIsChecked(!isChecked);
  if (!isChecked) {
    console.log("Toggle is on");
    setColor("#696969");
    console.log("Toggle is working ");
    handleSubmit();
  
  } else {
    setColor("#D3D3D3");
    console.log("Toggle is off");
    
    // handleClickCoi();
    
  }
};

  // Perform actions when toggle is switched on
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Input value Coi :', inputValue);
    coi = inputValue;
    console.log('Ui ka Coi' , coi);
   
 
    try {
      
      await submitData(inputValue);
      // setInputValue('');
    } catch (error) {
      console.log(error.message);
      throw error;
    }

  };
  const submitData = async (inputValue) => {

    console.log("submitData : " ,inputValue);
    coi=inputValue;
    try {
      const response = await axios.post(
        '/EnterCoi',
        {coi},
        { headers: { 'Content-Type': 'application/json' } }
      );
     
    } 
    catch (error) {
      console.log(error.message);
      throw error;
    }

    try{
      console.log("alreadyPresentCoi");
      toast.success('CoiCoCID Generated', {
        position: toast.POSITION.BOTTOM_CENTER,
        getAutoCloseDelay:3000
    });
      const res = await axios.get('/alreadyPresentCoi',{ timeout: 180000 });
      console.log(res.data);
      coICoCID = res.data.coICoCID.coICoCID;
      is3aDone = res.data.coICoCID.is3aDone;
      is3bDone = res.data.coICoCID.is3bDone;
      is3cDone = res.data.coICoCID.is3cDone;
      PTN = res.data.coICoCID.PTN;

      console.log(coICoCID);
      console.log(is3aDone);
      temp=true;
        
        // setColor("#3cba54");
        
    }
    
    catch (error) {
      toast.error('Error', {
        position: toast.POSITION.BOTTOM_CENTER
    });
      const newColor = " #FF0000";
      setColor(newColor);
      console.error(error.message);
    }
  };
  
  // Perform actions when toggle is switched off
  
  const handleClickCoi = async () => {  
    
    
    if (!isChecked) {
      try {
        console.log("Entered request");
        toast.success('CoiCoCID Generated', {
          position: toast.POSITION.BOTTOM_CENTER,
          getAutoCloseDelay:3000
      });
      const newColor = "#FFA500";
      setColor(newColor);
        const res = await axios.get('/makeRequestcoiCoCID');
        console.log(res.data.coICoCID);
        temp=true;
        
        coICoCID = res.data.coICoCID.coICoCID;
        // is3aDone = res.data.coICoCID.is3aDone;
        // is3bDone = res.data.coICoCID.is3bDone;
        // is3cDone = res.data.coICoCID.is3cDone;
        PTN=res.data.coICoCID.PTN;
          console.log(coICoCID);
          console.log(is3aDone);
          
          setColor("#3cba54");
          // coICoCID=res.data.coICoCID;
         
  
      } 
      catch (error) {
        toast.error('Error', {
          position: toast.POSITION.BOTTOM_CENTER
      });
        const newColor = " #FF0000";
        setColor(newColor);
        console.error(error.message);
      }
    }
    };
   
   const handleDoubleClick=()=>{
    setShowMenu(true);
   }
  
    const handleMouseEnter = () => {
      setShowPopover(true);
     
      if(isChecked === "true"){
        setColor("#696969");
      }
    };
  const handleMouseLeave = () => {
    setShowPopover(false);
  };
  let coiID;
  let id=`${coICoCID}`;
  let id1=`${coi}`
  console.log(" input wali coi ");
  let nodeStatus;
 let ptn=`${PTN}`;

  if(temp && id!=="undefined"){
    nodeStatus=false;
    coiID=id;
  }
  else if(temp&& id1!=="undefined"){
    nodeStatus=false;
    coiID=id1;
  }
  else{
    nodeStatus=true;
  }
  
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      const node = document.querySelector('.custom-node');
      if (node && !node.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };
  
  

  return (
    <div >


      <Node color="#D3D3D3" selected={selected}>

      <Node>
      <div className="custom-node__body">
      <babel style={{ padding: '10px'}}>
Enter CoiID  
      </babel>
      <label className="toggle-switch">
          <input type="checkbox" checked={!isChecked} onChange={handleChange} />
          <span className={`toggle-slider ${isChecked ?"checked": "!checked"}`}></span>
        </label> 
        </div>
      </Node>

      <div style={{ height: "100%", width: "100%", padding: "5px", marginTop: "5px" }}></div>
      <Node color="#D3D3D3" selected={selected}>
        <div className="custom-node__body">
      <FlexBox
      justifyContent={FlexBoxJustifyContent.SpaceBetween}
      >
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        // onClick={handleSubmitPTN}
        disabled={!isChecked}
        placeholder="Enter CoiID"
        style={{ backgroundColor: "ButtonFace",borderRadius:'10px',
        padding: '10px' }}
      />
      <Button  onClick={handleSubmit} style={{ color:'black',borderRadius:'17px',
        padding: '5px', fontSize: '14px',backgroundColor:"ButtonShadow" }} disabled={!isChecked} >
        Submit
      </Button>
      </FlexBox>
        </div>
   </Node>
   
<div style={{ height: "100%", width: "100%", padding: "5px", marginTop: "5px" }}>
</div>

<div>
<Node color={color} selected={selected}  onClick={!isChecked ? handleClickCoi : null}  >
 <Handle type="target"  position={Position.Left}/> 
<div className="custom-node"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleDoubleClick}> 
<strong>{data.label}</strong>
</div>
<Handle type="source" position={Position.Right} />
</Node>
</div>
      
{showPopover && <div className="Coipopover">{<>
  <StandardListItem >
   {nodeStatus && <p>nodeStatus:- pending</p> }
   {!nodeStatus && <p>nodeStatus:- Created</p> }   
</StandardListItem>
<StandardListItem >
        coicocid:- {coiID}
</StandardListItem>
<StandardListItem >
        PTN:-{ptn}
</StandardListItem>
<StandardListItem >
          Therapy ID:-THP099
</StandardListItem>
<StandardListItem >
Treatment Center ID:-TMC01
</StandardListItem>
</>
}</div>}


{showMenu && <div className="Menu">{<><StandardListItem >
        coicocid:- {id}
        <Button onClick={() => handleCopy(id)}>Copy</Button> {/* Add a copy button */}
</StandardListItem></>
}</div>}

 
</Node>
    </div>
);
});