declare module 'pdfjs-dist/build/pdf' {
  import * as pdfjsLib from 'pdfjs-dist';
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  export * from 'pdfjs-dist';
}

declare module 'pdfjs-dist' {
  export * from 'pdfjs-dist/types/src/display/api';
  export * from 'pdfjs-dist/types/src/display/display_utils';
  export * from 'pdfjs-dist/types/src/shared/util';
  export * from 'pdfjs-dist/types/src/display/annotation_layer';
  export * from 'pdfjs-dist/types/src/display/api';
  export * from 'pdfjs-dist/types/src/display/display_utils';
  export * from 'pdfjs-dist/types/src/shared/util';
  export * from 'pdfjs-dist/types/src/display/annotation_layer';
}
