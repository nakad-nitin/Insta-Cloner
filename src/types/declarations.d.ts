/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "piexifjs" {
  // Add a basic declaration here (you can refine it if needed)
  const piexif: {
    load: (data: any) => {
      "0th": any;
      Exif: any;
      GPS: any;
      Interop: any;
      "1st": any;
      thumbnail: null;
    };
    dump(exif_dict_original: any): string;
    insert(exif: any, jpeg: any): any;
    [k: string]: any;
  };
  export = piexif;
}
