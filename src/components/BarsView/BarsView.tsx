import React, {useCallback, useEffect, useRef, useState} from 'react';

import {StyledBarsView} from './style';

import {
    createBars,
    createOrthoCamera,
    createRenderer,
    createScene,
    enableTransparency,
    removeChildrenFromScene, updateBars,
    updateInstancedMeshColor
} from 'util/GLUtil';
import {getParentHeight, getParentWidth, useEffectOnTrue, useEffectWithNonNull} from 'util/util';

export const BarsView = (props) => {
    const { samples, maxValue, data, color, algorithm, dirty } = props;

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

    useEffect(() => {
        if (!initialized) {
            return;
        }

        if (data.length > 0) {
            camera.left = 0;
            camera.right = width;
            camera.top = height;
            camera.bottom = 0;
            camera.updateProjectionMatrix();

            renderer.dispose();
            renderer.setSize(width, height);

            if (dirty) {
                createBars(scene, width, height, data, maxValue, samples, color);
            }
            else {
                updateBars(scene, width, height, data, maxValue, samples, color);
            }

            renderer.render(scene, camera);
        }

    }, [algorithm, dirty, data, width, height, color]);

    return <StyledBarsView ref={mount}/>;
};