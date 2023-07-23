# Sorting Visualizer

Welcome to Sorting Visualizer.

I built this application after watching **15 Sorting Algorithms in 6 Minutes** video on YouTube which
was showing them in action with real time sound effects.

https://www.youtube.com/watch?v=kPRA0W1kECg

I thought that it would be cool to do this the same
way (or at least close to it) in React but with a twist. All algorithms should be most sperated from presentation layer, so the closes to be raw
algorithms as possible. And doing all that in NextJS deployed on Vercel.

The solution was to use Service Workers to do calculation on a separate thread, store sorted data, markers
and control flags on SharedArrayBuffer. That way we can squeeze out performance and not insert sorting logic in
React components. By using this buffer we do not have to send data from worker to main thread, just a notification that data is updated.

Presentation layer for data is made with ThreeJS Fiber - rendering instanced quads based on current data state.

On top of it I added oscillator to play sound of currently accessed element (or swapped etc.)
plus side view with component rendering preprocessed source of file responsible for sorting.

![sort](https://github.com/kkuchar2/sorting-visualizer/assets/23500051/61bc8a67-5fbb-4ecd-9d69-4c430d88ff32)

Check out live version at https://sortingvis.kkucharski.com/
