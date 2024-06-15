function createSGF(imageData, w, h) {
   let fstI = imageData.slice();
  // iteration 1
  let v = [];
  let z = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let col = fstI[y * 4 * h + x * 4];
      if (col == 0) {
        if (v[0] == undefined) {
          v.push(x);
          z = [0];
        } else {
          let xs = (v[v.length - 1] * v[v.length - 1] - x * x) / (2 * v[v.length - 1] - 2 * x);
        
          z.push(xs);
          v.push(x);
        }
      }
    }
    if (z[0] == undefined) {
      for (let xi = 0; xi < w; xi++) {
        imageData[y * 4 * w + xi * 4] = 255;
        imageData[y * 4 * w + xi * 4 + 1] = 255;
        imageData[y * 4 * w + xi * 4 + 2] = 255;
      }
    } else {
    for (let i = 0; i < z.length; i++) {
      for (let xi = z[i]; xi < z[i + 1]; xi++) {
        imageData[y * 4 * w + xi * 4] = imageData[y * 4 * w + xi * 4 + 1] = imageData[y * 4 * w + xi * 4 + 2] = Math.trunc((xi - v[i]) * (xi - v[i]));
        if (xi + 1 >= z[i + 1])
          break;
      }
    }
  }
  }
}



function main() {
  const can = document.getElementById("mainCanvas");
  const imgInput = document.getElementById("img_loader");

  let context = can.getContext("2d");
  let img = new Image(47, 30);
  let imgData;
  let data;

  imgInput.addEventListener("change", () => {
    img.src = URL.createObjectURL(imgInput.files[0] );

    img.addEventListener("load", () => { 
      context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

      imgData = context.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
      data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        let sum = data[i] + data[i + 1] + data[i + 2];

        let v;
        if (sum > 382.5)
          v = 255;
        else
          v = 0;

        data[i] = data[i + 1] = data[i + 2] = v;
        
        data[i + 3] = 255;
        }
      context.putImageData(imgData, 0, 0);
      createSGF(data, img.naturalWidth, img.naturalHeight);
      context.putImageData(imgData, img.naturalWidth, 0);
    });
  });
  
}

window.addEventListener("load", () => {
  main();
});
