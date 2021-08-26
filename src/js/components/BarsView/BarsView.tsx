import React, {useCallback, useEffect, useRef, useState} from "react";

import {getParentHeight, getParentWidth, useEffectOnTrue, useEffectWithNonNull} from 'util/util';

import {
    calculateBarsSizes,
    colorOfHash,
    createBars,
    createOrthoCamera,
    createRenderer,
    createScene,
    dummyObj,
    enableTransparency,
    removeChildrenFromScene,
    updateInstancedBar,
    updateInstancedMeshColor
} from "util/GLUtil";

import {StyledBarsView} from "./style";

const barMarkColors = ["#0085FF", "#b3ff00", "#ff2000", "#ff6600"];

export const BarsView = (props) => {
    const {samples, maxValue, data, color, marks, algorithm, dirty} = props;

    const mount = useRef(null);

    const [renderer, setRenderer] = useState(null);
    const [scene, setScene] = useState(null);
    const [camera, setCamera] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const updateSize = () => {
            setHeight(getParentHeight(mount));
            setWidth(getParentWidth(mount));
        };

        let h = getParentHeight(mount);
        let w = getParentWidth(mount);

        setCamera(createOrthoCamera(w, h, 0.1, 1000, 5));
        setRenderer(createRenderer(w, h, 0x00000));
        setScene(createScene());
        setWidth(w);
        setHeight(h);
        setInitialized(true);
        window.addEventListener('resize', updateSize);
        updateSize();

        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffectOnTrue(initialized, () => {
        enableTransparency(renderer);
        mount.current.appendChild(renderer.domElement);

        return () => {
            removeChildrenFromScene(scene);
            mount.current.removeChild(renderer.domElement);
        };
    }, [initialized]);

    useEffectWithNonNull(() => updateBarsColor(), [data, color, scene]);

    const updateBarsColor = useCallback(() => {
        if (scene.children.length > 0) {
            updateInstancedMeshColor(scene.children[0], data.length, color);
        }
    }, [scene, data, color]);

    useEffectOnTrue(initialized, () => {

        const updateCamera = () => {
            camera.left = 0;
            camera.right = width;
            camera.top = height;
            camera.bottom = 0;
            camera.updateProjectionMatrix();
        };

        const updateBars = () => {
            if (scene.children.length === 0) {
                return;
            }

            const mesh = scene.children[0];

            const {barWidth, spacing, offsetX} = calculateBarsSizes(width, data.length);

            for (let x = 0; x < samples; x++) {
                updateInstancedBar(x, mesh, data[x], maxValue, height, barWidth, spacing, offsetX, color);
                mesh.setColorAt(x, colorOfHash(barMarkColors[marks[x]]));
                mesh.setMatrixAt(x, dummyObj.matrix);
            }

            mesh.instanceMatrix.needsUpdate = true;
            mesh.instanceColor.needsUpdate = true;
        };

        const createOrUpdateBars = () => {

            if (data.length === 0) {
                return;
            }

            if (dirty) {
                renderer.dispose();
                createBars(scene, width, height, data, maxValue, samples, color);
            } else {
                updateBars();
            }
        };

        updateCamera();
        createOrUpdateBars();
        renderer.setSize(width, height);
        renderer.render(scene, camera);
    }, [algorithm, dirty, data, width, height, color, marks]);

    return <StyledBarsView ref={mount}/>;
};