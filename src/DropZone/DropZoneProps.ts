export type FileWithPreview = File & { preview: string };

export interface DropZoneProps {
    fileChangeHandler: (file: FileWithPreview) => void;
    defaultFile?: FileWithPreview;
    fileValidateFunc?: (file: File) => Promise<boolean> | boolean;
    onFileInvalidHandler?: () => void;
}
