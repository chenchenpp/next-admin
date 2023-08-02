export function getFileBase64Handle(file: any) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      var txt = event?.target?.result;
      resolve(txt);
    };
  });
}
