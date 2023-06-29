import { useEffect, useMemo, useRef } from 'react';

import { useThree } from '@react-three/fiber';
import { InstancedMesh, Object3D } from 'three';

import { MAX_SAMPLE_VALUE } from '@/config';

interface BarChartProps {
    sampleCount: number;
    data: number[];
}

const calculateBarsSizes = (width: number, barsCount: number) => {
    let maxBarWidth = width / barsCount;
    let spacing = 0;
    let barWidth = 1;
    let min = Math.min();
    let targetBarWidth = -1;
    let targetSpacing = -1;

    while (barWidth <= maxBarWidth) {
        while (spacing <= 1) {
            let diff = width - barsCount * (barWidth + spacing);

            if (diff < min && diff > 0) {
                min = diff;
                targetSpacing = spacing;
                targetBarWidth = barWidth;
            }

            spacing++;
        }
        barWidth++;
        spacing = 0;
    }

    barWidth = targetBarWidth;
    spacing = targetSpacing;

    if (barWidth === -1) {
        barWidth = maxBarWidth;
        spacing = 0;
    }

    return { barWidth, spacing };
};

export function Bar(props: BarChartProps) {
    const { sampleCount, data } = props;

    const meshRef = useRef<InstancedMesh>();

    const anonymousObject = useMemo(() => new Object3D(), []);

    const { size: sceneSize } = useThree();

    useEffect(() => {
        if (!meshRef.current) return;

        const { width, height } = sceneSize;
        const { barWidth, spacing } = calculateBarsSizes(width, sampleCount);
        const offsetX = Math.floor((-sampleCount * (barWidth + spacing)) / 2);

        for (let i = 0; i < sampleCount; i++) {
            const value = data[i];
            const scale = (value / MAX_SAMPLE_VALUE) * height;
            anonymousObject.scale.set(barWidth, scale, 1);
            anonymousObject.position.set(
                barWidth / 2 + barWidth * i + spacing * i + offsetX,
                -(1 - scale) / 2 - height / 2,
                0,
            );
            anonymousObject.updateMatrix();
            meshRef.current.setMatrixAt(i, anonymousObject.matrix);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [data, sceneSize, sampleCount]);

    return (
        <instancedMesh ref={meshRef} args={[null, null, sampleCount]}>
            <planeBufferGeometry args={[1, 1]}/>
            <meshBasicMaterial color={'#ffffff'}/>
        </instancedMesh>
    );
}
