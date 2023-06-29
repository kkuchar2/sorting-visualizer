'use client';

import React, { useState } from 'react';

import styles from './IndexPage.module.scss';

import Modal from '@/components/ModalSystem/Modal';
import { SourceCodePreview } from '@/components/SourceCodePreview/SourceCodePreview';
import { sourceMap } from '@/components/SourceCodePreview/SourceMap';
import { Visualiser } from '@/components/Visualiser/Visualiser';
import { SortAlgorithm, sortingAlgorithms } from '@/config';

export default function IndexPage() {

    const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortAlgorithm>(sortingAlgorithms[1]);

    const [showSelectAlgorithmModal, setShowSelectAlgorithmModal] = useState(false);

    return <div className={'relative flex h-screen w-full flex-col xl:flex-row'}>

        <div className={'hidden max-h-screen w-full place-items-center overflow-auto rounded-md xl:grid xl:w-1/2'}>
            <SourceCodePreview sourceCode={sourceMap[selectedAlgorithm.value]}/>
        </div>
        <div
            className={'relative flex w-full grow flex-col items-center justify-start gap-5 p-3 py-5 xl:w-1/2 xl:p-[50px]'}>

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
                    {sortingAlgorithms.map((algorithm, index) => <button
                        key={index}
                        className={'border-1 flex w-full justify-start border-white p-3 px-5 text-xl text-white'}
                        onClick={() => {
                            setSelectedAlgorithm(algorithm);
                            setShowSelectAlgorithmModal(false);
                        }}>
                        {algorithm.label}
                    </button>)}
                    {sortingAlgorithms.map((algorithm, index) => <button
                        key={index}
                        className={'border-1 flex w-full justify-start border-white p-3 px-5 text-xl text-white'}
                        onClick={() => {
                            setSelectedAlgorithm(algorithm);
                            setShowSelectAlgorithmModal(false);
                        }}>
                        {algorithm.label}
                    </button>)}
                </div>
            </Modal>}
        </div>
    </div>;
};