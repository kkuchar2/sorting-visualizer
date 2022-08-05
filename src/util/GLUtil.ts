import {
    Color,
    DynamicDrawUsage,
    InstancedBufferGeometry,
    InstancedMesh,
    MeshBasicMaterial,
    Object3D,
    OrthographicCamera,
    PerspectiveCamera,
    PlaneBufferGeometry,
    PlaneGeometry,
    Scene,
    WebGLRenderer,
} from 'three';

export const dummyObj = new Object3D();
export const dummyColor = new Color();

export const colorOfHash = v => dummyColor.setHex(Number(`0x${v.substring(1)}`));

export const updateInstancedMeshColor = (mesh, instanceCount, color) => {
    for (let i = 0; i < instanceCount; i++) {
        mesh.setColorAt(i, colorOfHash(color));
    }
    mesh.instanceColor.needsUpdate = true;
};

export const createOrthoCamera = (width, height, near, far, z) => {
    let camera = new OrthographicCamera(0, width, height, 0, -1000, 1000);
    camera.position.z = z;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    return camera;
};

export const createPerspectiveCamera = (width, height, near, far, z = 2, y = 2) => {
    let camera = new PerspectiveCamera(75, width / height, near, far);
    camera.position.z = z;
    camera.position.y = y;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    return camera;
};

export const createRenderer = (width, height, clearColor) => {
    let renderer = new WebGLRenderer({ alpha: true });
    renderer.setClearColor(clearColor, 0);
    renderer.setSize(width, height);
    return renderer;
};

export const enableTransparency = renderer => {
    const gl = renderer.getContext();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};

export const updateCamera = (camera, left, right, top, bottom) => {
    camera.left = left;
    camera.right = right;
    camera.top = top;
    camera.bottom = bottom;
    camera.updateProjectionMatrix();
};

export const removeChildrenFromScene = scene => {
    if (scene === null || scene.children === null) {
        return;
    }
    while (scene.children.length > 0) {
        scene.children[0].geometry.dispose();
        scene.children[0].material.dispose();
        scene.remove(scene.children[0]);
    }
};

export const createPlaneGeometry = (width, height) => new PlaneGeometry(width, height, 1);

export const createScene = () => new Scene();

export const calculateBarsSizes = (width, barsCount) => {
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

    return { barWidth, spacing  };
};

export const calculateBarOffset = (width: number, barsCount: number, barWidth: number, spacing: number) => {
    return Math.floor((width - barsCount * (barWidth + spacing)) / 2);
};

export const updateInstancedBar = (idx, mesh, value, maxValue, height, barWidth, spacing, offsetX) => {
    const scale = (value / maxValue) * height;
    dummyObj.scale.set(barWidth, scale, 1);
    dummyObj.position.set(barWidth / 2 + barWidth * idx + spacing * idx + offsetX, scale / 2, 0);
    dummyObj.updateMatrix();
};

export const createBars = (scene: Scene, barWidth: number, barSpacing: number, offsetX: number, width: number, height: number, data: Array<number>, maxValue: number, samples: number) => {
    removeChildrenFromScene(scene);

    const geom = new InstancedBufferGeometry().copy(new PlaneBufferGeometry(1, 1));
    const mesh = new InstancedMesh(geom, new MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    }), samples);

    for (let x = 0; x < data.length; x++) {
        updateInstancedBar(x, mesh, data[x], maxValue, height, barWidth, barSpacing, offsetX);
        mesh.setMatrixAt(x, dummyObj.matrix);
    }

    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    mesh.instanceMatrix.needsUpdate = true;
    scene.add(mesh);
};

export const updateBars = (scene: Scene, barWidth: number, barSpacing: number, offsetX: number, width: number, height: number, data: Array<number>, maxValue: number, samples: number) => {
    const mesh = scene.children[0] as InstancedMesh;

    for (let x = 0; x < samples; x++) {
        updateInstancedBar(x, mesh, data[x], maxValue, height, barWidth, barSpacing, offsetX);
        mesh.setMatrixAt(x, dummyObj.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
};