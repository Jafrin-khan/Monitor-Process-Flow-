import { MarkerType, Position, Background } from "reactflow";

const x0=0;
const y0=50;
export const nodes = [
 
    {
      id: "node-1",
     
      type: "custom1",
      data: { label: " Generate CoiID" },
      style: {
        background: "#F0F0F0",
        color: "black"
      },
     
      position: { x: -250, y:-30}
    },
    {
      id: "node-2",
     
      type:"custom2",
      data: { label: "Treatment Order",popoverContent: "This is the popover content for Node 2" },
      style: {
        background: "#006400",
        color: "black"
      },
      position: { x: x0+250, y: y0}
    },
    {
      id: "node-3",
      type:"custom3",
      sourcePosition: "right",
      targetPosition: "left",
      data: { label: " Biospecimen Shipment" },
      style: {
        background: "#D3D3D3",
        color: "Black"
      },
      position: { x: x0+500, y: y0-200 }
    },
    {
      id: "node-4",
      type:"custom4",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: { label: " FP Shipment" },
      style: {
        background: "#D3D3D3",
        color: "Black"
      },
  
      position: { x: x0+500, y: y0 }
    },
    
    {
      id: "node-5",
      type:"custom5",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: { label: " Create Subsequent FP Shipment" },
      style: {
        background: "#D3D3D3",
        color: "Black"
      },
      position: { x: x0+500, y: y0+150 }
    },
    {
      id: "node-6",
      type:"custom6",
      sourcePosition: "right",
      targetPosition: "left",
      data: { label: " BioSpecimen Collection" },
  
      style: {
        background: "#D3D3D3",
        color: "Black"
      },
      position: { x: x0+1000, y: y0-250 }
    },
    {
      id: "node-7",
      type:"custom7",
      sourcePosition: "right",
      targetPosition: "left",
      data: { label: "BioSpecimen Shipment Information" },
  
      style: {
        background: "#D3D3D3",
        color: "Black"
      },
      position: { x: x0+1000, y: y0-150 }
    },
    {
      id: "node-8",
      type:"custom8",
      sourcePosition: "right",
      targetPosition: "left",
      data: { label: " Confirm FP Shipment Package Receipt" },
      style: {
        background: "#D3D3D3",
        color: "Black"
      },
      position: { x: x0+1000, y:y0-50 }
    },
    
   
    {
      id: "node-9",
      type:"custom9",
      sourcePosition: "right",
      targetPosition: "left",
      data: { label: " Confirm FP Shipment Content Reciept" },
  
      style: {
        background: "#D3D3D3",
        color: "Black"
      },
      position: { x: x0+1000, y: y0+50 }
    }
  ];
  
export  const edges = [
    {
      id: "node-e1-2",
      source: "node-1",
      type: "smoothstep",
      target: "node-2",
      
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 30
      }
    },
    {
      id: "node-e2-4",
      source: "node-2",
      type: "smoothstep",
      target: "node-4",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 30
      }
    },
    {
      id: "node-e2-3",
      source: "node-2",
      sourcePosition: 'right',
      type: "smoothstep",
      target: "node-3",
      targetPosition: 'left',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 30
      }
      // label: "edge label"
    },
    {
      id: "node-e2-5",
      source: "node-2",
      sourcePosition: Position.Bottom,
      type: "smoothstep",
      target: "node-5",
      targetPosition: Position.Top,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 30
      }
    },
    {
      id: "node-e4-8",
      source: "node-4",
      type: "smoothstep",
      target: "node-8",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 30
      }
    },
    {
      id: "node-e3-6",
      source: "node-3",
      type: "smoothstep",
      target: "node-6",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 30
      }
    },
    {
      id: "node-e3-7",
      source: "node-3",
      type: "smoothstep",
      target: "node-7",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 30
      }
    },
    {
      id: "node-e4-9",
      source: "node-4",
      type: "smoothstep",
      target: "node-9",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 30
      }
    }
  ];