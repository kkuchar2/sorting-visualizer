'use client';

import React, { useEffect, useState } from 'react';

import styles from './IndexPage.module.scss';

import { AlgorithmListItem } from '@/components/AlgorithmSelector/AlgorithmListItem';
import Modal from '@/components/ModalSystem/Modal';
import { SourceCodePreview } from '@/components/SourceCodePreview/SourceCodePreview';
import { sourceMap } from '@/components/SourceCodePreview/SourceMap';
import { Visualiser } from '@/components/Visualiser/Visualiser';
import { SortAlgorithm, sortingAlgorithms } from '@/config';

export default function IndexPage() {

    const [mounted, setMounted] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortAlgorithm>(sortingAlgorithms[1]);

    const [showSelectAlgorithmModal, setShowSelectAlgorithmModal] = useState(false);

    useEffect(() => {
        setMounted(true);

    }, []);

    if (!mounted) {
        return null;
    }

    return <div className={styles.indexPage}>
        <div className={'hidden max-h-screen w-full place-items-center overflow-auto rounded-md xl:grid xl:w-1/2'}>
            <SourceCodePreview sourceCode={sourceMap[selectedAlgorithm.value]}/>
        </div>
        <div
            className={'relative flex h-full w-full grow flex-col items-center justify-start gap-5 p-3 py-5 xl:w-1/2 xl:p-[50px]'}>

            <div className={'flex h-full w-full flex-col items-center justify-center gap-6 px-[20px]'}>
                <div className={styles.title}>
                    {'Sorting visualizer'}
                </div>
                <Visualiser
                    onShowSelectAlgorithmModal={() => setShowSelectAlgorithmModal(true)}
                    onSelectedAlgorithmChanged={setSelectedAlgorithm}
                    algorithm={selectedAlgorithm}/>
            </div>
            {showSelectAlgorithmModal && <Modal
                title={'Select algorithm'}
                onClose={() => setShowSelectAlgorithmModal(false)}>
                <div className={'flex flex-col'}>
                    {sortingAlgorithms.map((algorithm, index) => <AlgorithmListItem
                        key={index}
                        onClick={() => {
                            setSelectedAlgorithm(algorithm);
                            setShowSelectAlgorithmModal(false);
                        }} algorithm={algorithm}/>)}
                </div>
            </Modal>}
        </div>
    </div>;
};