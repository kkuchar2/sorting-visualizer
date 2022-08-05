import React, { useEffect, useRef, useState} from 'react';

import {StyledBarsView} from './style';

import {
    calculateBarOffset,
    calculateBarsSizes,
    createBars,
    createOrthoCamera,
    createRenderer,
    createScene,
    enableTransparency,
    removeChildrenFromScene, updateBars, updateCamera
} from 'util/GLUtil';
import {getParentHeight, getParentWidth} from 'util/util';

export const BarsView = (props) => {
    const { samples, maxValue, data, dirty } = props;

    const mount = useRef(null);

    const [renderer, setRenderer] = useState(null);
    const [scene, setScene] = useState(null);
    const [spacing, setSpacing] = useState(1);
    const [barWidth, setBarWidth] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
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

    useEffect(() => {
        if (!initialized) {
            return;
        }
        enableTransparency(renderer);
        mount.current.appendChild(renderer.domElement);

        return () => {
            mount.current.removeChild(renderer.domElement);
            removeChildrenFromScene(scene);
        };
    }, [initialized]);

    useEffect(() => {
        const res = calculateBarsSizes(width, samples);
        setSpacing(res.spacing);
        setBarWidth(res.barWidth);
    }, [width, samples]);

    useEffect(() => {
        setOffsetX(calculateBarOffset(width, samples, barWidth, spacing));
    }, [width, samples, spacing, barWidth]);

    useEffect(() => {
        if (!initialized || barWidth === 0) {
            return;
        }

        if (data.length > 0) {
            updateCamera(camera, 0, width, height, 0);

            renderer.dispose();
            renderer.setSize(width, height);

            if (dirty) {
                createBars(scene, barWidth, spacing, offsetX, width, height, data, maxValue, samples);
            }
            else {
                updateBars(scene, barWidth, spacing, offsetX, width, height, data, maxValue, samples);
            }

            renderer.render(scene, camera);
        }

    }, [dirty, data, width, height, spacing, barWidth, offsetX]);

    return <StyledBarsView ref={mount}/>;
};