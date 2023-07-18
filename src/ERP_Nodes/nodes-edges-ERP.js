import { MarkerType, Position, Background } from "reactflow";
export const ERPnodes = [
  
  {
      id: "node-1",
      sourcePosition: "right",
      targetPosition: "left",
      type: "customERP1",
      data: { label: "Sales Order Response" ,popoverContent: "This is the popover content for Node 1"},
      style: {
        background: "#D3D3D3",
        color: "black"
      },
      
      position: { x: 0, y: -50 }
    },
    {
      id: "node-2",
      sourcePosition: "right",
      targetPosition: "left",
      data: { label: "Goods issue" },
      style: {
        background: "#D3D3D3",
        color: "black"
      },
      position: { x: 400, y: -50}
    },
    {
      id: "node-3",
      //type:"custom2",
      sourcePosition: "right",
      targetPosition: "left",
      type: "customERP2",
      data: { label: "Purchase Order Response" },
      
      style: {
        background: "#D3D3D3",
        color: "Black"
      },
      position: { x: 0, y: 50 }
    },
    {
      id: "node-4",
      //type:"custom3",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: { label: "Goods Receipt" },
      
      style: {
        background: "#D3D3D3",
        color: "Black"
      },
  
      position: { x: 350, y: 50 }
    },
    
    {
      id: "node-5",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      type: "customERP3",
      data: { label: "Process order" },
      
      style: {
        background: "#D3D3D3",
        color: "Black"
      },
      position: { x: 0, y: 150 }
    },
    {
      id: "node-6",
      sourcePosition: "right",
      targetPosition: "left",
      data: { label: " Consume material" },
      style: {
        background: "#D3D3D3",
        color: "Black"
      },
      position: { x: 250, y: 150}
    },
    {
      id: "node-7",
      type:"custom5",
      sourcePosition: "right",
      targetPosition: "left",
      data: { label: " Start of Production" },
  
      style: {
        background: "#D3D3D3",
        color: "Black"
      },
      position: { x: 500, y: 150 }
    },
    {
      id: "node-8",
      type:"custom4",
      sourcePosition: "right",
      targetPosition: "left",
      data: { label: "Manufacturing Update" },
  
      style: {
        background: "#D3D3D3",
        color: "Black"
      },
      position: { x: 750, y: 150 }
    },
    {
      id: "node-9",
      sourcePosition: "right",
      targetPosition: "left",
      data: { label: " Manufacturing Completion" },
  
      style: {
        background: "#D3D3D3",
        color: "Black"
      },
      position: { x: 1000, y: 143}
    }
  ];
  
export  const ERPedges = [
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
      id: "node-e3-4",
      source: "node-3",
      type: "smoothstep",
      target: "node-4",
     
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 30
      }
    },
    {
      id: "node-e5-6",
      source: "node-5",
      sourcePosition: 'right',
      type: "smoothstep",
      target: "node-6",
      targetPosition: 'left',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 30
      }
      // label: "edge label"
    },
    {
      id: "node-e6-7",
      source: "node-6",
      //sourcePosition: Position.Bottom,
      type: "straight",
      target: "node-7",
      //targetPosition: Position.Top,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 30
      }
    },
    {
      id: "node-e7-8",
      source: "node-7",
      type: "smoothstep",
      target: "node-8",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 30
      }
    },
    {
      id: "node-e8-9",
      source: "node-8",
      type: "smoothstep",
      target: "node-9",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 30
      }
    }
    
   
  ];