export const getBase64FromFile = (file: any, cb: any) => {
  if (isFile(file) === true) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }
};

export const base64ToArrayBuffer = (base64) => {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  } /*from  w w w  . j  ava  2  s .  c o  m*/
  return bytes;
};
export const getBase64FromFilePromise = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (isFile(file) === true) {
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    }
    reader.onerror = (error) => reject(error);
  });

export const isFile = (input: any) => "File" in window && input instanceof File;
