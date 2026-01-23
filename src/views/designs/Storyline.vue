<template>
  <div class="storyline-v3">
    <!-- Toolbar -->
    <div class="toolbar">
      <button class="btn" @click="router.back()" title="Back" style="margin-right: 12px">Back</button>
      <div class="title">Storyline</div>
      <div class="spacer"></div>
      
      <button class="btn" @click="() => fitView()" title="Fit View">Fit View</button>
      <label class="file">
        Import JSON
        <input type="file" accept="application/json" @change="onImportJson" />
      </label>
    </div>

    <!-- Flow Canvas -->
    <div class="flow-container">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :node-types="nodeTypes"
        :default-viewport="{ zoom: 0.5 }"
        fit-view-on-init
        class="vue-flow-basic"
        @node-drag="onNodeDrag"
        @node-drag-stop="onNodeDragStop"
      >
        <Background pattern-color="#aaa" :gap="16" />
        <Controls />
      </VueFlow>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { VueFlow, useVueFlow, type Node, type Edge, type NodeDragEvent, type XYPosition } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

import StorySegmentNode from './components/StorySegmentNode.vue'
import StoryEventNode from './components/StoryEventNode.vue'
import storyData from '@/data/story.json'

// --- Setup ---
const router = useRouter()
const { fitView, project, getNodes, addNodes, removeNodes } = useVueFlow()

// Register custom node types
// Cast to any to bypass strict type checking for markRaw components
const nodeTypes = {
  segment: markRaw(StorySegmentNode),
  event: markRaw(StoryEventNode)
} as any

// State
const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

// --- Constants ---
const EVENT_WIDTH = 104 // Width of Event Node
const EVENT_GAP = 20    // Visual gap between events
const SEGMENT_PAD_X = 40
const SEGMENT_MIN_W = 420
const SEGMENT_HEIGHT = 160
const SEGMENT_GAP_Y = 50 // Minimum vertical gap between segments

// --- Asset Resolution (Copied from V2) ---
const locationImages = import.meta.glob('@/assets/StoryLineV3/locations/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' });
const characterImages = import.meta.glob('@/assets/StoryLineV3/characters/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' });

function resolveUrl(url: string) {
  if (!url || typeof url !== 'string') return url;
  const name = url.split('/').pop();
  if (!name) return url;

  if (url.includes('/location/') || url.includes('/locations/')) {
     for (const key in locationImages) {
        if (key.endsWith('/' + name)) return locationImages[key] as string;
     }
  }
  if (url.includes('/character/') || url.includes('/characters/')) {
     for (const key in characterImages) {
        if (key.endsWith('/' + name)) return characterImages[key] as string;
     }
  }
  return url;
}

// --- Data Parsing & Normalization ---
type Character = { CharacterID: string; CharacterName: string; AvatarURL?: string };
type StoryEvent = { EventID: string; EventName: string; Characters?: Character[]; X?: number; Y?: number };
type Segment = {
  SegmentID: string;
  Location: { LocationName: string; ImageURL?: string };
  BeatList?: StoryEvent[];
  nextSegID?: string[];
  fillImageURL?: string;
  Characters?: Character[];
};
type Phase = { PhaseID: string; PhaseTitle?: string; SegmentList: Segment[] };
type Storyline = { PhaseList: Phase[] };

function parseStoryData(raw: any): Storyline {
  const jsonStr = JSON.stringify(raw);
  const resolved = JSON.parse(jsonStr, (key, value) => {
    if (["LocationImageURL", "fillImageURL", "CharacterImageURL"].includes(key)) {
      if (Array.isArray(value)) return value.map((v: string) => resolveUrl(v));
      if (typeof value === "string") return resolveUrl(value);
    }
    return value;
  });

  const phaseList = Array.isArray(resolved?.PhaseList) ? resolved.PhaseList : Array.isArray(resolved) ? resolved : [];
  
  return {
    PhaseList: phaseList.map((p: any) => ({
      PhaseID: p?.PhaseID ?? "",
      PhaseTitle: p?.PhaseTitle,
      SegmentList: (Array.isArray(p?.SegmentList) ? p.SegmentList : []).map((s: any) => {
        const rawLoc = s?.Location ?? {};
        const locImg = rawLoc?.ImageURL ?? rawLoc?.LocationImageURL;
        return {
          SegmentID: s?.SegmentID ?? "",
          Location: { LocationName: rawLoc?.LocationName ?? "", ImageURL: Array.isArray(locImg) ? locImg[0] : locImg },
          BeatList: (s?.BeatList ?? s?.EventList ?? []).map((e: any) => ({
            EventID: e?.EventID ?? "",
            EventName: e?.EventName ?? e?.EventDesc ?? "",
            Characters: (e?.Characters ?? e?.EventCharacters ?? []).map((c: any) => ({
               CharacterID: c?.CharacterID ?? "",
               CharacterName: c?.CharacterName ?? "",
               AvatarURL: c?.AvatarURL ?? c?.CharacterImageURL
            })),
            X: e?.X, Y: e?.Y
          })),
          nextSegID: s?.nextSegID ?? [],
          fillImageURL: s?.fillImageURL,
          Characters: s?.Characters // Seg chars
        }
      })
    }))
  };
}

// --- Layout & Graph Construction ---
const LAYOUT = {
  phaseGapX: 1000,
  segGapY: 500,
  edgeColors: ["#a0754a", "#4a72cf", "#8754b5", "#25a692", "#c57688"]
}

function buildGraph(data: Storyline) {
  const newNodes: Node[] = [];
  const newEdges: Edge[] = [];
  
  const phases = data.PhaseList || [];
  
  phases.forEach((phase, phaseIdx) => {
    const segments = phase.SegmentList || [];
    
    segments.forEach((seg, segIdx) => {
      // 1. Calculate Segment Width based on Event Count
      const beats = seg.BeatList || [];
      const beatsCount = beats.length;
      
      const contentW = beatsCount > 0 
        ? beatsCount * EVENT_WIDTH + (beatsCount - 1) * EVENT_GAP 
        : 0;
      
      const segWidth = Math.max(SEGMENT_MIN_W, contentW + SEGMENT_PAD_X * 2);
      
      // 2. Create Segment Node (Parent)
      const segX = phaseIdx * LAYOUT.phaseGapX;
      const segY = segIdx * LAYOUT.segGapY;
      
      newNodes.push({
        id: seg.SegmentID,
        type: 'segment',
        position: { x: segX, y: segY },
        style: { width: `${segWidth}px`, height: `${SEGMENT_HEIGHT}px` },
        data: {
          label: seg.SegmentID,
          locationName: seg.Location?.LocationName,
          fillImageURL: seg.fillImageURL || seg.Location?.ImageURL,
          phaseIdx: phaseIdx // Store phase index for column locking
        }
      });
      
      // 3. Create Event Nodes (Children)
      const startX = (segWidth - contentW) / 2;
      
      beats.forEach((beat, bIdx) => {
        const bx = startX + bIdx * (EVENT_WIDTH + EVENT_GAP);
        const by = (SEGMENT_HEIGHT - 130) / 2;

        newNodes.push({
          id: beat.EventID,
          type: 'event',
          parentNode: seg.SegmentID, 
          // Removed extent: 'parent' to allow dragging out
          position: { x: bx, y: by },
          class: 'event-node-transition', // Add transition class
          data: {
            label: beat.EventName,
            characters: beat.Characters
          }
        });
      });
      
      // 4. Create Edges
      if (seg.nextSegID && seg.nextSegID.length) {
        seg.nextSegID.forEach((targetId, i) => {
          const color = LAYOUT.edgeColors[(segIdx + i) % LAYOUT.edgeColors.length];
          newEdges.push({
            id: `${seg.SegmentID}->${targetId}`,
            source: seg.SegmentID,
            target: targetId,
            type: 'default', 
            style: { stroke: color, strokeWidth: 2 },
            animated: true, 
            class: 'animated-dashed-edge',
            label: '' 
          });
        });
      }
    });
  });
  
  nodes.value = newNodes;
  edges.value = newEdges;
  
  setTimeout(() => fitView(), 100);
}

// --- Interaction Logic ---

function onNodeDrag(e: NodeDragEvent) {
  const node = e.node;
  
  if (node.type === 'segment') {
    handleSegmentDrag(node);
  } else if (node.type === 'event') {
    handleEventDrag(node);
  }
}

function onNodeDragStop(e: NodeDragEvent) {
  const node = e.node;
  
  if (node.type === 'event') {
    handleEventDragStop(node);
  } else if (node.type === 'segment') {
    // Optional: Final cleanup for segments
  }
}

// --- Segment Logic: Lock X + Repulsion ---
function handleSegmentDrag(node: Node) {
  // 1. Lock X Axis
  const phaseIdx = node.data.phaseIdx as number;
  const fixedX = phaseIdx * LAYOUT.phaseGapX;
  node.position.x = fixedX;
  
  // 2. Repulsion (Vertical Push)
  const allSegments = nodes.value.filter(n => n.type === 'segment' && n.data.phaseIdx === phaseIdx && n.id !== node.id);
  
  const nodeTop = node.position.y;
  const nodeBottom = node.position.y + SEGMENT_HEIGHT;
  const nodeCenter = (nodeTop + nodeBottom) / 2;
  
  allSegments.forEach(other => {
    const otherTop = other.position.y;
    const otherBottom = other.position.y + SEGMENT_HEIGHT;
    const otherCenter = (otherTop + otherBottom) / 2;
    
    // Check overlap with buffer
    const buffer = SEGMENT_GAP_Y;
    
    if (nodeBottom + buffer > otherTop && nodeTop - buffer < otherBottom) {
      // Collision detected
      // Push away based on relative center
      if (nodeCenter < otherCenter) {
        // Pushing down
        other.position.y = nodeBottom + buffer;
      } else {
        // Pushing up
        other.position.y = nodeTop - SEGMENT_HEIGHT - buffer;
      }
    }
  });
}

// --- Event Logic: Gap Animation + Drag Out + Hit Test ---

function getEventAbsolutePosition(node: Node): { x: number; y: number } {
  if (node.parentNode) {
    const parent = nodes.value.find(n => n.id === node.parentNode);
    if (parent) {
      return {
        x: parent.position.x + node.position.x,
        y: parent.position.y + node.position.y
      };
    }
  }
  return { x: node.position.x, y: node.position.y };
}

function findHitSegment(node: Node): Node | null {
  const absPos = getEventAbsolutePosition(node);
  const nodeCenterX = absPos.x + EVENT_WIDTH / 2;
  const nodeCenterY = absPos.y + (SEGMENT_HEIGHT - 130) / 2 + 50; // Approx center

  // Check collision with all segments
  for (const seg of nodes.value) {
    if (seg.type !== 'segment') continue;
    
    // Simple AABB check (treating drag node as a point for simplicity, or small box)
    const segLeft = seg.position.x;
    const segTop = seg.position.y;
    
    // Fix TS error: Cast style to any to access width safely
    const styleObj = seg.style as any;
    const segWidth = parseFloat(styleObj?.width as string) || SEGMENT_MIN_W;
    const segHeight = SEGMENT_HEIGHT;
    
    if (nodeCenterX >= segLeft && nodeCenterX <= segLeft + segWidth &&
        nodeCenterY >= segTop && nodeCenterY <= segTop + segHeight) {
      return seg;
    }
  }
  return null;
}

function handleEventDrag(node: Node) {
  const hitSegment = findHitSegment(node);
  const parentId = hitSegment ? hitSegment.id : node.parentNode;
  
  if (!parentId) return; // Should not happen if dragging existing node
  
  // Calculate relative X in the target segment context
  // Note: We are just previewing gaps here. 
  // If we are hovering a NEW segment, we should ideally show gap there.
  // But visually switching parent during drag is complex in Vue Flow without reparenting.
  // For now, let's keep gap animation for the *current* parent. 
  // If we want to support cross-segment preview, we'd need to simulate it.
  
  // Let's stick to simple gap logic for current parent, 
  // and if user is dragging over another segment, maybe highlight it?
  
  if (parentId !== node.parentNode) {
    // Hovering a different segment! 
    // TODO: Add highlight logic here if desired
    return;
  }
  
  const parentNode = nodes.value.find(n => n.id === parentId);
  if (!parentNode) return;
  
  // --- Gap Animation (Sort Preview) ---
  const siblings = nodes.value.filter(n => n.parentNode === parentId && n.type === 'event' && n.id !== node.id);
  
  const currentX = node.position.x;
  siblings.sort((a, b) => a.position.x - b.position.x);
  
  let insertIndex = siblings.length;
  for (let i = 0; i < siblings.length; i++) {
    // Check siblings[i] existence for safety
    if (!siblings[i]) continue;
    
    const sibCenter = siblings[i].position.x + EVENT_WIDTH / 2;
    if (currentX < sibCenter) {
      insertIndex = i;
      break;
    }
  }
  
  // Fix TS error: Cast style to any
  const styleObj = parentNode.style as any;
  const pWidth = parseFloat(styleObj?.width as string) || SEGMENT_MIN_W;
  const count = siblings.length + 1; 
  const contentW = count * EVENT_WIDTH + (count - 1) * EVENT_GAP;
  const startX = (pWidth - contentW) / 2;
  
  siblings.forEach((sib, idx) => {
    const effectiveIdx = idx >= insertIndex ? idx + 1 : idx;
    const targetX = startX + effectiveIdx * (EVENT_WIDTH + EVENT_GAP);
    sib.position.x = targetX;
  });
}

function handleEventDragStop(node: Node) {
  const oldParentId = node.parentNode;
  const oldParentNode = nodes.value.find(n => n.id === oldParentId);
  
  const hitSegment = findHitSegment(node);
  
  if (hitSegment) {
    // Case 1: Dropped on a Segment (Same or Different)
    const targetId = hitSegment.id;
    
    if (targetId !== oldParentId) {
      // Reparent to new Segment
      // 1. Calculate new relative position
      const absPos = getEventAbsolutePosition(node);
      const relX = absPos.x - hitSegment.position.x;
      const relY = absPos.y - hitSegment.position.y;
      
      // 2. Update Node
      node.parentNode = targetId;
      node.position = { x: relX, y: relY };
      
      // 3. Update both segments
      snapEventsInSegment(targetId);
      if (oldParentId) checkAndCleanupSegment(oldParentId);
      
    } else {
      // Same parent, just snap
      snapEventsInSegment(oldParentId);
    }
  } else {
    // Case 2: Dropped on empty space -> Create New Segment
    if (oldParentNode) {
      createNewSegmentFromEvent(node, oldParentNode);
    }
  }
}

function checkAndCleanupSegment(segId: string) {
  const siblings = nodes.value.filter(n => n.parentNode === segId && n.type === 'event');
  if (siblings.length === 0) {
    removeNodes([segId]);
  } else {
    snapEventsInSegment(segId);
  }
}

function snapEventsInSegment(parentId: string) {
  const parentNode = nodes.value.find(n => n.id === parentId);
  if (!parentNode) return;
  
  const siblings = nodes.value.filter(n => n.parentNode === parentId && n.type === 'event');
  siblings.sort((a, b) => a.position.x - b.position.x);
  
  // Recalc Parent Width
  const count = siblings.length;
  const contentW = count > 0 ? count * EVENT_WIDTH + (count - 1) * EVENT_GAP : 0;
  const segWidth = Math.max(SEGMENT_MIN_W, contentW + SEGMENT_PAD_X * 2);
  
  // Update Parent Width
  parentNode.style = { ...parentNode.style, width: `${segWidth}px` };
  
  // Position Children
  const startX = (segWidth - contentW) / 2;
  siblings.forEach((sib, idx) => {
    sib.position.x = startX + idx * (EVENT_WIDTH + EVENT_GAP);
    sib.position.y = (SEGMENT_HEIGHT - 130) / 2;
  });
  
  // Trigger reactivity
  nodes.value = [...nodes.value];
}

function createNewSegmentFromEvent(eventNode: Node, oldParentNode: Node) {
  const absX = oldParentNode.position.x + eventNode.position.x;
  const absY = oldParentNode.position.y + eventNode.position.y;
  
  const phaseIdx = Math.round(absX / LAYOUT.phaseGapX);
  const targetX = phaseIdx * LAYOUT.phaseGapX;
  
  const newSegID = `Seg-${Date.now()}`;
  const newSeg: Node = {
    id: newSegID,
    type: 'segment',
    position: { x: targetX, y: absY }, 
    style: { width: `${SEGMENT_MIN_W}px`, height: `${SEGMENT_HEIGHT}px` },
    data: {
      label: newSegID,
      locationName: 'New Location',
      phaseIdx: phaseIdx
    }
  };
  
  eventNode.parentNode = newSegID;
  eventNode.position = { x: 0, y: 0 }; 
  
  addNodes([newSeg]);
  
  setTimeout(() => {
     snapEventsInSegment(newSegID);
     checkAndCleanupSegment(oldParentNode.id);
     nodes.value = [...nodes.value];
  }, 50);
}

// --- Event Handlers ---
async function onImportJson(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const json = JSON.parse(text);
    const data: Storyline = json?.PhaseList ? json : { PhaseList: json };
    const normalized = parseStoryData(data);
    buildGraph(normalized);
  } catch (err) {
    console.error("Invalid JSON:", err);
  } finally {
    input.value = "";
  }
}

onMounted(() => {
  const data = parseStoryData(storyData);
  buildGraph(data);
});

</script>

<style scoped>
.storyline-v3 {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.toolbar {
  height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  z-index: 10;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.title {
  font-weight: 700;
  color: #111827;
}

.spacer {
  flex: 1;
}

.btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}
.btn:hover {
  background-color: #f3f4f6;
}

.file {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px dashed #d1d5db;
  background: #f9fafb;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  display: flex;
  align-items: center;
}
.file input {
  display: none;
}

.flow-container {
  flex: 1;
  position: relative;
}

.vue-flow-basic {
  background-color: #ffffff;
}

/* Custom Edge Animation */
:deep(.vue-flow__edge-path) {
  stroke-dasharray: 10;
  animation: dash 1s linear infinite;
}

@keyframes dash {
  from {
    stroke-dashoffset: 20;
  }
  to {
    stroke-dashoffset: 0;
  }
}

/* Event Node Transition */
:deep(.event-node-transition) {
  transition: transform 0.2s ease-out;
}
/* Disable transition during drag to prevent lag/fighting */
:deep(.vue-flow__node.dragging) {
  transition: none !important;
  z-index: 1000;
}

/* 3. Segment Node (容器) 样式 */
/* 注意：这里假设 StorySegmentNode 内部会使用这个类，或者VueFlow会把这个class加到wrapper上 */
:deep(.animaster-segment-node) {
  /* Removed styling to let component handle visuals */
  /* background: rgba(40, 40, 40, 0.6); */
  /* border: 1px solid rgba(255, 255, 255, 0.1); */
  /* border-radius: 16px; */
  /* box-shadow: 0 4px 6px rgba(0,0,0,0.1); */
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
:deep(.animaster-segment-node.selected) {
  /* border-color: #ff5252; */
  /* background: rgba(40, 40, 40, 0.9); */
  /* box-shadow: 0 0 0 2px rgba(255, 82, 82, 0.2); */
}
/* 拖拽时的高亮反馈 */
:deep(.animaster-segment-node.dragging) {
  /* box-shadow: 0 10px 20px rgba(0,0,0,0.5); */
  transform: scale(1.02);
  z-index: 999;
}
</style>
