import '@xyflow/react/dist/style.css';
import { StoryTree } from './components/StoryTree';
import { ReactFlowProvider } from '@xyflow/react';



export default function () {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh' }}>
        <StoryTree />
      </div>
    </ReactFlowProvider>
  );
}