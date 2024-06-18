function createSGF(imageData, w, h) {
   let fstI = imageData.slice();
   let scdI = imageData.slice();
  // iteration 1

  for (let y = 0; y < h; y++) {
    let v = [];
    let z = [];
    for (let x = 0; x < w; x++) {
      let col = fstI[y * 4 * w + x * 4];
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
        scdI[y * 4 * w + xi * 4] = 255;
        scdI[y * 4 * w + xi * 4 + 1] = 255;
        scdI[y * 4 * w + xi * 4 + 2] = 255;
      }
    } else {
      z.push(w);
    for (let i = 0; i < z.length - 1; i++) {
      for (let xi = Math.ceil(z[i]); xi < z[i + 1]; xi++) {
        let val = Math.trunc((xi - v[i]) * (xi - v[i]));
        scdI[y * 4 * w + xi * 4] = val;
        scdI[y * 4 * w + xi * 4 + 1] = val;
        scdI[y * 4 * w + xi * 4 + 2] = val;
      }
    }
  }
  }

  // iteration 2

  for (let x = 0; x < w; x++) {
    let v = [];
    let z = [];
    for (let y = 0; y < h; y++) {
      let col = scdI[y * 4 * w + x * 4];
      if (col != 255) {
        if (v[0] == undefined) {
          v.push(y);
          z = [0];
        } else {
          let fv = scdI[v[v.length - 1] * 4 * w + x * 4];
          let fy = scdI[y * 4 * w + x * 4];

          let ys = (v[v.length - 1] * v[v.length - 1] - y * y + fv - fy) / (2 * v[v.length - 1] - 2 * y);
        
          if (ys >= z[z.length - 1]) { 
            z.push(ys);
            v.push(y);
          } else {
            while (ys < z[z.length - 1] && v.length > 0) {
              v.pop();
              z.pop();

              fv = scdI[v[v.length - 1] * 4 * w + x * 4];
              fy = scdI[y * 4 * w + x * 4];

              ys = (v[v.length - 1] * v[v.length - 1] - y * y + fv - fy) / (2 * v[v.length - 1] - 2 * y);
            }
          
            if (v.length == 0) {
              v.push(y);
              z = [0];
            } else {
              z.push(ys);
              v.push(y);
            }
          }
        }
      }
    }

    if (z[0] == undefined) {
      for (let yi = 0; yi < h; yi++) {
        imageData[yi * 4 * w + x * 4] = 255;
        imageData[yi * 4 * w + x * 4 + 1] = 255;
        imageData[yi * 4 * w + x * 4 + 2] = 255;
      }
    } else {
      z.push(h);
    for (let i = 0; i < z.length - 1; i++) {
      for (let yi = Math.ceil(z[i]); yi < z[i + 1]; yi++) {
        let fv = scdI[v[i] * 4 * w + x * 4];

      //  fv = 0;

        let val = (yi - v[i]) * (yi - v[i]) + fv;
        
        val = Math.sqrt(val);
        val = val * 256 / 5;
        imageData[yi * 4 * w + x * 4] = val;
        imageData[yi * 4 * w + x * 4 + 1] = val;
        imageData[yi * 4 * w + x * 4 + 2] = val;
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
      context.putImageData(imgData, 0, img.naturalHeight);
    });
  });
  
}

window.addEventListener("load", () => {
  main();
});





//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
