export function getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf':
            return 'PDF';
        case 'doc':
        case 'docx':
            return 'Word';
        case 'xls':
        case 'xlsx':
            return 'Excel';
        case 'ppt':
        case 'pptx':
            return 'PowerPoint';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return 'Image';
        default:
            return 'Other';
    }
} 