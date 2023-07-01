# Sorting Visualizer

Welcome to Sorting Visualizer.

I built this application after watching **15 Sorting Algorithms in 6 Minutes** video on YouTube which
was showing them in action with real time sound effects.

I thought that it would be cool to do this the same
way, but with a twist. All algorithms should be most sperated from presentation layer, so the closes to be raw
algorithms as possible.

The solution was to use Service Workers to do calculation on a separate thread, store sorted data, markers
and control flags on SharedArrayBuffer. That way we can squeeze out performance and not insert sorting logic in
React components.

Presentation layer for data is made with ThreeJS Fiber - rendering instanced quads based on current data state.

On top of it I added oscillator to play sound of currently accessed element (or swapped etc.)
plus side view with component rendering preprocessed source of file responsible for sorting.

Check out live version at https://sortingvis.kkucharski.com/