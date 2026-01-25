# Implementation Plan: Storyline V3 Enhancements

I will implement the requested features for the Storyline V3 editor, focusing on the minimap, narrative tension visualization, and zoom capabilities.

## 1. Minimap Integration
*   **Action**: Install `@vue-flow/minimap`.
*   **Implementation**:
    *   Import and register the `MiniMap` component in `Storyline.vue`.
    *   Configure it with `position="top-right"` to meet your layout requirement.

## 2. Narrative Tension & Event Grouping
Since the current data source (`story.json`) lacks "Tension", "Emotion", and "Purpose" fields, I will **programmatically simulate** this data within the editor to demonstrate the functionality.

*   **New Component**: Create `src/views/designs/components/StoryGroupNode.vue`.
    *   This node will visually enclose grouped events.
    *   It will display tags for **Narrative Emotion (叙事情绪)** and **Narrative Purpose (叙事目的)**.
*   **Logic Updates (`buildGraph` in `Storyline.vue`)**:
    *   **Tension (Y-Axis)**: Assign a randomized "Tension" value (0-100) to each event. This value will determine the Event's vertical position within the Segment (Higher Y = Higher Tension).
    *   **Grouping**: Implement logic to group adjacent events (e.g., every 2 events) into a "Narrative Group".
    *   **Layout Calculation**:
        *   Calculate the bounding box (position and size) for each Group Node based on the positions of the events inside it.
        *   Set `parentNode` relationships so events move with their groups.

## 3. Zoom Configuration
*   **Action**: Modify the `<VueFlow>` component configuration.
*   **Implementation**: Set `:min-zoom="0.05"` (currently 0.1) to allow for a broader view of the storyline.

## Execution Steps
1.  Run `npm install @vue-flow/minimap`.
2.  Create `StoryGroupNode.vue`.
3.  Modify `Storyline.vue` to integrate the minimap, update zoom settings, and apply the new tension/grouping layout logic.
