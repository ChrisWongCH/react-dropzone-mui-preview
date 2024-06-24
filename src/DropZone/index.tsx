import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CircularProgress } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { DropZoneProps, FileWithPreview } from './DropZoneProps';
import './dropZone.scss';

const DropZoneWithPreview: React.FC<DropZoneProps> = ({
    fileChangeHandler,
    defaultFile,
    fileValidateFunc,
    onFileInvalidHandler,
}) => {
    const [file, setFile] = useState<FileWithPreview>();
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': [],
        },
        multiple: false,
        onDrop: async (acceptedFiles) => {
            setUploadLoading(true);
            const file = acceptedFiles[0];
            if (await fileValid(file)) {
                setFile(
                    Object.assign(acceptedFiles[0], {
                        preview: URL.createObjectURL(acceptedFiles[0]),
                    })
                );
            } else {
                onFileInvalidHandler && onFileInvalidHandler();
            }
            setUploadLoading(false);
        },
    });

    const fileValid = async (file: File) => {
        if (!fileValidateFunc) return true;
        const pass = await fileValidateFunc(file);
        return pass;
    };

    const clearFile = () => {
        setFile(undefined);
    };

    useEffect(() => {
        file && fileChangeHandler(file);
    }, [file]);

    useEffect(() => {
        setFile(defaultFile);
    }, [defaultFile]);

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => file && URL.revokeObjectURL(file.preview);
    }, []);

    const UploadSection = (
        <div
            {...getRootProps({
                className: 'DropZoneWithPreview__dropZone',
            })}
        >
            <input {...getInputProps()} />
            {uploadLoading ? (
                <CircularProgress color="primary" />
            ) : (
                <AddCircleIcon />
            )}
            <div>Upload Image</div>
        </div>
    );

    const PreviewSection = () => (
        <div className="DropZoneWithPreview__preview">
            <div
                className="DropZoneWithPreview__preview__remove-icon"
                onClick={clearFile}
            >
                <HighlightOffIcon />
            </div>
            <img
                src={file!.preview}
                width={120}
                height={120}
                alt="upload-img"
                onLoad={() => {
                    URL.revokeObjectURL(file!.preview);
                }}
            />
        </div>
    );
    return (
        <section className="DropZoneWithPreview">
            {file && file.preview ? <PreviewSection /> : UploadSection}
        </section>
    );
};

export default DropZoneWithPreview;
